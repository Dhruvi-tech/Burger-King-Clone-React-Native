import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { CartContext } from '../../dhruvi/utils/CartContext';
import { useAppTheme } from '../../dhruvi/utils/ThemeContext';

const PAYMENT_OPTIONS = [
  {
    key: 'upi',
    title: 'UPI Payment',
    subtitle: 'Pay using any UPI app',
    icon: 'qr-code-outline',
  },
  {
    key: 'cash',
    title: 'Cash on Delivery',
    subtitle: 'Pay when the order arrives',
    icon: 'cash-outline',
  },
];

export default function PaymentMethods({ navigation }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { paymentMethod, updatePaymentMethod } = useContext(CartContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.helperText}>Choose your default payment method</Text>

        {PAYMENT_OPTIONS.map((option) => {
          const selected = paymentMethod === option.key;
          return (
            <TouchableOpacity
              key={option.key}
              activeOpacity={0.8}
              style={[styles.optionCard, selected ? styles.optionCardSelected : null]}
              onPress={() => updatePaymentMethod(option.key)}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.optionIcon, selected ? styles.optionIconSelected : null]}>
                  <Icon
                    name={option.icon}
                    size={22}
                    color={selected ? theme.colors.primary : theme.colors.textSecondary}
                  />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
              </View>

              <Icon
                name={selected ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={selected ? theme.colors.accent : theme.colors.border}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backBtn: {
      padding: theme.spacing.xs,
    },
    headerTitle: {
      ...theme.typography.title,
      fontSize: 20,
      color: theme.colors.primary,
    },
    headerSpacer: {
      width: 24,
    },
    content: {
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    helperText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
    optionCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    optionCardSelected: {
      borderColor: theme.colors.accent,
    },
    optionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      marginRight: theme.spacing.md,
    },
    optionIcon: {
      width: 42,
      height: 42,
      borderRadius: theme.borderRadius.round,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    optionIconSelected: {
      borderColor: theme.colors.accent,
    },
    optionText: {
      flex: 1,
    },
    optionTitle: {
      ...theme.typography.subtitle,
      color: theme.colors.text,
    },
    optionSubtitle: {
      ...theme.typography.label,
      marginTop: 2,
      color: theme.colors.textSecondary,
    },
  });