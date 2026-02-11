import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography, borderRadius, webMaxWidth } from '../styles/theme';
import { Icon } from '../components/Icon';

export default function ExercisesScreen() {
  const { colors } = useTheme();

  const categories = [
    { id: 'quick', label: 'Exercices rapides', icon: 'zap', color: colors.primary },
    { id: 'practice', label: 'Pratique guidée', icon: 'edit-3', color: colors.secondary },
    { id: 'challenge', label: 'Defis', icon: 'target', color: colors.accent },
  ];

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
    headerTitle: {
      ...typography.h3,
      color: colors.gray900,
      fontWeight: '700',
      marginBottom: spacing.xs,
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    cardInfo: {
      flex: 1,
    },
    cardTitle: {
      ...typography.h4,
      color: colors.gray900,
      fontWeight: '700',
      marginBottom: spacing.xs,
    },
    cardText: {
      ...typography.body2,
      color: colors.gray600,
    },
    iconWrapper: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Exercices</Text>
          <Text style={styles.headerSubtitle}>Choisissez une categorie pour demarrer.</Text>
        </View>

        {categories.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.8}>
            <View style={styles.iconWrapper}>
              <Icon library="Feather" name={item.icon} size={20} color={item.color} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.label}</Text>
              <Text style={styles.cardText}>Nouveau contenu disponible</Text>
            </View>
            <Icon library="Feather" name="chevron-right" size={20} color={colors.gray400} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
