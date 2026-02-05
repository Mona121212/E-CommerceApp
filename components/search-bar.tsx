import { SearchBarProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  onSearch,
  initialValue = "",
}) => {
  const [query, setQuery] = useState(initialValue);

  // update local state if initialValue changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // handle Search action
  const handleSearch = () => {
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };
  const handleClear = (): void => {
    setQuery("");
    if (onSearch) {
      onSearch("");
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />

        <TextInput
          placeholder="Search products..."
          style={styles.input}
          value={query}
          onChangeText={(text: string) => {
            setQuery(text);
            if (text === "" && onSearch) {
              onSearch("");
            }
          }}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {query.length > 0 && (
          <Ionicons
            name="close-circle"
            size={20}
            color="#888"
            style={styles.clearButton}
            onPress={handleClear}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={handleSearch}
        style={styles.searchButton}
        disabled={!query.trim().length}
      >
        <Ionicons name="arrow-forward" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: "#5b37b7",
    borderRadius: 8,
    marginLeft: 8,
    maxHeight: 48,
    maxWidth: 48,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5B3737",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
