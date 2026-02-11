import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useForm } from '../hooks/useForm';
import { validatePassword } from '../utils/validation';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { spacing, typography, borderRadius, webMaxWidth } from '../styles/theme';

export default function SecurityScreen() {
  const { colors } = useTheme();

  const { values, errors, handleChange, handleSubmit, setFieldError, resetForm, isSubmitting } = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    onSubmit: async (vals) => {
      const validationErrors: Record<string, string> = {};

      if (!vals.currentPassword) {
        validationErrors.currentPassword = 'Le mot de passe actuel est requis';
      }

      const newPasswordError = validatePassword(vals.newPassword);
      if (newPasswordError) {
        validationErrors.newPassword = newPasswordError;
      }

      if (!vals.confirmPassword || vals.newPassword !== vals.confirmPassword) {
        validationErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      }

      if (vals.currentPassword && vals.newPassword && vals.currentPassword === vals.newPassword) {
        validationErrors.newPassword = 'Le nouveau mot de passe doit etre different';
      }

      if (Object.keys(validationErrors).length > 0) {
        Object.entries(validationErrors).forEach(([field, message]) => {
          setFieldError(field, message);
        });
        return;
      }

      if (Platform.OS === 'web') {
        window.alert('Mot de passe mis a jour.');
      } else {
        Alert.alert('Securite', 'Mot de passe mis a jour.');
      }
      resetForm();
    },
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray50,
    },
    content: {
      padding: spacing.lg,
      gap: spacing.lg,
      ...webMaxWidth(900),
    },
    header: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.gray100,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.sm,
    },
    headerIcon: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.md,
      backgroundColor: colors.secondaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      ...typography.h3,
      color: colors.gray900,
      fontWeight: '700',
    },
    headerSubtitle: {
      ...typography.body2,
      color: colors.gray600,
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.gray100,
    },
    cardTitle: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
      marginBottom: spacing.md,
    },
    actionRow: {
      marginTop: spacing.sm,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.headerIcon}>
              <Icon library="Feather" name="lock" size={20} color={colors.secondary} />
            </View>
            <Text style={styles.headerTitle}>Securite</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Changez votre mot de passe pour proteger votre compte.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mot de passe</Text>
          <TextField
            label="Mot de passe actuel"
            placeholder="Votre mot de passe"
            value={values.currentPassword}
            onChangeText={(text) => handleChange('currentPassword', text)}
            error={errors.currentPassword}
            secureTextEntry
          />
          <TextField
            label="Nouveau mot de passe"
            placeholder="Au moins 6 caracteres"
            value={values.newPassword}
            onChangeText={(text) => handleChange('newPassword', text)}
            error={errors.newPassword}
            secureTextEntry
          />
          <TextField
            label="Confirmer le nouveau mot de passe"
            placeholder="Re-saisir le mot de passe"
            value={values.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            error={errors.confirmPassword}
            secureTextEntry
          />

          <View style={styles.actionRow}>
            <Button
              title="Mettre a jour"
              onPress={handleSubmit}
              loading={isSubmitting}
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
