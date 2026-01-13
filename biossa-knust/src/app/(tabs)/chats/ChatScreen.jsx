import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';

/* ===============================================
  AI helper (same as before)
=================================================*/
const aiChatResponse = async (message, mode = 'chat') => {
  const endpoint =
    'https://hf.space/embed/facebook/blenderbot-400M-distill/api/predict/';
  let prompt =
    mode === 'chat'
      ? `You are BioBot, a friendly biology tutor. Answer clearly:\n${message}`
      : `You are BioBot, a biology teacher creating MCQs. Provide 1 question, 4 options, correct answer and explanation:\n${message}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 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',
      },
      body: JSON.stringify({ inputs: prompt }),
    });
    console.log('====================================');
    console.log(response);
    console.log('====================================');
    const data = await response.json();
    return {
      text:
        data?.[0]?.generated_text?.replace(prompt, '').trim() ||
        'Sorry, I could not generate an answer.',
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/* ===============================================
  ChatScreen Component
=================================================*/
const ChatScreen = ({ mode }) => {
  const storageKey = `@biobot_${mode}_chats`;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(storageKey);
      if (saved) setMessages(JSON.parse(saved));
      else if (mode === 'chat') {
        setMessages([
          {
            id: 1,
            text: "Hi! 🌿 I'm BioBot. Ask me anything about biology!",
            sender: 'bot',
          },
        ]);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(storageKey, JSON.stringify(messages)).catch(
      console.log
    );
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const aiRes = await aiChatResponse(input, mode);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: aiRes.text, sender: 'bot' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 2, text: '⚠️ Sorry, AI failed.', sender: 'bot' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    if (messages.length === 0)
      return Alert.alert('No messages', 'Nothing to export.');
    let html = `<h1>${
      mode === 'chat' ? 'BioBot Chat Notes' : 'BioBot Exam Notes'
    }</h1>`;
    messages.forEach((m) => {
      html += `<p><strong>${m.sender === 'user' ? 'You' : 'BioBot'}:</strong> ${
        m.text
      }</p>`;
    });

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (e) {
      Alert.alert('Error', 'Could not save PDF');
    }
  };

  const renderItem = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View
        style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}
      >
        {!isUser && <Text style={styles.botName}>BioBot</Text>}
        <Text style={styles.bubbleText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#e8f5e9', '#ffffff']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 16,
          }}
        >
          <Text style={styles.header}>
            {mode === 'chat' ? '🧬 Chat Mode' : '📚 Exam Mode'}
          </Text>
          <TouchableOpacity style={styles.toolbarBtn} onPress={exportPDF}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save PDF</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
        />

        {loading && (
          <View style={styles.typing}>
            <ActivityIndicator size="small" color="#2e7d32" />
            <Text style={{ marginLeft: 8 }}>BioBot is typing…</Text>
          </View>
        )}

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder={
              mode === 'exam'
                ? 'Ask for MCQs about biology topic...'
                : 'Ask about cells, DNA, photosynthesis...'
            }
            value={input}
            onChangeText={setInput}
            editable={!loading}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              (!input.trim() || loading) && { opacity: 0.5 },
            ]}
            onPress={sendMessage}
            disabled={!input.trim() || loading}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ChatScreen;

const styles = {
  header: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32' },
  bubble: { padding: 14, borderRadius: 18, marginBottom: 10, maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#2e7d32' },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#f1f8e9' },
  bubbleText: { color: '#000' },
  botName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#388e3c',
  },
  typing: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  inputBar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendBtn: {
    marginLeft: 8,
    backgroundColor: '#2e7d32',
    paddingHorizontal: 18,
    justifyContent: 'center',
    borderRadius: 20,
  },
  toolbarBtn: {
    backgroundColor: '#43a047',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
};
