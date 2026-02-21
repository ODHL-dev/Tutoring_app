import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { Icon } from '../components/Icon';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/client';

interface Matter {
  id: string;
  matiere: string;
  chapitre: string;
  objectif: string;
  niveau_difficulte: 'facile' | 'moyen' | 'difficile' | 'expert';
  progression: number;
  created_at: string;
  updated_at: string;
}

interface Exercise {
  question: string;
  options: {
    id: string;
    text: string;
    is_correct: boolean;
    explanation: string;
  }[];
  difficulty: string;
  competencies: string[];
  hint?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  exercise?: Exercise;
  timestamp: Date;
}

const { width } = Dimensions.get('window');

function getApiErrorMessage(error: unknown): string {
  const err = error as { response?: { status?: number; data?: { error?: string; detail?: string } }; message?: string };
  if (err.response?.status === 401) return 'Session expirée. Reconnectez-vous.';
  if (err.response?.status === 403) return err.response?.data?.error ?? 'Accès refusé (profil élève requis).';
  return (err.response?.data?.error ?? err.response?.data?.detail ?? err.message) || 'Erreur de connexion.';
}

export default function TutoringScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [matters, setMatters] = useState<Matter[]>([]);
  const [selectedMatter, setSelectedMatter] = useState<Matter | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showMatterSelector, setShowMatterSelector] = useState(true);
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Charger les matières
  useEffect(() => {
    loadMatters();
  }, []);

  const mapMatterFromApi = (item: {
    id: number | string;
    matiere: string;
    chapitre?: string | null;
    objectif?: string;
    niveau_difficulte?: string;
    progression?: number;
    created_at?: string;
    updated_at?: string;
  }): Matter => ({
    id: String(item.id),
    matiere: item.matiere,
    chapitre: item.chapitre || 'Général',
    objectif: item.objectif || '',
    niveau_difficulte: (item.niveau_difficulte as Matter['niveau_difficulte']) || 'moyen',
    progression: typeof item.progression === 'number' ? item.progression : 0,
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString(),
  });

  const DEFAULT_MATTERS: Matter[] = [
    {
      id: '1',
      matiere: 'Mathématiques',
      chapitre: 'Algèbre',
      objectif: 'Maîtriser les équations du premier degré',
      niveau_difficulte: 'moyen',
      progression: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      matiere: 'Français',
      chapitre: 'Conjugaison',
      objectif: 'Maîtriser les temps de base',
      niveau_difficulte: 'moyen',
      progression: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const loadMatters = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/auth/matters/');
      const list = Array.isArray(response.data) ? response.data : response.data?.results || [];
      const mapped = list.map(mapMatterFromApi);
      setMatters(mapped.length > 0 ? mapped : DEFAULT_MATTERS);
    } catch (error: unknown) {
      Alert.alert('Erreur', getApiErrorMessage(error));
      setMatters(DEFAULT_MATTERS);
    } finally {
      setLoading(false);
    }
  };

  const selectMatter = (matter: Matter) => {
    setSelectedMatter(matter);
    setShowMatterSelector(false);
    setShowDifficultySelector(true);
    setMessages([]);
    setCurrentExercise(null);
    setSelectedAnswers([]);
  };

  const startTutoring = async (difficulty?: string) => {
    if (!selectedMatter) return;
    
    setShowDifficultySelector(false);
    setLoading(true);

    try {
      // Appel initial au tuteur avec l'API Gemini
      const payload = {
        action: 'tutor',
        matiere: selectedMatter.matiere,
        chapitre: selectedMatter.chapitre,
        niveau_difficulte: difficulty || selectedMatter.niveau_difficulte,
        message: `Bonjour, je veux progresser en ${selectedMatter.chapitre}`,
      };

      const response = await apiClient.post('/auth/tutor/chat/', payload);
      
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'ai',
        content: response.data?.content || response.data?.message || 'Bienvenue en séance de tutorat!',
        timestamp: new Date(),
      };

      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Erreur tuteur:', error);
      Alert.alert('Erreur', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedMatter || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Appel API réel au tuteur Gemini
      const response = await apiClient.post('/auth/tutor/chat/', {
        action: 'tutor',
        matiere: selectedMatter.matiere,
        chapitre: selectedMatter.chapitre,
        message: inputMessage,
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.data?.content || response.data?.message || 'Désolé, je n\'ai pas pu générer une réponse.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erreur API:', error);
      Alert.alert('Erreur', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const generateExercise = async () => {
    if (!selectedMatter) return;

    setLoading(true);
    try {
      // Appel API réel pour générer un exercice avec Gemini
      const response = await apiClient.post('/auth/tutor/chat/', {
        action: 'exercise',
        matiere: selectedMatter.matiere,
        chapitre: selectedMatter.chapitre,
        niveau_difficulte: selectedMatter.niveau_difficulte,
      });

      // Parser la réponse - structure: { status, exercise, metadata }
      const exerciseData = response.data?.exercise || response.data?.questions || {};
      
      const exercise: Exercise = {
        question: exerciseData?.question || 'Question générée par Gemini',
        options: Array.isArray(exerciseData?.options) ? exerciseData.options : [
          { id: 'A', text: 'Option 1', is_correct: true, explanation: 'Explication' },
          { id: 'B', text: 'Option 2', is_correct: false, explanation: '' },
        ],
        difficulty: exerciseData?.difficulty || selectedMatter.niveau_difficulte,
        competencies: exerciseData?.competencies || [],
        hint: exerciseData?.hint || exerciseData?.conseil,
      };

      const exerciseMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'system',
        content: 'Voici un exercice généré par Gemini:',
        exercise,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, exerciseMessage]);
      setCurrentExercise(exercise);
      setSelectedAnswers([]);
    } catch (error) {
      console.error('Erreur génération exercice:', error);
      Alert.alert('Erreur', getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const submitExercise = async () => {
    if (selectedAnswers.length === 0) {
      Alert.alert('Erreur', 'Sélectionnez au moins une réponse');
      return;
    }

    if (!currentExercise) return;

    const isCorrect = selectedAnswers.every(answerId =>
      currentExercise.options.find(opt => opt.id === answerId && opt.is_correct)
    );

    const result: ChatMessage = {
      id: Date.now().toString(),
      role: 'system',
      content: isCorrect ? '✅ Bravo! Réponse correcte!' : '❌ Pas tout à fait. Réessayez!',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, result]);
    setCurrentExercise(null);
    setSelectedAnswers([]);
  };

  const toggleAnswer = (answerId: string) => {
    setSelectedAnswers(prev => {
      if (prev.includes(answerId)) {
        return prev.filter(id => id !== answerId);
      } else {
        return [...prev, answerId];
      }
    });
  };

  const handleEndSession = async () => {
    Alert.alert(
      'Fin de session',
      'Voulez-vous sauvegarder un résumé de cette session?',
      [
        { text: 'Non', onPress: exitSession },
        {
          text: 'Oui',
          onPress: async () => {
            // À implémenter: appel API pour sauvegarder le résumé
            exitSession();
          },
        },
      ]
    );
  };

  const exitSession = () => {
    setSelectedMatter(null);
    setMessages([]);
    setShowMatterSelector(true);
    setCurrentExercise(null);
    setSelectedAnswers([]);
  };

  // ========================================================================
  // RENDER SECTIONS
  // ========================================================================

  if (loading && messages.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Chargement...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Sélection de la matière
  if (showMatterSelector && !selectedMatter) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.selectedScreenContainer}>
            <View style={styles.header}>
              <Icon library="Feather" name="book" size={28} color={colors.primary} />
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Mon Tutorat IA
              </Text>
            </View>

            <Text style={[styles.subtitle, { color: colors.gray600 }]}>
              Sélectionnez une matière pour commencer
            </Text>

            <View style={styles.mattersGrid}>
              {matters.map(matter => (
                <TouchableOpacity
                  key={matter.id}
                  style={[styles.matterCard, { backgroundColor: colors.cardBg }]}
                  onPress={() => selectMatter(matter)}
                  activeOpacity={0.7}
                >
                  <View style={styles.matterContent}>
                    <Text style={[styles.matterTitle, { color: colors.text }]}>
                      {matter.matiere}
                    </Text>
                    <Text style={[styles.matterChapter, { color: colors.gray600 }]}>
                      {matter.chapitre}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.progressBar,
                      { backgroundColor: colors.gray300 },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${matter.progression}%`,
                          backgroundColor: colors.success,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressText, { color: colors.gray600 }]}>
                    {Math.round(matter.progression)}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Chat principal
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      {selectedMatter && (
        <View style={[styles.chatHeader, { backgroundColor: colors.cardBg }]}>
          <TouchableOpacity onPress={handleEndSession}>
            <Icon library="Feather" name="arrow-left" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.matterTitle, { color: colors.text }]}>
              {selectedMatter.matiere}
            </Text>
            <Text style={[styles.matterChapter, { color: colors.gray600 }]}>
              {selectedMatter.chapitre}
            </Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        style={styles.messagesContainer}
      >
        {messages.map(message => (
          <View key={message.id}>
            {/* Message texte */}
            <View
              style={[
                styles.messageBubble,
                message.role === 'user' && styles.userMessage,
                message.role === 'system' && styles.systemMessage,
                { backgroundColor: message.role === 'user' ? colors.primary : colors.cardBg },
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  {
                    color:
                      message.role === 'user' ? colors.white : colors.text,
                  },
                ]}
              >
                {message.content}
              </Text>
            </View>

            {/* Exercice QCM */}
            {message.exercise && (
              <View style={[styles.exerciseContainer, { backgroundColor: colors.cardBg }]}>
                <Text style={[styles.exerciseQuestion, { color: colors.text }]}>
                  {message.exercise.question}
                </Text>

                {message.exercise.hint && (
                  <View style={[styles.hintBox, { backgroundColor: colors.bg }]}>
                    <Icon library="Feather" name="lightbulb" size={16} color={colors.warning} />
                    <Text style={[styles.hintText, { color: colors.gray600 }]}>
                      {message.exercise.hint}
                    </Text>
                  </View>
                )}

                <View style={styles.optionsContainer}>
                  {message.exercise.options.map(option => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.optionButton,
                        {
                          borderColor: selectedAnswers.includes(option.id)
                            ? colors.primary
                            : colors.gray300,
                          backgroundColor: selectedAnswers.includes(option.id)
                            ? colors.primaryLight
                            : colors.bg,
                        },
                      ]}
                      onPress={() => toggleAnswer(option.id)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          {
                            borderColor: colors.primary,
                            backgroundColor: selectedAnswers.includes(option.id)
                              ? colors.primary
                              : 'transparent',
                          },
                        ]}
                      >
                        {selectedAnswers.includes(option.id) && (
                          <Icon library="Feather" name="check" size={14} color={colors.white} />
                        )}
                      </View>
                      <Text style={[styles.optionText, { color: colors.text }]}>
                        {option.id}. {option.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.submitButton, { backgroundColor: colors.primary }]}
                  onPress={submitExercise}
                >
                  <Text style={[styles.submitButtonText, { color: colors.white }]}>
                    Valider ma réponse
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {loading && (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator color={colors.primary} />
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={[styles.inputArea, { backgroundColor: colors.cardBg }]}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.success }]}
          onPress={generateExercise}
          disabled={loading}
        >
          <Icon library="Feather" name="target" size={20} color={colors.white} />
        </TouchableOpacity>

        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: colors.gray300,
              backgroundColor: colors.bg,
            },
          ]}
          placeholder="Posez votre question..."
          placeholderTextColor={colors.gray500}
          value={inputMessage}
          onChangeText={setInputMessage}
          multiline
          editable={!loading}
          onSubmitEditing={sendMessage}
          blurOnSubmit={false}
          returnKeyType="send"
          submitBehavior="submit"
        />

        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={sendMessage}
          disabled={loading || !inputMessage.trim()}
        >
          <Icon library="Feather" name="send" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  selectedScreenContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  mattersGrid: {
    gap: 12,
  },
  matterCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  matterContent: {
    marginBottom: 12,
  },
  matterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  matterChapter: {
    fontSize: 13,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  systemMessage: {
    alignSelf: 'center',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  exerciseContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  exerciseQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  hintBox: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  hintText: {
    marginLeft: 8,
    fontSize: 13,
    flex: 1,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 8,
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    fontSize: 14,
    flex: 1,
  },
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingIndicator: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  inputArea: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
