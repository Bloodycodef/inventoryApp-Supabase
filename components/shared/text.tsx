// app/components/shared/Text.tsx
import React from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
} from "react-native";

interface TextProps extends RNTextProps {
  variant?: "default" | "title" | "subtitle" | "error" | "success" | "muted";
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = "default",
  style,
  children,
  ...rest
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case "title":
        return styles.title;
      case "subtitle":
        return styles.subtitle;
      case "error":
        return styles.error;
      case "success":
        return styles.success;
      case "muted":
        return styles.muted;
      default:
        return styles.default;
    }
  };

  return (
    <RNText style={[getVariantStyle(), style]} {...rest}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
    color: "#1F2937",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  error: {
    fontSize: 14,
    color: "#EF4444",
  },
  success: {
    fontSize: 14,
    color: "#10B981",
  },
  muted: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
