/**
 * PromoCodeInput provides a text field and apply button for promo codes.
 * It validates input locally and shows toast messages when the code is invalid.
 */
import React, { useMemo, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppTheme } from '../../dhruvi/utils/ThemeContext';
import Toast from './Toast';

export default function PromoCodeInput({ onApply }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [code, setCode] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Validate promo code input and notify the parent screen through onApply.
  const handleApply = () => {
    const normalized = code.trim().toUpperCase();

    if (!normalized) {
      setToastMsg('Please enter a promo code');
      setToastVisible(true);
      return;
    }

    const applied = onApply({ code: normalized });

    if (!applied) {
      setToastMsg('Invalid promo code');
      setToastVisible(true);
      return;
    }

    if (normalized === 'B1G1' || normalized === 'BUY1GET1' || normalized === 'BOGO') {
      setToastMsg('Offer applied! Buy 1 Get 1');
    } else if (normalized === 'FREESHIP' || normalized === 'FREEDEL' || normalized === 'FREEDELIVERY') {
      setToastMsg('Promo applied! Free delivery');
    } else if (/^BK\d{1,4}$/.test(normalized)) {
      const amount = normalized.replace('BK', '');
      setToastMsg(`Promo code applied! Rs ${amount} off`);
    } else if (/^OFF\d{1,2}$/.test(normalized)) {
      const percent = normalized.replace('OFF', '');
      setToastMsg(`Promo code applied! ${percent}% off`);
    } else {
      setToastMsg('Promo code applied!');
    }

    setToastVisible(true);
    setCode('');
  };

  return (
    <View style={styles.container}>
      {/* Promo code input row with icon and apply button */}
      <View style={styles.inputWrap}>
        <Icon name="pricetag-outline" size={20} color={theme.colors.primary} style={styles.icon} />
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={setCode}
          placeholder="Enter Promo Code (e.g. BK50, B1G1, BOGO)"
          placeholderTextColor={theme.colors.textSecondary}
          autoCapitalize="characters"
        />
        <TouchableOpacity activeOpacity={0.7} style={styles.applyBtn} onPress={handleApply}>
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>
      <Toast visible={toastVisible} message={toastMsg} onHide={() => setToastVisible(false)} />
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      marginVertical: theme.spacing.sm,
    },
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.sm,
      height: 50,
    },
    icon: {
      marginRight: theme.spacing.sm,
    },
    input: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
    },
    applyBtn: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 8,
      borderRadius: theme.borderRadius.sm,
    },
    applyText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });