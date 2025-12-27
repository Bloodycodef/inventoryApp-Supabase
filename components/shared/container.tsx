// app/components/shared/Container.tsx
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  padding?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  padding = true,
  style,
  ...rest
}) => {
  return (
    <View
      style={[styles.container, padding && styles.padding, style]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfdfd",
    justifyContent: "center",
    alignItems: "center",
  },
  padding: {
    paddingHorizontal: 25,
  },
});
