import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

const FloatingActionButton = ({ handlePress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.fab} onPress={handlePress}>
        <Text style={styles.fabText}>+</Text>
        <Text style={styles.fabText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  fab: {
    position: "absolute",
    width: 80,
    height: 80,
    backgroundColor: "#6200ee",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    bottom: 20,
    right: 20,
    top: 400,
    elevation: 5, // For shadow on Android
    shadowColor: "#000", // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default FloatingActionButton;
