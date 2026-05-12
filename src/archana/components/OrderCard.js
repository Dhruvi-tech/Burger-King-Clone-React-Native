import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../dhruvi/utils/ThemeContext';

export default function OrderCard({ orderId, date, status, total, items, paymentMethod }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const isDelivered = status.toLowerCase() === 'delivered';
  const paymentLabel = paymentMethod === 'cash' ? 'Cash' : paymentMethod === 'upi' ? 'UPI' : null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.orderId}>Order #{orderId}</Text>
          <Text style={styles.date}>{date}</Text>
          {paymentLabel ? (
            <Text style={styles.payment}>Payment: {paymentLabel}</Text>
          ) : null}
        </View>
        <View style={[styles.badge, isDelivered ? styles.badgeSuccess : styles.badgePending]}>
          <Text style={[styles.badgeText, isDelivered ? styles.textSuccess : styles.textPending]}>
            {status}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.body}>
        <Text style={styles.items} numberOfLines={2}>
          {items}
        </Text>
        <Text style={styles.total}>Rs {total}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      marginHorizontal: theme.spacing.md,
      ...theme.shadows.light,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    orderId: {
      ...theme.typography.subtitle,
      fontSize: 16,
    },
    date: {
      ...theme.typography.body,
      fontSize: 12,
      marginTop: theme.spacing.xs,
    },
    payment: {
      ...theme.typography.label,
      marginTop: 2,
    },
    badge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.sm,
    },
    badgeSuccess: {
      backgroundColor: '#e8f5e9',
    },
    badgePending: {
      backgroundColor: '#fff3e0',
    },
    badgeText: {
      fontSize: 12,
      fontWeight: 'bold',
    },
    textSuccess: {
      color: theme.colors.success,
    },
    textPending: {
      color: '#ff9800',
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.background,
      marginVertical: theme.spacing.md,
    },
    body: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    items: {
      ...theme.typography.body,
      flex: 1,
      marginRight: theme.spacing.md,
    },
    total: {
      ...theme.typography.subtitle,
      color: theme.colors.primary,
    },
  });