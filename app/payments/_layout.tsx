import { Stack } from "expo-router";

export default function PaymentLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, title: "" }} />
      <Stack.Screen
        name="withdrawal"
        options={{ headerShown: false, title: "Withrawal Application" }}
      />
    </Stack>
  );
}
