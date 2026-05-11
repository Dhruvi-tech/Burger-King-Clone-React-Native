import React, { useEffect, useMemo } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useAppTheme } from '../../dhruvi/utils/ThemeContext';

export default function Toast({ message, visible, onHide }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    if (visible && onHide) {
      const timer = setTimeout(onHide, 2300);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 40,
      left: theme.spacing.md,
      right: theme.spacing.md,
      backgroundColor: '#333333',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      ...theme.shadows.medium,
    },
    text: {
      color: '#ffffff',
      fontSize: 14,
      fontWeight: '500',
    },
  });