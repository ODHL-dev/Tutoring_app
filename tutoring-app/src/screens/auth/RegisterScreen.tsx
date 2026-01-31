import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useForm } from '../../hooks/useForm';
import { validateRegisterForm } from '../../utils/validation';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { spacing, typography } from '../../styles/theme';

export default function RegisterScreen({ navigation }: any) {
  const { register, isLoading, error } = useAuth();
  const { colors } = useTheme();
  const [role, setRole] = useState<'student' | 'teacher' | 'parent'>('student');

  const { values, errors, handleChange, handleSubmit, setFieldError } = useForm({
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    onSubmit: async (vals) => {
      const validation = validateRegisterForm(vals.name, vals.email, vals.password, vals.confirmPassword);
      if (!validation.isValid) {
        Object.entries(validation.errors).forEach(([key, value]) => {
          setFieldError(key, value);
        });
        return;
      }
      await register(vals.name, vals.email, vals.password, role);
    },
  });

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.gray50,
    },
    page: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
      paddingBottom: spacing.xl,
    },
    content: {
      width: '100%',
      maxWidth: 560,
      alignSelf: 'center',
    },
    brand: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    brandBadge: {
      backgroundColor: colors.secondaryLight,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: 999,
      marginBottom: spacing.md,
    },
    brandBadgeText: {
      ...typography.label,
      color: colors.secondary,
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
    roleSection: {
      marginBottom: spacing.lg,
    },
    roleLabel: {
      ...typography.label,
      color: colors.gray700,
      marginBottom: spacing.md,
    },
    roleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    roleButton: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: 10,
      borderWidth: 1,
      alignItems: 'center',
    },
    roleButtonActive: {
      borderColor: colors.secondary,
      backgroundColor: colors.secondaryLight,
    },
    roleButtonInactive: {
      borderColor: colors.gray300,
      backgroundColor: colors.white,
    },
    roleButtonText: {
      ...typography.body2,
      fontWeight: '600',
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
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.brand}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>DÉMARRER</Text>
            </View>
            <Text style={styles.brandTitle}>Créer un compte</Text>
            <Text style={styles.brandSubtitle}>Rejoignez la plateforme et suivez votre progression.</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Inscription</Text>
              <Text style={styles.cardSubtitle}>Quelques infos pour personnaliser l'expérience.</Text>
            </View>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.roleSection}>
              <Text style={styles.roleLabel}>Vous êtes :</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === 'student' ? styles.roleButtonActive : styles.roleButtonInactive,
                  ]}
                  onPress={() => setRole('student')}
                >
                  <Text style={[styles.roleButtonText, { color: role === 'student' ? colors.secondary : colors.gray600 }]}
                  >
                    Élève
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === 'teacher' ? styles.roleButtonActive : styles.roleButtonInactive,
                  ]}
                  onPress={() => setRole('teacher')}
                >
                  <Text style={[styles.roleButtonText, { color: role === 'teacher' ? colors.secondary : colors.gray600 }]}
                  >
                    Enseignant
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    role === 'parent' ? styles.roleButtonActive : styles.roleButtonInactive,
                  ]}
                  onPress={() => setRole('parent')}
                >
                  <Text style={[styles.roleButtonText, { color: role === 'parent' ? colors.secondary : colors.gray600 }]}
                  >
                    Parent
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TextField
              label="Nom complet"
              placeholder="Jean Dupont"
              value={values.name}
              onChangeText={(text: string) => handleChange('name', text)}
              error={errors.name}
            />

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

            <TextField
              label="Confirmer le mot de passe"
              placeholder="••••••••"
              value={values.confirmPassword}
              onChangeText={(text: string) => handleChange('confirmPassword', text)}
              error={errors.confirmPassword}
              secureTextEntry
            />

            <Button
              title="S'inscrire"
              onPress={handleSubmit}
              fullWidth
              loading={isLoading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà inscrit ?</Text>
            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate('Login')}
            >
              Se connecter
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
