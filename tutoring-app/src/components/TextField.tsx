import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { typography, spacing, borderRadius } from '../styles/theme';
import { Icon } from './Icon';

interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
}

export function TextField({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  editable = true,
}: TextFieldProps) {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    label: {
      ...typography.label,
      color: colors.gray700,
      marginBottom: spacing.xs,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: error ? colors.error : colors.gray300,
      borderRadius: borderRadius.md,
      backgroundColor: colors.white,
      paddingRight: secureTextEntry ? spacing.sm : 0,
    },
    input: {
      flex: 1,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      ...typography.body2,
      color: colors.gray900,
    },
    toggleButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      ...typography.caption,
      color: colors.error,
      marginTop: spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.gray400}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <Icon
              library="Feather"
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color={colors.gray600}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}
