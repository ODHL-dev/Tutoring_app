import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import { spacing, typography, borderRadius, webMaxWidth } from '../styles/theme';
import { useTheme } from '../hooks/useTheme';
import { validatePassword } from '../utils/validation';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import apiClient from '../api/client';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const showMessage = (message: string) => {
    if (Platform.OS === 'web') {
      window.alert(message);
      return;
    }
    Alert.alert('Compte', message);
  };

  const handleSavePassword = async () => {
    const nextErrors = { currentPassword: '', newPassword: '', confirmPassword: '' };

    if (!currentPassword) {
      nextErrors.currentPassword = 'Le mot de passe actuel est requis';
    }

    const newPasswordError = validatePassword(newPassword);
    if (newPasswordError) {
      nextErrors.newPassword = newPasswordError;
    }

    if (!confirmPassword || newPassword !== confirmPassword) {
      nextErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      nextErrors.newPassword = 'Le nouveau mot de passe doit etre different';
    }

    const hasErrors = Object.values(nextErrors).some((value) => value.length > 0);
    setPasswordErrors(nextErrors);
    if (hasErrors) return;

    setIsChangingPassword(true);
    try {
      const resp = await apiClient.post('auth/change-password/', {
        current_password: currentPassword,
        new_password: newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showMessage(resp.data?.detail || 'Mot de passe mis à jour.');
      setPasswordErrors({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      const data = err.response?.data;
      const next = { currentPassword: '', newPassword: '', confirmPassword: '' };
      if (data) {
        if (data.current_password) next.currentPassword = Array.isArray(data.current_password) ? data.current_password.join(' ') : String(data.current_password);
        if (data.new_password) next.newPassword = Array.isArray(data.new_password) ? data.new_password.join(' ') : String(data.new_password);
        if (data.detail) showMessage(String(data.detail));
      } else {
        showMessage('Erreur lors de la modification du mot de passe');
      }
      setPasswordErrors(next);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray50,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: spacing.xxl,
    },
    content: {
      padding: spacing.lg,
      gap: spacing.lg,
      ...webMaxWidth(900),
    },
    section: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
    },
    sectionHeader: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.sm,
    },
    sectionBody: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    sectionTitle: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '600',
    },
    sectionSubtitle: {
      ...typography.body1,
      color: colors.gray900,
      fontWeight: '600',
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    divider: {
      height: 1,
      backgroundColor: colors.gray200,
      marginVertical: spacing.md,
    },
    formActions: {
      marginTop: spacing.sm,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Compte</Text>
            </View>
            <View style={styles.sectionBody}>
              <Text style={styles.sectionSubtitle}>Mot de passe</Text>
              <TextField
                label="Mot de passe actuel"
                placeholder="Votre mot de passe"
                value={currentPassword}
                onChangeText={(value) => {
                  setCurrentPassword(value);
                  if (passwordErrors.currentPassword) setPasswordErrors((prev) => ({ ...prev, currentPassword: '' }));
                }}
                error={passwordErrors.currentPassword}
                secureTextEntry
              />
              <TextField
                label="Nouveau mot de passe"
                placeholder="Au moins 6 caracteres"
                value={newPassword}
                onChangeText={(value) => {
                  setNewPassword(value);
                  if (passwordErrors.newPassword) setPasswordErrors((prev) => ({ ...prev, newPassword: '' }));
                }}
                error={passwordErrors.newPassword}
                secureTextEntry
              />
              <TextField
                label="Confirmer le mot de passe"
                placeholder="Re-saisir le mot de passe"
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  if (passwordErrors.confirmPassword) setPasswordErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                error={passwordErrors.confirmPassword}
                secureTextEntry
              />
              <View style={styles.formActions}>
                <Button title="Mettre a jour" onPress={handleSavePassword} fullWidth loading={isChangingPassword} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
