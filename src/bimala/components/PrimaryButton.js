/**
 * PrimaryButton is a reusable button component for the app.
 * Supports solid, outline, and disabled states with theme-aware styles.
 */
import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../dhruvi/utils/ThemeContext';
import { moderateScale } from '../utils/responsive';

export default function PrimaryButton({ title, onPress, style, disabled, outline }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Choose the correct button appearance depending on outline and disabled props.
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        outline ? styles.outlineBtn : styles.solidBtn,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, outline ? styles.outlineText : styles.solidText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    button: {
      paddingVertical: moderateScale(14),
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.round,
      alignItems: 'center',
      justifyContent: 'center',
    },
    solidBtn: {
      backgroundColor: theme.colors.accent,
    },
    outlineBtn: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: theme.colors.accent,
    },
    disabled: {
      opacity: 0.6,
    },
    text: {
      fontSize: moderateScale(16),
      fontWeight: 'bold',
    },
    solidText: {
      color: '#fff',
    },
    outlineText: {
      color: theme.colors.accent,
    },
  });