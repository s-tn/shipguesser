import { Text, View } from "react-native";

// webview
import React from "react";
import { WebView } from "react-native-webview";

export default function Index() {
  return (
    <WebView
      source={{ uri: "https://shipguesser.space" }}
      style={{  }}
      containerStyle={{  }}
    />
  );
}
