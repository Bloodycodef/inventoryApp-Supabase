// app/components/shared/Link.tsx
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

interface LinkProps extends TouchableOpacityProps {
  text: string;
  highlightText?: string;
  align?: "left" | "center" | "right";
}

export const Link: React.FC<LinkProps> = ({
  text,
  highlightText,
  align = "center",
  style,
  ...rest
}) => {
  const getAlignStyle = () => {
    switch (align) {
      case "left":
        return styles.alignLeft;
      case "right":
        return styles.alignRight;
      default:
        return styles.alignCenter;
    }
  };

  const renderText = () => {
    if (highlightText) {
      const parts = text.split(highlightText);
      return (
        <Text style={styles.linkText}>
          {parts[0]}
          <Text style={styles.highlight}>{highlightText}</Text>
          {parts[1]}
        </Text>
      );
    }
    return <Text style={styles.linkText}>{text}</Text>;
  };

  return (
    <TouchableOpacity
      style={[styles.linkContainer, getAlignStyle(), style]}
      {...rest}
    >
      {renderText()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linkContainer: {
    marginTop: 20,
  },
  alignLeft: {
    alignSelf: "flex-start",
  },
  alignCenter: {
    alignSelf: "center",
  },
  alignRight: {
    alignSelf: "flex-end",
  },
  linkText: {
    color: "#666",
    fontSize: 14,
  },
  highlight: {
    color: "#4f46e5",
    fontWeight: "600",
  },
});
