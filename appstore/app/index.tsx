import { Text, View } from "react-native";

// webview
import React from "react";
import { WebView } from "react-native-webview";

export default function Index() {
  return (
    <WebView
      source={{ uri: "https://shiguesser.space" }}
      style={{ marginTop: 20 }}
    />
  );
}
