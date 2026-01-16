// use global fetch (Node 18+)
const crypto = require('crypto');
const ChatCache = require('../models/chatCacheModel');
const AppError = require('../utils/appError');

// Helper to hash prompt for cache key
const hashPrompt = (prompt) =>
  crypto.createHash('sha256').update(prompt).digest('hex');

// POST /api/v1/ai/chat
// Supports streaming via text/event-stream when ?stream=1 is sent
exports.chatProxy = async (req, res, next) => {
  try {
    const { message, model = 'gpt-3.5-turbo' } = req.body;
    if (!message) return next(new AppError('`message` is required', 400));

    const promptHash = hashPrompt(`${model}:${message}`);

    // Try cache
    const cached = await ChatCache.findOne({ promptHash });
    if (cached) {
      // If client expects event-stream, stream cached response as single event
      if (
        req.query.stream === '1' ||
        req.headers.accept === 'text/event-stream'
      ) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.write(
          `data: ${JSON.stringify({ cached: true, text: cached.response })}\n\n`,
        );
        return res.end();
      }

      return res.status(200).json({ cached: true, text: cached.response });
    }

    // Ensure API key present
    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_KEY)
      return next(new AppError('OpenAI API key not configured on server', 500));

    // Use OpenAI Chat Completions streaming endpoint
    const body = {
      model,
      messages: [{ role: 'user', content: message }],
      stream:
        req.query.stream === '1' || req.headers.accept === 'text/event-stream',
    };

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return next(new AppError('AI provider error: ' + errText, 502));
    }

    const isStream = body.stream;

    if (isStream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let aggregated = '';

      // Read streaming chunks and forward them as SSE messages
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // OpenAI stream uses lines prefixed with "data: "
        // Just forward raw chunk as data event
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        aggregated += chunk;
      }

      // Save aggregated text to cache (best-effort - strip OpenAI stream markers)
      try {
        // crude extraction of text tokens if present
        const text = aggregated
          .replace(/\n?data: /g, '')
          .replace(/\[DONE\]/g, '');
        await ChatCache.create({
          promptHash,
          prompt: message,
          response: text,
          model,
        });
      } catch (e) {
        // ignore cache errors
        console.error('cache save error', e);
      }

      return res.end();
    }

    // Non-streaming: parse response and cache
    const json = await resp.json();
    const text =
      json.choices && json.choices[0] && json.choices[0].message
        ? json.choices[0].message.content
        : json.choices && json.choices[0] && json.choices[0].text
          ? json.choices[0].text
          : '';

    // write cache
    try {
      await ChatCache.create({
        promptHash,
        prompt: message,
        response: text,
        model,
      });
    } catch (e) {
      console.error('cache save error', e);
    }

    return res.status(200).json({ cached: false, text });
  } catch (err) {
    next(err);
  }
};
