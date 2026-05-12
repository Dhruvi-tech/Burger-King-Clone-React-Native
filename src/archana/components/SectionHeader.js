import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../dhruvi/utils/ThemeContext';

export default function SectionHeader({ title, subtitle }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
    },
    title: {
      ...theme.typography.title,
      color: theme.colors.primary,
    },
    subtitle: {
      ...theme.typography.body,
      marginTop: theme.spacing.xs,
    },
  });