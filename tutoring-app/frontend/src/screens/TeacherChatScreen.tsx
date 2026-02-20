import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { borderRadius, spacing, typography, webMaxWidth } from '../styles/theme';
import { Icon } from '../components/Icon';
import apiClient from '../api/client';

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: string;
}

const suggestions = [
  'Genere un exercice sur les fractions.',
  'Propose une explication simple pour la classe.',
  'Idees de quiz rapide pour 10 minutes.',
  'Comment evaluer la comprehension ?'
];

export default function TeacherChatScreen() {
  const { colors } = useTheme();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      text: 'Bonjour ! Je suis votre tuteur IA pour l\'enseignement. Comment puis-je vous aider ?',
      timestamp: formatTime(),
    },
  ]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.gray50,
        },
        content: {
          flex: 1,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          ...webMaxWidth(960),
        },
        suggestionRow: {
          marginBottom: spacing.md,
        },
        suggestionChip: {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          backgroundColor: colors.white,
          borderRadius: borderRadius.full,
          borderWidth: 1,
          borderColor: colors.gray200,
          marginRight: spacing.sm,
        },
        suggestionText: {
          ...typography.body2,
          color: colors.gray700,
        },
        messageRow: {
          flexDirection: 'row',
          marginBottom: spacing.md,
        },
        messageRowUser: {
          justifyContent: 'flex-end',
        },
        bubble: {
          maxWidth: '78%',
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: borderRadius.lg,
          backgroundColor: colors.white,
          borderWidth: 1,
          borderColor: colors.gray200,
        },
        bubbleUser: {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
        bubbleAssistant: {
          backgroundColor: colors.white,
          borderColor: colors.gray200,
        },
        messageText: {
          ...typography.body2,
          color: colors.gray900,
        },
        messageTextUser: {
          color: colors.white,
        },
        timeText: {
          ...typography.caption,
          color: colors.gray500,
          marginTop: spacing.xs,
        },
        timeTextUser: {
          color: colors.primaryLight,
        },
        typingBubble: {
          backgroundColor: colors.gray100,
          borderColor: colors.gray200,
        },
        inputBar: {
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderTopWidth: 1,
          borderTopColor: colors.gray200,
          backgroundColor: colors.white,
          ...webMaxWidth(960),
        },
        inputRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        },
        textInput: {
          flex: 1,
          minHeight: 44,
          maxHeight: 120,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: borderRadius.lg,
          borderWidth: 1,
          borderColor: colors.gray200,
          backgroundColor: colors.gray50,
          color: colors.gray900,
          ...typography.body2,
        },
        sendButton: {
          height: 44,
          width: 44,
          borderRadius: 22,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary,
        },
        sendButtonDisabled: {
          backgroundColor: colors.gray300,
        },
      }),
    [colors]
  );

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;

    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      role: 'user',
      text: content,
      timestamp: formatTime(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await apiClient.post('/auth/chat/', { message: content });
      const data = res.data ?? res;
      const assistantText = data.reply || 'Désolé, aucune réponse.';
      const reply: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: assistantText,
        timestamp: formatTime(),
      };
      setMessages((prev) => [...prev, reply]);

      if (data.sources && Array.isArray(data.sources) && data.sources.length) {
        const srcText = 'Sources: ' + data.sources.map((s: any) => s.source || s.id).join(', ');
        const srcMsg: ChatMessage = {
          id: `s-${Date.now()}`,
          role: 'assistant',
          text: srcText,
          timestamp: formatTime(),
        };
        setMessages((prev) => [...prev, srcMsg]);
      }
    } catch (err) {
      const errMsg: ChatMessage = {
        id: `e-${Date.now()}`,
        role: 'assistant',
        text: 'Erreur de connexion au tuteur. Veuillez réessayer.',
        timestamp: formatTime(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';

    return (
      <View style={[styles.messageRow, isUser ? styles.messageRowUser : null]}>
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
          <Text style={[styles.messageText, isUser ? styles.messageTextUser : null]}>{item.text}</Text>
          <Text style={[styles.timeText, isUser ? styles.timeTextUser : null]}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <View style={styles.content}>
          <View style={styles.suggestionRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {suggestions.map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  style={styles.suggestionChip}
                  onPress={() => handleSend(suggestion)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: spacing.lg }}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              isTyping ? (
                <View style={styles.messageRow}>
                  <View style={[styles.bubble, styles.typingBubble]}>
                    <Text style={styles.messageText}>Le tuteur ecrit...</Text>
                  </View>
                </View>
              ) : null
            }
          />
        </View>

        <View style={styles.inputBar}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Ecrivez votre demande..."
              placeholderTextColor={colors.gray400}
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !input.trim() ? styles.sendButtonDisabled : null]}
              onPress={() => handleSend()}
              activeOpacity={0.8}
              disabled={!input.trim()}
            >
              <Icon library="Feather" name="send" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function formatTime(date = new Date()) {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function buildAssistantReply(content: string) {
  const lower = content.toLowerCase();

  if (lower.includes('exercice') || lower.includes('quiz')) {
    return 'Je peux proposer un exercice guide ou un quiz rapide. Quel niveau et quelle duree ?';
  }

  if (lower.includes('explication') || lower.includes('simple')) {
    return 'D\'accord. Donnez le concept et le niveau, je prepare une explication progressive.';
  }

  if (lower.includes('evaluer') || lower.includes('evaluation')) {
    return 'Je peux suggerer des criteres et des indicateurs pour mesurer la comprehension.';
  }

  return 'Je peux aider avec la preparation de cours, des exercices et des plans de seance.';
}
