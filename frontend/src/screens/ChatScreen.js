import * as React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

import BackBubble from "../components/BackBubble";
import HeaderBar from "../components/HeaderBar";
import ScreenScaffold from "../components/ScreenScaffold";
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
        text: `Hi, I'm interested in ${dog.dog_name}.`,
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
    <ScreenScaffold>
      <BackBubble navigation={navigation} />
      <HeaderBar title="Chat" />

      <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 16 }}>
        <View style={styles.chatDogPanel}>
          <Text style={styles.chatDogName}>
            {dog ? dog.dog_name : "Selected Dog"}
          </Text>
          <Text style={styles.chatShelter}>{shelterName}</Text>
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
                style={[styles.chatBubble, isUser && styles.chatBubbleUser]}
              >
                <Text style={styles.chatSender}>{item.sender}</Text>
                <Text style={styles.chatBody}>{item.text}</Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.chatInputRow}>
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
            placeholderTextColor="#687179"
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity
            style={[styles.button, styles.sendButtonCompact]}
            onPress={handleSend}
            activeOpacity={0.9}
          >
            <Text style={[styles.buttonText, styles.buttonTextInk]}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenScaffold>
  );
}
