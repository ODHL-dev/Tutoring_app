import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { spacing, typography } from '../styles/theme';

export default function ChatScreen() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.gray50,
    },
    placeholder: {
      ...typography.body1,
      color: colors.gray600,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.lg }}>
        <Text style={styles.placeholder}>💬 Interface Chat (En construction)</Text>
      </View>
    </SafeAreaView>
  );
}
