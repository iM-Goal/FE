import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

type Message = {
  id: string;
  role: "ai" | "user";
  text: string;
  time: string;
};

type QuickAction = {
  id: string;
  label: string;
  reply: string;
};

const initialMessages: Message[] = [
  {
    id: "1",
    role: "ai",
    text: "안녕하세요 민수님! 👋\n오늘 목표까지 96,000원 남았어요.",
    time: "오전 9:41",
  },
  {
    id: "2",
    role: "user",
    text: "오늘 친구랑 술 약속 있는데 괜찮을까?",
    time: "오전 9:42",
  },
  {
    id: "3",
    role: "ai",
    text: "괜찮아요! 오늘 3만 원 정도는 목표에 영향 없어요.\n대신 이번 주 배달은 한 번만 줄여볼까요?",
    time: "오전 9:43",
  },
];

const quickActions: QuickAction[] = [
  {
    id: "yes",
    label: "좋아요! 👍",
    reply:
      "좋아요. 오늘 약속 예산은 30,000원으로 잡아둘게요. 결제 후 남은 목표 금액도 바로 다시 계산해드릴게요.",
  },
  {
    id: "other",
    label: "다른 방법 보기",
    reply:
      "그럼 2가지 방법이 있어요.\n1. 약속 예산을 25,000원으로 낮추기\n2. 이번 주 배달 1회를 줄여서 균형 맞추기",
  },
];

function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const period = hours < 12 ? "오전" : "오후";
  const displayHour = hours % 12 || 12;

  return `${period} ${displayHour}:${minutes}`;
}

function createAiReply(text: string) {
  if (text.includes("술") || text.includes("약속")) {
    return "오늘 약속은 괜찮아요. 다만 택시비까지 포함하면 예산이 커질 수 있어서, 귀가비 10,000원은 따로 잠가둘게요.";
  }

  if (text.includes("배달") || text.includes("식비")) {
    return "이번 주 식비 흐름을 보면 배달을 한 번만 줄여도 목표 달성 가능성이 꽤 올라가요.";
  }

  return "좋아요. 지금 소비 흐름 기준으로 목표에 영향이 있는지 먼저 계산해볼게요.";
}

function BackgroundGlow() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={["#FBF7FB", "#F6FBFF", "#F8F9FC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.glowCircle, styles.glowMintTop]} />
      <View style={[styles.glowCircle, styles.glowBlueRight]} />
      <View style={[styles.glowCircle, styles.glowCyanLeft]} />
      <View style={[styles.glowCircle, styles.glowLilacBottom]} />

      <BlurView intensity={64} tint="light" style={StyleSheet.absoluteFill} />
    </View>
  );
}

function AiAvatar() {
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>AI</Text>
    </View>
  );
}

function AnimatedMessage({ item }: { item: Message }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;
  const isUser = item.role === "user";

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateY]);

  return (
    <Animated.View
      style={[
        styles.messageRow,
        isUser && styles.userMessageRow,
        { opacity: fadeAnim, transform: [{ translateY }] },
      ]}
    >
      {!isUser && <AiAvatar />}

      <View style={[styles.messageColumn, isUser && styles.userMessageColumn]}>
        {isUser ? (
          <LinearGradient
            colors={["#03A28F", "#03A28F"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.bubble, styles.userBubble]}
          >
            <Text style={[styles.messageText, styles.userMessageText]}>
              {item.text}
            </Text>
          </LinearGradient>
        ) : (
          <BlurView intensity={34} tint="light" style={styles.aiBubbleBlur}>
            <View style={[styles.bubble, styles.aiBubble]}>
              <Text style={[styles.messageText, styles.aiMessageText]}>
                {item.text}
              </Text>
            </View>
          </BlurView>
        )}

        <Text style={[styles.timeText, isUser && styles.userTimeText]}>
          {item.time}
        </Text>
      </View>
    </Animated.View>
  );
}

function TypingBubble() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 520,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 520,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [pulse]);

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  return (
    <View style={styles.typingRow}>
      <AiAvatar />
      <Animated.View style={[styles.typingBubble, { transform: [{ scale }] }]}>
        <View style={styles.typingDot} />
        <View style={[styles.typingDot, styles.typingDotMiddle]} />
        <View style={styles.typingDot} />
      </Animated.View>
    </View>
  );
}

export default function ChatScreen({ navigation }: any) {
  const listRef = useRef<FlatList<Message>>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  };

  const addAiMessage = (text: string, delay = 650) => {
    setIsAiTyping(true);
    scrollToBottom();

    setTimeout(() => {
      const aiMessage: Message = {
        id: `${Date.now()}-ai`,
        role: "ai",
        text,
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsAiTyping(false);
      scrollToBottom();
    }, delay);
  };

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || isAiTyping) return;

    const userMessage: Message = {
      id: String(Date.now()),
      role: "user",
      text: trimmed,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    addAiMessage(createAiReply(trimmed), 800);
  };

  const runQuickAction = (action: QuickAction) => {
    if (isAiTyping) return;

    const userMessage: Message = {
      id: String(Date.now()),
      role: "user",
      text: action.label,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    addAiMessage(action.reply, 520);
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundGlow />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
      >
        <BlurView intensity={30} tint="light" style={styles.header}>
          <TouchableOpacity
            style={styles.headerIconButton}
            activeOpacity={0.7}
            onPress={() => navigation?.goBack?.()}
          >
            <Ionicons name="chevron-back" size={25} color="#047A84" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>iM AI 페이스메이커</Text>

          <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.7}>
            <Ionicons name="ellipsis-horizontal" size={22} color="#111827" />
          </TouchableOpacity>
        </BlurView>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AnimatedMessage item={item} />}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          keyboardShouldPersistTaps="handled"
          ListFooterComponent={
            <>
              {isAiTyping && <TypingBubble />}

              <View style={styles.quickReplies}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={[
                      styles.quickReplyButton,
                      isAiTyping && styles.quickReplyButtonDisabled,
                    ]}
                    activeOpacity={0.82}
                    onPress={() => runQuickAction(action)}
                    disabled={isAiTyping}
                  >
                    <Text style={styles.quickReplyText}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          }
        />

        <View style={styles.inputArea}>
          <BlurView intensity={42} tint="light" style={styles.inputBoxBlur}>
            <View style={styles.inputBox}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="메시지를 입력하세요..."
                placeholderTextColor="#8A96A8"
                style={styles.input}
                multiline
                maxLength={300}
                onSubmitEditing={sendMessage}
              />

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!input.trim() || isAiTyping) && styles.sendButtonDisabled,
                ]}
                activeOpacity={0.85}
                onPress={sendMessage}
                disabled={!input.trim() || isAiTyping}
              >
                <Ionicons name="arrow-up" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    overflow: "hidden",
  },
  keyboardView: {
    flex: 1,
  },
  glowCircle: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.37,
  },
  glowMintTop: {
    width: 220,
    height: 220,
    top: 32,
    left: -96,
    backgroundColor: "#A8F0E6",
  },
  glowBlueRight: {
    width: 300,
    height: 300,
    top: 86,
    right: -108,
    backgroundColor: "#BDEAFF",
  },
  glowCyanLeft: {
    width: 280,
    height: 280,
    top: 310,
    left: -130,
    backgroundColor: "#C7F5F1",
  },
  glowLilacBottom: {
    width: 360,
    height: 360,
    right: -138,
    bottom: -138,
    backgroundColor: "#EEF0FF",
  },
  header: {
    height: 58,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(15, 23, 42, 0.06)",
    overflow: "hidden",
  },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#101828",
    letterSpacing: 0,
  },
  messageList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 22,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  userMessageRow: {
    justifyContent: "flex-end",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(204, 246, 239, 0.88)",
    borderWidth: 1,
    borderColor: "rgba(31, 184, 168, 0.28)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  avatarText: {
    color: "#08A39A",
    fontSize: 17,
    fontWeight: "500",
  },
  messageColumn: {
    maxWidth: "78%",
  },
  userMessageColumn: {
    alignItems: "flex-end",
  },
  bubble: {
    paddingHorizontal: 17,
    paddingVertical: 14,
    borderRadius: 20,
  },
  aiBubbleBlur: {
    overflow: "hidden",
    borderRadius: 20,
    borderTopLeftRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  aiBubble: {
    borderTopLeftRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.68)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255, 255, 255, 0.82)",
  },
  userBubble: {
    borderTopRightRadius: 6,
    shadowColor: "#345e57",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700",
    letterSpacing: 0,
  },
  aiMessageText: {
    color: "#111827",
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  timeText: {
    marginTop: 7,
    marginLeft: 5,
    fontSize: 11,
    color: "#98A2B3",
    fontWeight: "500",
  },
  userTimeText: {
    marginRight: 5,
    textAlign: "right",
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  typingBubble: {
    minWidth: 58,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 19,
    borderTopLeftRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.82)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  typingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#7C8CA3",
  },
  typingDotMiddle: {
    marginHorizontal: 5,
    opacity: 0.62,
  },
  quickReplies: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 12,
    marginBottom: 18,
  },
  quickReplyButton: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(11, 139, 139, 0.72)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.72)",
  },
  quickReplyButtonDisabled: {
    opacity: 0.52,
  },
  quickReplyText: {
    color: "#03A28F",
    fontSize: 13,
    fontWeight: "800",
  },
  inputArea: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 12 : 14,
  },
  inputBoxBlur: {
    minHeight: 58,
    maxHeight: 116,
    borderRadius: 29,
    overflow: "hidden",
    shadowColor: "#0F766E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 18,
    elevation: 3,
  },
  inputBox: {
    minHeight: 58,
    maxHeight: 116,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: "rgba(133, 171, 177, 0.35)",
    backgroundColor: "rgba(255, 255, 255, 0.66)",
    paddingLeft: 20,
    paddingRight: 7,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    maxHeight: 90,
    paddingVertical: 12,
    paddingRight: 10,
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#03A28F",
  },
  sendButtonDisabled: {
    backgroundColor: "#98d3cc",
  },
});
