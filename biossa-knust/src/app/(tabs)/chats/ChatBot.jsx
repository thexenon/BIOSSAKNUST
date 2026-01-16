import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import SafeKeyboardView from '../../../components/SafeKeyboardView';
import { COLORS, SIZES } from '../../../constants';
import styles from '../../../styles/globalStyles';
import ErrorView from '../../../components/ErrorView';

const aiChatResponse = async (message) => {
  // Use a public conversational model from Hugging Face (no API key required)
  // Model: facebook/blenderbot-400M-distill
  const endpoint =
    'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: message,
      }),
    });
    console.log('====================================');
    console.log(response);
    console.log('====================================');
    if (!response.ok) {
      throw new Error('Failed to connect to AI service.');
    }
    const data = await response.json();
    // The model returns 'generated_text' or an array with 'generated_text'
    let aiText = "Sorry, I couldn't generate a response.";
    if (typeof data === 'object' && data.generated_text) {
      aiText = data.generated_text;
    } else if (Array.isArray(data) && data[0]?.generated_text) {
      aiText = data[0].generated_text;
    }
    return { text: aiText };
  } catch (error) {
    throw new Error(error.message || 'AI service unavailable.');
  }
};

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm BioBot. Ask me anything about biology!",
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);
    try {
      // Use real AI API call
      const aiRes = await aiChatResponse(userMsg.text);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: aiRes.text, sender: 'bot' },
      ]);
    } catch (e) {
      setError(e.message || 'Failed to get response. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
        backgroundColor: item.sender === 'user' ? COLORS.primary : COLORS.gray2,
        borderRadius: 16,
        marginVertical: 4,
        padding: 12,
        maxWidth: '80%',
      }}
    >
      <Text
        style={{ color: item.sender === 'user' ? COLORS.white : COLORS.black }}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeKeyboardView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={{ flex: 1, padding: SIZES.medium }}>
          <Text style={styles.welcome}>BioBot Chat</Text>
          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingVertical: 10 }}
            inverted
          />
          {error && <ErrorView msg={error} />}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: SIZES.small,
            backgroundColor: COLORS.white,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              borderColor: COLORS.gray2,
              borderWidth: 1,
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 10,
              marginRight: 8,
              backgroundColor: COLORS.lightWhite,
            }}
            placeholder="Type your biology question..."
            value={input}
            onChangeText={setInput}
            editable={!isLoading}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={isLoading || !input.trim()}
          >
            <View
              style={{
                backgroundColor:
                  isLoading || !input.trim() ? COLORS.gray2 : COLORS.primary,
                borderRadius: 20,
                padding: 12,
              }}
            >
              {isLoading ? (
                <ActivityIndicator color={COLORS.white} size="small" />
              ) : (
                <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>
                  Send
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeKeyboardView>
  );
};

export default ChatBot;
