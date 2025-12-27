// app/components/shared/Input.tsx
import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  variant?: "default" | "outline" | "filled";
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({
  variant = "default",
  error = false,
  style,
  ...props
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case "outline":
        return styles.outline;
      case "filled":
        return styles.filled;
      default:
        return styles.default;
    }
  };

  return (
    <TextInput
      style={[styles.input, getVariantStyle(), error && styles.error, style]}
      placeholderTextColor="#999"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  default: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  outline: {
    borderWidth: 2,
    borderColor: "#4f46e5",
    backgroundColor: "#fff",
  },
  filled: {
    borderWidth: 0,
    backgroundColor: "#f8f9fa",
  },
  error: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
});
