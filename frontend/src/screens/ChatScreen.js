import * as React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

import BackBubble from "../components/BackBubble";
import HeaderBar from "../components/HeaderBar";
import { styles } from "../styles/styles";

/**
 * ChatScreen
 * Local demo chat opened after contacting a shelter.
 * This follows the RAD/UML flow without requiring live messaging backend support.
 */
export default function ChatScreen({ navigation, route }) {
  const dog = route?.params?.dog || null;
  const shelterName = route?.params?.shelterName || "Shelter";

  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState(() => {
    if (!dog) return [];

    return [
      {
        id: 1,
        sender: shelterName,
        text: `Hi! Thanks for your interest in ${dog.dog_name}. How can we help?`,
      },
      {
        id: 2,
        sender: "You",
        text: `Hi, I’m interested in ${dog.dog_name}.`,
      },
    ];
  });

  /**
   * handleSend
   * Adds a local message to the chat for demo purposes.
   */
  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "You",
        text: trimmed,
      },
    ]);

    setMessage("");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <BackBubble navigation={navigation} />
      <HeaderBar title="Chat" />

      <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 16 }}>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 14,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontWeight: "900", fontSize: 16 }}>
            {dog ? dog.dog_name : "Selected Dog"}
          </Text>
          <Text style={{ marginTop: 4, color: "#6b7280", fontWeight: "700" }}>
            {shelterName}
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((item) => {
            const isUser = item.sender === "You";

            return (
              <View
                key={item.id}
                style={{
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  backgroundColor: isUser ? "#ff6b6b" : "white",
                  borderRadius: 16,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  marginBottom: 10,
                  maxWidth: "78%",
                }}
              >
                <Text
                  style={{
                    fontWeight: "900",
                    marginBottom: 4,
                    color: isUser ? "white" : "#111827",
                  }}
                >
                  {item.sender}
                </Text>

                <Text
                  style={{
                    color: isUser ? "white" : "#111827",
                    fontWeight: "600",
                  }}
                >
                  {item.text}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <TextInput
            style={[
              styles.input,
              {
                flex: 1,
                marginVertical: 0,
                marginRight: 10,
              },
            ]}
            placeholder="Type a message"
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity
            style={[
              styles.button,
              {
                width: 92,
                marginVertical: 0,
              },
            ]}
            onPress={handleSend}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}