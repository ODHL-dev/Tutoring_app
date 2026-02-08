import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { spacing, typography, borderRadius, webMaxWidth } from '../styles/theme';
import { useTheme } from '../hooks/useTheme';
import { useThemeStore } from '../contexts/themeStore';
import { Icon } from '../components/Icon';

export default function SettingsScreen({ navigation }: any) {
  const { isDarkMode, colors, useSystemTheme } = useTheme();
  const { setDarkMode, setUseSystemTheme } = useThemeStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [systemTheme, setSystemTheme] = useState(useSystemTheme);
  const [manualDarkMode, setManualDarkMode] = useState(!useSystemTheme && isDarkMode);

  const handleSystemThemeToggle = async (value: boolean) => {
    setSystemTheme(value);
    await setUseSystemTheme(value);
  };

  const handleManualDarkModeToggle = async (value: boolean) => {
    setManualDarkMode(value);
    await setDarkMode(value);
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
    sectionTitle: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '600',
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
            
            <TouchableOpacity 
              style={styles.settingRow}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, styles.secondaryIconWrapper]}>
                <Icon library="Feather" name="user" size={20} color={colors.secondary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Profil</Text>
                <Text style={styles.settingDescription}>Modifier vos informations</Text>
              </View>
              <View style={styles.settingAction}>
                <Icon library="Feather" name="chevron-right" size={20} color={colors.gray400} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, styles.secondaryIconWrapper]}>
                <Icon library="Feather" name="lock" size={20} color={colors.secondary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Sécurité</Text>
                <Text style={styles.settingDescription}>Mot de passe et authentification</Text>
              </View>
              <View style={styles.settingAction}>
                <Icon library="Feather" name="chevron-right" size={20} color={colors.gray400} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.settingRow, styles.settingRowLast]}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, styles.secondaryIconWrapper]}>
                <Icon library="Feather" name="shield" size={20} color={colors.secondary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Confidentialité</Text>
                <Text style={styles.settingDescription}>Gérer vos données</Text>
              </View>
              <View style={styles.settingAction}>
                <Icon library="Feather" name="chevron-right" size={20} color={colors.gray400} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Support */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Support</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.settingRow}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, styles.accentIconWrapper]}>
                <Icon library="Feather" name="help-circle" size={20} color={colors.accent} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Centre d'aide</Text>
                <Text style={styles.settingDescription}>FAQ et tutoriels</Text>
              </View>
              <View style={styles.settingAction}>
                <Icon library="Feather" name="chevron-right" size={20} color={colors.gray400} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, styles.accentIconWrapper]}>
                <Icon library="Feather" name="message-square" size={20} color={colors.accent} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Nous contacter</Text>
                <Text style={styles.settingDescription}>Envoyer un message</Text>
              </View>
              <View style={styles.settingAction}>
                <Icon library="Feather" name="chevron-right" size={20} color={colors.gray400} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.settingRow, styles.settingRowLast]}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, styles.accentIconWrapper]}>
                <Icon library="Feather" name="star" size={20} color={colors.accent} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Noter l'application</Text>
                <Text style={styles.settingDescription}>Partagez votre avis</Text>
              </View>
              <View style={styles.settingAction}>
                <Icon library="Feather" name="chevron-right" size={20} color={colors.gray400} />
              </View>
            </TouchableOpacity>
          </View>

          {/* À propos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>À propos</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.settingRow}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, styles.grayIconWrapper]}>
                <Icon library="Feather" name="info" size={20} color={colors.gray700} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Version</Text>
                <Text style={styles.settingDescription}>1.0.0 (Build 1)</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, styles.grayIconWrapper]}>
                <Icon library="Feather" name="file-text" size={20} color={colors.gray700} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Conditions d'utilisation</Text>
              </View>
              <View style={styles.settingAction}>
                <Icon library="Feather" name="chevron-right" size={20} color={colors.gray400} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.settingRow, styles.settingRowLast]}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, styles.grayIconWrapper]}>
                <Icon library="Feather" name="file-text" size={20} color={colors.gray700} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Politique de confidentialité</Text>
              </View>
              <View style={styles.settingAction}>
                <Icon library="Feather" name="chevron-right" size={20} color={colors.gray400} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
