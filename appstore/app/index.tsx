import { SafeAreaView, Text, View } from "react-native";

// webview
import React from "react";
import { WebView } from "react-native-webview";

export default function Index() {
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          source={{ uri: /*"http://10.103.114.50:4000"*/"https://shipguesser.space" }}
          style={{ backgroundColor: "rgb(24 36 68)" }}
          containerStyle={{ 
            backgroundColor: "rgb(24 36 68)"
           }}
          nativeConfig={{

          }}
        />
      </SafeAreaView>
    </>
  );
}
