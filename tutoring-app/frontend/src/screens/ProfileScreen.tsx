import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, borderRadius, webMaxWidth } from '../styles/theme';
import { Icon } from '../components/Icon';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const shouldLogout = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
      if (shouldLogout) {
        logout();
      }
      return;
    }

    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: logout,
        },
      ],
      { cancelable: true }
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray50,
    },
    scrollContent: {
      flexGrow: 1,
    },
    header: {
      backgroundColor: colors.white,
      paddingVertical: spacing.xxl,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.gray200,
      ...webMaxWidth(900),
    },
    settingsButton: {
      position: 'absolute',
      top: spacing.lg,
      right: spacing.lg,
      width: 44,
      height: 44,
      borderRadius: borderRadius.full,
      backgroundColor: colors.gray100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarContainer: {
      width: 96,
      height: 96,
      borderRadius: borderRadius.full,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.md,
      borderWidth: 3,
      borderColor: colors.primaryLight,
    },
    avatarInitials: {
      ...typography.h2,
      color: colors.white,
      fontWeight: '700',
    },
    userName: {
      ...typography.h3,
      color: colors.gray900,
      fontWeight: '700',
      marginBottom: spacing.xs,
    },
    userRole: {
      ...typography.body2,
      color: colors.gray600,
    },
    content: {
      padding: spacing.lg,
      gap: spacing.lg,
      ...webMaxWidth(900),
    },
    section: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
    },
    sectionTitle: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '600',
      marginBottom: spacing.md,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray100,
      gap: spacing.md,
    },
    infoRowLast: {
      borderBottomWidth: 0,
    },
    iconWrapper: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      backgroundColor: colors.gray100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    infoLabel: {
      ...typography.body2,
      color: colors.gray600,
      flex: 1,
    },
    infoValue: {
      ...typography.body1,
      color: colors.gray900,
      fontWeight: '500',
    },
    dangerZone: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.error,
    },
    dangerTitle: {
      ...typography.h4,
      color: colors.error,
      fontWeight: '600',
      marginBottom: spacing.sm,
    },
    dangerDescription: {
      ...typography.body2,
      color: colors.gray600,
      marginBottom: spacing.lg,
    },
    logoutButton: {
      backgroundColor: colors.error,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
    },
    logoutButtonText: {
      ...typography.label,
      color: colors.white,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <Icon library="Feather" name="settings" size={18} color={colors.gray700} />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarInitials}>{getInitials(user?.name || 'User')}</Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userRole}>{user?.role === 'student' ? 'Élève' : 'Tuteur'}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.iconWrapper}>
                <Icon library="Feather" name="mail" size={20} color={colors.gray700} />
              </View>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>

            <View style={[styles.infoRow, styles.infoRowLast]}>
              <View style={styles.iconWrapper}>
                <Icon library="Feather" name="user" size={20} color={colors.gray700} />
              </View>
              <Text style={styles.infoLabel}>Rôle</Text>
              <Text style={styles.infoValue}>{user?.role === 'student' ? 'Élève' : 'Tuteur'}</Text>
            </View>
          </View>

          <View style={styles.dangerZone}>
            <Text style={styles.dangerTitle}>DÉCONNEXION</Text>
            <Text style={styles.dangerDescription}>
              La déconnexion vous redirigera vers l'écran de connexion.
            </Text>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Icon library="Feather" name="log-out" size={20} color={colors.white} />
              <Text style={styles.logoutButtonText}>Se déconnecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
