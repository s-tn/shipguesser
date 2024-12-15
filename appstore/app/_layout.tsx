import { Stack } from "expo-router";
import { Text } from "react-native";

export default function RootLayout() {
  return <Stack screenOptions={{
    headerShown: false,
    contentStyle: {'backgroundColor': 'rgb(24 36 68)'},
  }} />;
}
