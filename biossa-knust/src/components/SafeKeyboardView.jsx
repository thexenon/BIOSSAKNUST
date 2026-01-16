import React from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/globalStyles';

const SafeKeyboardView = ({ children, style, keyboardVerticalOffset = 80 }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      // keyboardVerticalOffset={keyboardVerticalOffset}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
    >
      <SafeAreaView style={[styles.safeSpace, style]}>
        <View style={{ flex: 1 }}>{children}</View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SafeKeyboardView;
