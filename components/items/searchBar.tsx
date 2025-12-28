// components/items/SearchBar.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder: string;
  initialValue?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder,
  initialValue = "",
}) => {
  const [query, setQuery] = useState(initialValue);
  const inputRef = useRef<TextInput>(null);

  // Update state ketika initialValue berubah
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Debounce search untuk performance
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleChange = (text: string) => {
    setQuery(text);
  };

  const clearSearch = () => {
    setQuery("");
    // Focus kembali ke input setelah clear
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#6B7280"
          style={styles.searchIcon}
        />
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          value={query}
          onChangeText={handleChange}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          // Penting untuk iOS agar keyboard tidak hilang
          keyboardShouldPersistTaps="handled"
          // Penting untuk Android
          blurOnSubmit={false}
          // Pengaturan spesifik platform
          {...Platform.select({
            ios: {
              clearButtonMode: "never", // Nonaktifkan clear button bawaan iOS
            },
          })}
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={clearSearch}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingVertical: Platform.OS === "ios" ? 0 : 4,
    // Penting untuk Android
    includeFontPadding: false,
    // Mencegah layout shift
    minHeight: Platform.OS === "ios" ? 20 : 24,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
});
