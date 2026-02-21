import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import apiClient from '../api/client';
import { spacing, typography } from '../styles/theme';

const CLASS_OPTIONS: Array<'3ème' | 'Terminale D'> = ['3ème', 'Terminale D'];
const MATIERE_EVALUATION = 'Évaluation initiale';

interface DiagnosticQuestion {
  id?: number;
  text?: string;
  type?: string;
}

export default function EvaluationScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { refreshProfile } = useAuth();
  const [step, setStep] = useState<'class' | 'questions' | 'submitting'>('class');
  const [selectedClass, setSelectedClass] = useState<'3ème' | 'Terminale D' | null>(null);
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    if (!selectedClass) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post('/auth/tutor/chat/', {
        action: 'diagnostic',
        matiere: MATIERE_EVALUATION,
        class_level: selectedClass,
      });
      const list = res.data?.questions ?? [];
      setQuestions(Array.isArray(list) ? list : []);
      setStep('questions');
      setAnswers({});
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string }; status?: number } };
      setError(e.response?.data?.error || 'Impossible de charger l\'évaluation.');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswers = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post('/auth/tutor/chat/', {
        action: 'diagnostic',
        matiere: MATIERE_EVALUATION,
        class_level: selectedClass,
        student_answers: answers,
      });
      await refreshProfile();
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || 'Erreur lors de l\'envoi des réponses.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    inner: {
      padding: spacing.xl,
      paddingBottom: spacing.xxl,
    },
    title: {
      ...typography.h3,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    subtitle: {
      ...typography.body2,
      color: colors.gray600,
      marginBottom: spacing.xl,
    },
    classRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    classButton: {
      flex: 1,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.md,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: 'center',
    },
    classButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },
    classButtonUnselected: {
      borderColor: colors.gray300,
      backgroundColor: colors.cardBg,
    },
    classButtonText: {
      ...typography.body1,
      fontWeight: '600',
    },
    questionBlock: {
      marginBottom: spacing.xl,
      padding: spacing.lg,
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.gray200,
    },
    questionLabel: {
      ...typography.body2,
      color: colors.gray600,
      marginBottom: spacing.sm,
    },
    questionText: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '600',
      marginBottom: spacing.md,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.gray300,
      borderRadius: 10,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      ...typography.body1,
      color: colors.text,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    errorBox: {
      backgroundColor: colors.errorLight,
      padding: spacing.md,
      borderRadius: 10,
      marginBottom: spacing.lg,
    },
    errorText: {
      color: colors.error,
      ...typography.body2,
    },
    actions: {
      marginTop: spacing.lg,
      gap: spacing.md,
    },
  });

  if (step === 'class') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
            <Icon library="Feather" name="clipboard" size={28} color={colors.primary} />
            <Text style={[styles.title, { marginLeft: spacing.sm, marginBottom: 0 }]}>
              Évaluation initiale
            </Text>
          </View>
          <Text style={styles.subtitle}>
            Choisissez votre classe. Cette évaluation permet d'adapter le contenu à votre niveau.
          </Text>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          <View style={styles.classRow}>
            {CLASS_OPTIONS.map((cls) => (
              <TouchableOpacity
                key={cls}
                style={[
                  styles.classButton,
                  selectedClass === cls ? styles.classButtonSelected : styles.classButtonUnselected,
                ]}
                onPress={() => setSelectedClass(cls)}
              >
                <Text
                  style={[
                    styles.classButtonText,
                    { color: selectedClass === cls ? colors.primary : colors.text },
                  ]}
                >
                  {cls}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.actions}>
            <Button
              title={loading ? 'Chargement...' : 'Lancer l\'évaluation'}
              onPress={fetchQuestions}
              disabled={!selectedClass || loading}
              fullWidth
              loading={loading}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (step === 'questions') {
    const canSubmit = questions.length > 0 && Object.keys(answers).length > 0;
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Répondez aux questions</Text>
            <Text style={styles.subtitle}>
              Vos réponses permettent de personnaliser votre parcours.
            </Text>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            {questions.map((q, index) => {
              const id = String(q.id ?? index + 1);
              const label = q.text || `Question ${index + 1}`;
              return (
                <View key={id} style={styles.questionBlock}>
                  <Text style={styles.questionLabel}>Question {index + 1}</Text>
                  <Text style={styles.questionText}>{label}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Votre réponse..."
                    placeholderTextColor={colors.gray500}
                    value={answers[id] ?? ''}
                    onChangeText={(text) => handleAnswerChange(id, text)}
                    multiline
                    editable={!loading}
                  />
                </View>
              );
            })}
            {questions.length === 0 && !loading && (
              <Text style={[styles.subtitle, { marginTop: spacing.lg }]}>
                Aucune question reçue. Vous pouvez réessayer.
              </Text>
            )}
            <View style={styles.actions}>
              <Button
                title="Retour"
                variant="secondary"
                onPress={() => setStep('class')}
                fullWidth
                disabled={loading}
              />
              <Button
                title={loading ? 'Envoi...' : 'Valider et terminer'}
                onPress={submitAnswers}
                disabled={!canSubmit || loading}
                fullWidth
                loading={loading}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.subtitle, { marginTop: spacing.lg }]}>Traitement en cours...</Text>
      </View>
    </SafeAreaView>
  );
}
