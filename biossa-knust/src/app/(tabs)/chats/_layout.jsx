import { Drawer } from 'expo-router/drawer';
import React from 'react';

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen name="ChatMode" options={{ title: 'Chat Mode' }} />
      <Drawer.Screen name="ExamMode" options={{ title: 'Exam Mode' }} />
      <Drawer.Screen name="ChatBot" options={{ title: 'Chat Bot' }} />
    </Drawer>
  );
}
