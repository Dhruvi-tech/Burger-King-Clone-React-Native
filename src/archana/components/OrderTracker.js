import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppTheme } from '../../dhruvi/utils/ThemeContext';

export default function OrderTracker({ status }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const steps = [
    { label: 'Confirmed', icon: 'receipt-outline' },
    { label: 'Preparing', icon: 'restaurant-outline' },
    { label: 'On the way', icon: 'bicycle-outline' },
    { label: 'Delivered', icon: 'home-outline' },
  ];

  const getStatusIndex = () => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 0;
      case 'preparing': return 1;
      case 'on the way': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStatusIndex();

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      {steps.map((step, index) => {
        const isActive = index <= currentIndex;
        return (
          <View key={index} style={styles.stepContainer}>
            <View style={[styles.iconWrap, isActive ? styles.activeIcon : styles.inactiveIcon]}>
              <Icon name={step.icon} size={16} color={isActive ? '#fff' : theme.colors.textSecondary} />
            </View>
            <Text style={[styles.label, isActive && styles.activeLabel]}>{step.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.md,
      marginTop: theme.spacing.sm,
      position: 'relative',
    },
    line: {
      position: 'absolute',
      top: 36, // center of icons
      left: 20,
      right: 20,
      height: 2,
      backgroundColor: theme.colors.border,
      zIndex: 0,
    },
    stepContainer: {
      alignItems: 'center',
      width: 60,
      zIndex: 1,
    },
    iconWrap: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 6,
    },
    activeIcon: {
      backgroundColor: theme.colors.success,
    },
    inactiveIcon: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    label: {
      ...theme.typography.label,
      fontSize: 10,
      textAlign: 'center',
    },
    activeLabel: {
      color: theme.colors.text,
      fontWeight: 'bold',
    },
  });