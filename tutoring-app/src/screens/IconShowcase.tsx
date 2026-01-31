import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { MaterialIcons, Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { colors, spacing, typography } from '../styles/theme';

/**
 * Composant de démonstration des icônes disponibles via @expo/vector-icons
 * 
 * Collections disponibles :
 * - MaterialIcons (Material Design)
 * - Ionicons (Ionic Framework)
 * - Feather (Feather Icons)
 * - FontAwesome5 (Font Awesome)
 * - MaterialCommunityIcons (Material Community)
 * - AntDesign, Entypo, EvilIcons, Foundation, Octicons, SimpleLineIcons, Zocial
 * 
 * Voir toutes les icônes : https://icons.expo.fyi/
 */
export default function IconShowcase() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray50,
    },
    content: {
      padding: spacing.lg,
    },
    header: {
      ...typography.h2,
      color: colors.gray900,
      marginBottom: spacing.xl,
    },
    section: {
      backgroundColor: colors.white,
      borderRadius: 12,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    sectionTitle: {
      ...typography.h4,
      color: colors.gray900,
      marginBottom: spacing.md,
    },
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.lg,
    },
    iconItem: {
      alignItems: 'center',
      width: 80,
    },
    iconLabel: {
      ...typography.caption,
      color: colors.gray600,
      marginTop: spacing.xs,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Icônes disponibles</Text>

        {/* Material Icons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Material Icons</Text>
          <View style={styles.iconGrid}>
            <View style={styles.iconItem}>
              <MaterialIcons name="home" size={32} color={colors.primary} />
              <Text style={styles.iconLabel}>home</Text>
            </View>
            <View style={styles.iconItem}>
              <MaterialIcons name="person" size={32} color={colors.secondary} />
              <Text style={styles.iconLabel}>person</Text>
            </View>
            <View style={styles.iconItem}>
              <MaterialIcons name="settings" size={32} color={colors.accent} />
              <Text style={styles.iconLabel}>settings</Text>
            </View>
            <View style={styles.iconItem}>
              <MaterialIcons name="notifications" size={32} color={colors.info} />
              <Text style={styles.iconLabel}>notifications</Text>
            </View>
            <View style={styles.iconItem}>
              <MaterialIcons name="favorite" size={32} color={colors.error} />
              <Text style={styles.iconLabel}>favorite</Text>
            </View>
            <View style={styles.iconItem}>
              <MaterialIcons name="search" size={32} color={colors.gray700} />
              <Text style={styles.iconLabel}>search</Text>
            </View>
          </View>
        </View>

        {/* Ionicons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ionicons</Text>
          <View style={styles.iconGrid}>
            <View style={styles.iconItem}>
              <Ionicons name="book" size={32} color={colors.primary} />
              <Text style={styles.iconLabel}>book</Text>
            </View>
            <View style={styles.iconItem}>
              <Ionicons name="chatbubble" size={32} color={colors.secondary} />
              <Text style={styles.iconLabel}>chatbubble</Text>
            </View>
            <View style={styles.iconItem}>
              <Ionicons name="trophy" size={32} color={colors.accent} />
              <Text style={styles.iconLabel}>trophy</Text>
            </View>
            <View style={styles.iconItem}>
              <Ionicons name="star" size={32} color={colors.warning} />
              <Text style={styles.iconLabel}>star</Text>
            </View>
            <View style={styles.iconItem}>
              <Ionicons name="rocket" size={32} color={colors.error} />
              <Text style={styles.iconLabel}>rocket</Text>
            </View>
            <View style={styles.iconItem}>
              <Ionicons name="flame" size={32} color={colors.warning} />
              <Text style={styles.iconLabel}>flame</Text>
            </View>
          </View>
        </View>

        {/* Feather Icons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feather Icons</Text>
          <View style={styles.iconGrid}>
            <View style={styles.iconItem}>
              <Feather name="check-circle" size={32} color={colors.success} />
              <Text style={styles.iconLabel}>check-circle</Text>
            </View>
            <View style={styles.iconItem}>
              <Feather name="edit" size={32} color={colors.primary} />
              <Text style={styles.iconLabel}>edit</Text>
            </View>
            <View style={styles.iconItem}>
              <Feather name="bar-chart-2" size={32} color={colors.info} />
              <Text style={styles.iconLabel}>bar-chart-2</Text>
            </View>
            <View style={styles.iconItem}>
              <Feather name="send" size={32} color={colors.secondary} />
              <Text style={styles.iconLabel}>send</Text>
            </View>
            <View style={styles.iconItem}>
              <Feather name="award" size={32} color={colors.accent} />
              <Text style={styles.iconLabel}>award</Text>
            </View>
            <View style={styles.iconItem}>
              <Feather name="clock" size={32} color={colors.gray700} />
              <Text style={styles.iconLabel}>clock</Text>
            </View>
          </View>
        </View>

        {/* FontAwesome5 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FontAwesome 5</Text>
          <View style={styles.iconGrid}>
            <View style={styles.iconItem}>
              <FontAwesome5 name="graduation-cap" size={32} color={colors.primary} />
              <Text style={styles.iconLabel}>graduation-cap</Text>
            </View>
            <View style={styles.iconItem}>
              <FontAwesome5 name="brain" size={32} color={colors.secondary} />
              <Text style={styles.iconLabel}>brain</Text>
            </View>
            <View style={styles.iconItem}>
              <FontAwesome5 name="medal" size={32} color={colors.accent} />
              <Text style={styles.iconLabel}>medal</Text>
            </View>
            <View style={styles.iconItem}>
              <FontAwesome5 name="fire" size={32} color={colors.error} />
              <Text style={styles.iconLabel}>fire</Text>
            </View>
            <View style={styles.iconItem}>
              <FontAwesome5 name="chart-line" size={32} color={colors.success} />
              <Text style={styles.iconLabel}>chart-line</Text>
            </View>
            <View style={styles.iconItem}>
              <FontAwesome5 name="lightbulb" size={32} color={colors.warning} />
              <Text style={styles.iconLabel}>lightbulb</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
