// app/items/components/FloatingButton.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface FloatingButtonProps {
  isVisible: boolean;
  onPress: () => void;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  isVisible,
  onPress,
}) => {
  // Tombol harus selalu muncul jika user adalah admin
  // isVisible hanya untuk mengubah icon

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.floatingButton, isVisible && styles.floatingButtonActive]}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name={isVisible ? "close" : "plus"}
        size={28}
        color="#FFFFFF"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#3B82F6",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1000, // Pastikan tombol di atas komponen lain
  },
  floatingButtonActive: {
    backgroundColor: "#DC2626",
    transform: [{ rotate: "45deg" }],
  },
});
