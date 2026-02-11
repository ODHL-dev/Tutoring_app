import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import { spacing, typography, borderRadius, webMaxWidth } from '../styles/theme';
import { useTheme } from '../hooks/useTheme';
import { useThemeStore } from '../contexts/themeStore';
import { useAuth } from '../hooks/useAuth';
import { validatePassword } from '../utils/validation';
import { Icon } from '../components/Icon';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';

export default function SettingsScreen({ navigation }: any) {
  const { isDarkMode, colors, useSystemTheme } = useTheme();
  const { setDarkMode, setUseSystemTheme } = useThemeStore();
  const { user, updateUserName } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [systemTheme, setSystemTheme] = useState(useSystemTheme);
  const [manualDarkMode, setManualDarkMode] = useState(!useSystemTheme && isDarkMode);
  const [userNameDraft, setUserNameDraft] = useState(user?.name ?? '');
  const [nameError, setNameError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setUserNameDraft(user?.name ?? '');
  }, [user?.name]);

  const handleSystemThemeToggle = async (value: boolean) => {
    setSystemTheme(value);
    await setUseSystemTheme(value);
  };

  const handleManualDarkModeToggle = async (value: boolean) => {
    setManualDarkMode(value);
    await setDarkMode(value);
  };

  const showMessage = (message: string) => {
    if (Platform.OS === 'web') {
      window.alert(message);
      return;
    }
    Alert.alert('Compte', message);
  };

  const handleSaveName = () => {
    const trimmed = userNameDraft.trim();
    if (!trimmed) {
      setNameError('Le nom d\'utilisateur est requis');
      return;
    }
    setNameError('');
    updateUserName(trimmed);
    showMessage('Nom d\'utilisateur mis a jour.');
  };

  const handleSavePassword = () => {
    const nextErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

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
    if (hasErrors) {
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showMessage('Mot de passe mis a jour.');
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
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray200,
      gap: spacing.md,
    },
    settingRowLast: {
      borderBottomWidth: 0,
    },
    iconWrapper: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    primaryIconWrapper: {
      backgroundColor: colors.primaryLight,
    },
    secondaryIconWrapper: {
      backgroundColor: colors.secondaryLight,
    },
    accentIconWrapper: {
      backgroundColor: colors.accentLight,
    },
    grayIconWrapper: {
      backgroundColor: colors.gray100,
    },
    settingContent: {
      flex: 1,
      gap: spacing.xs,
    },
    settingLabel: {
      ...typography.body1,
      color: colors.gray900,
      fontWeight: '500',
    },
    settingDescription: {
      ...typography.body2,
      color: colors.gray600,
    },
    settingAction: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    settingValue: {
      ...typography.body2,
      color: colors.gray500,
    },
    versionText: {
      ...typography.body2,
      color: colors.gray600,
      textAlign: 'center',
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },
    formActions: {
      marginTop: spacing.sm,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Préférences */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Préférences</Text>
            </View>
            
            <View style={styles.settingRow}>
              <View style={[styles.iconWrapper, styles.primaryIconWrapper]}>
                <Icon library="Feather" name="bell" size={20} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingDescription}>Recevoir des alertes</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.gray300, true: colors.primaryLight }}
                thumbColor={notificationsEnabled ? colors.primary : colors.gray50}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={[styles.iconWrapper, styles.primaryIconWrapper]}>
                <Icon library="Feather" name="volume-2" size={20} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Sons</Text>
                <Text style={styles.settingDescription}>Activer les effets sonores</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: colors.gray300, true: colors.primaryLight }}
                thumbColor={soundEnabled ? colors.primary : colors.gray50}
              />
            </View>

            <TouchableOpacity 
              style={styles.settingRow}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Profile')}
            >
              <View style={[styles.iconWrapper, styles.primaryIconWrapper]}>
                <Icon library="Feather" name="globe" size={20} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Langue</Text>
                <Text style={styles.settingDescription}>Français</Text>
              </View>
              <View style={styles.settingAction}>
                <Icon library="Feather" name="chevron-right" size={20} color={colors.gray400} />
              </View>
            </TouchableOpacity>

            <View style={styles.settingRow}>
              <View style={[styles.iconWrapper, styles.primaryIconWrapper]}>
                <Icon library="Feather" name="server" size={20} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Utiliser le thème système</Text>
                <Text style={styles.settingDescription}>Adapter au réglage du système</Text>
              </View>
              <Switch
                value={systemTheme}
                onValueChange={handleSystemThemeToggle}
                trackColor={{ false: colors.gray300, true: colors.primaryLight }}
                thumbColor={systemTheme ? colors.primary : colors.gray50}
              />
            </View>

            <View style={[styles.settingRow, styles.settingRowLast, { opacity: systemTheme ? 0.5 : 1 }]}>
              <View style={[styles.iconWrapper, styles.primaryIconWrapper]}>
                <Icon library="Feather" name="moon" size={20} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Mode sombre</Text>
                <Text style={styles.settingDescription}>{systemTheme ? 'Voir paramètres système' : 'Activer le mode sombre'}</Text>
              </View>
              <Switch
                value={manualDarkMode}
                onValueChange={handleManualDarkModeToggle}
                disabled={systemTheme}
                trackColor={{ false: colors.gray300, true: colors.primaryLight }}
                thumbColor={manualDarkMode ? colors.primary : colors.gray50}
              />
            </View>
          </View>

          {/* Compte */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Compte</Text>
            </View>
            <View style={styles.sectionBody}>
              <Text style={styles.sectionSubtitle}>Nom d'utilisateur</Text>
              <TextField
                label="Nom d'utilisateur"
                placeholder="Votre nom affiche"
                value={userNameDraft}
                onChangeText={(value) => {
                  setUserNameDraft(value);
                  if (nameError) {
                    setNameError('');
                  }
                }}
                error={nameError}
              />
              <View style={styles.formActions}>
                <Button title="Enregistrer" onPress={handleSaveName} fullWidth />
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionSubtitle}>Mot de passe</Text>
              <TextField
                label="Mot de passe actuel"
                placeholder="Votre mot de passe"
                value={currentPassword}
                onChangeText={(value) => {
                  setCurrentPassword(value);
                  if (passwordErrors.currentPassword) {
                    setPasswordErrors((prev) => ({ ...prev, currentPassword: '' }));
                  }
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
                  if (passwordErrors.newPassword) {
                    setPasswordErrors((prev) => ({ ...prev, newPassword: '' }));
                  }
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
                  if (passwordErrors.confirmPassword) {
                    setPasswordErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }
                }}
                error={passwordErrors.confirmPassword}
                secureTextEntry
              />
              <View style={styles.formActions}>
                <Button title="Mettre a jour" onPress={handleSavePassword} fullWidth />
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
