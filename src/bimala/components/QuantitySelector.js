import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { moderateScale } from '../utils/responsive';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppTheme } from '../../dhruvi/utils/ThemeContext';

export default function QuantitySelector({ quantity, onIncrease, onDecrease }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.7} style={styles.btn} onPress={onDecrease}>
        <Icon name="remove" size={18} color={theme.colors.primary} />
      </TouchableOpacity>
      
      <Text style={styles.quantity}>{quantity}</Text>
      
      <TouchableOpacity activeOpacity={0.7} style={styles.btn} onPress={onIncrease}>
        <Icon name="add" size={18} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 4,
      paddingVertical: 2,
    },
    btn: {
      width: moderateScale(28),
      height: moderateScale(28),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.sm,
      ...theme.shadows.light,
    },
    quantity: {
      ...theme.typography.subtitle,
      color: theme.colors.primary,
      marginHorizontal: theme.spacing.sm,
      minWidth: 20,
      textAlign: 'center',
    },
  });