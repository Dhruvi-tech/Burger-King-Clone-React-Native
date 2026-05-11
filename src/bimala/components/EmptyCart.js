/**
 * EmptyCart renders a friendly empty-cart screen with a CTA button.
 * It uses theme values for consistent spacing, typography, and colors..
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppTheme } from '../../dhruvi/utils/ThemeContext';
import PrimaryButton from './PrimaryButton';

export default function EmptyCart({ onBrowseMenu }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Render a friendly empty cart view with a CTA button to browse menu items.
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon name="cart-outline" size={60} color={theme.colors.textSecondary} />
      </View>
      <Text style={styles.title}>Your cart is empty</Text>
      <Text style={styles.subtitle}>Looks like you haven't added anything to your cart yet.</Text>
      
      <PrimaryButton
        title="Browse Menu"
        onPress={onBrowseMenu}
        style={styles.btn}
      />
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
      backgroundColor: theme.colors.background,
    },
    iconCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
      ...theme.shadows.light,
    },
    title: {
      ...theme.typography.title,
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      ...theme.typography.body,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
    },
    btn: {
      minWidth: 200,
    },
  });