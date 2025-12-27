// app/items/components/ItemContainer.tsx
import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

interface ItemContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
}

export const ItemContainer: React.FC<ItemContainerProps> = ({
  children,
  style,
  scrollable = true,
}) => {
  const Container = scrollable ? ScrollView : View;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <Container
        style={[styles.content, style]}
        contentContainerStyle={scrollable ? styles.scrollContent : undefined}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Container>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Memberikan ruang untuk floating button
  },
});
