import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useForm } from '../../hooks/useForm';
import { validateLoginForm } from '../../utils/validation';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { spacing, typography, webMaxWidth } from '../../styles/theme';

export default function LoginScreen({ navigation }: any) {
  const { login, isLoading, error } = useAuth();
  const { colors } = useTheme();
  const { values, errors, handleChange, handleSubmit, setFieldError } = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: async (vals) => {
      const validation = validateLoginForm(vals.email, vals.password);
      if (!validation.isValid) {
        Object.entries(validation.errors).forEach(([key, value]) => {
          setFieldError(key, value);
        });
        return;
      }
      await login(vals.email, vals.password);
    },
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray50,
    },
    page: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xl,
    },
    content: {
      ...webMaxWidth(520),
    },
    brand: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    brandBadge: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: 999,
      marginBottom: spacing.md,
    },
    brandBadgeText: {
      ...typography.label,
      color: colors.primary,
      fontWeight: '700',
      letterSpacing: 0.4,
    },
    brandTitle: {
      ...typography.h2,
      color: colors.gray900,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    brandSubtitle: {
      ...typography.body2,
      color: colors.gray600,
      textAlign: 'center',
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: spacing.xl,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 16,
      elevation: 6,
      borderWidth: 1,
      borderColor: colors.gray100,
    },
    cardHeader: {
      marginBottom: spacing.lg,
    },
    cardTitle: {
      ...typography.h3,
      color: colors.gray900,
      marginBottom: spacing.xs,
    },
    cardSubtitle: {
      ...typography.body2,
      color: colors.gray600,
    },
    errorBox: {
      backgroundColor: colors.errorLight,
      borderColor: colors.error,
      borderWidth: 1,
      borderRadius: 10,
      padding: spacing.md,
      marginBottom: spacing.md,
    },
    errorText: {
      color: colors.error,
      ...typography.body2,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing.lg,
    },
    footerText: {
      ...typography.body2,
      color: colors.gray600,
    },
    linkText: {
      ...typography.body2,
      color: colors.primary,
      marginLeft: spacing.xs,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.page} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.content}>
          <View style={styles.brand}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>TUTORIA</Text>
            </View>
            <Text style={styles.brandTitle}>Bon retour</Text>
            <Text style={styles.brandSubtitle}>Continuez votre parcours d'apprentissage personnalisé.</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Connexion</Text>
              <Text style={styles.cardSubtitle}>Accédez à votre plateforme de tutorat</Text>
            </View>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TextField
              label="Email"
              placeholder="votre@email.com"
              value={values.email}
              onChangeText={(text: string) => handleChange('email', text)}
              error={errors.email}
              keyboardType="email-address"
            />

            <TextField
              label="Mot de passe"
              placeholder="••••••••"
              value={values.password}
              onChangeText={(text: string) => handleChange('password', text)}
              error={errors.password}
              secureTextEntry
            />

            <Button
              title="Se connecter"
              onPress={handleSubmit}
              fullWidth
              loading={isLoading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas de compte ?</Text>
            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate('Register')}
            >
              S'inscrire
            </Text>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
