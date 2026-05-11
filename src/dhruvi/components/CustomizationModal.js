import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppTheme } from '../utils/ThemeContext';
import PrimaryButton from '../../bimala/components/PrimaryButton';

export default function CustomizationModal({ visible, item, onClose, onConfirm }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [extraCheese, setExtraCheese] = useState(false);
  const [extraPatty, setExtraPatty] = useState(false);
  const [noOnion, setNoOnion] = useState(false);

  if (!item) return null;

  const cheesePrice = 30;
  const pattyPrice = 60;
  
  let finalPrice = item.price;
  if (extraCheese) finalPrice += cheesePrice;
  if (extraPatty) finalPrice += pattyPrice;

  const handleConfirm = () => {
    const customizedItem = {
      ...item,
      id: `${item.id}-${extraCheese ? 'C' : ''}${extraPatty ? 'P' : ''}${noOnion ? 'NO' : ''}`,
      name: `${item.name} ${extraCheese ? '+ Cheese ' : ''}${extraPatty ? '+ Patty ' : ''}${noOnion ? '(No Onion)' : ''}`,
      price: finalPrice,
    };
    onConfirm(customizedItem);
    // Reset state for next time
    setExtraCheese(false);
    setExtraPatty(false);
    setNoOnion(false);
  };

  const Checkbox = ({ label, price, checked, onChange }) => (
    <TouchableOpacity activeOpacity={0.7} style={styles.optionRow} onPress={() => onChange(!checked)}>
      <View style={styles.optionLeft}>
        <Icon name={checked ? 'checkbox' : 'square-outline'} size={24} color={theme.colors.primary} />
        <Text style={styles.optionLabel}>{label}</Text>
      </View>
      {price > 0 ? <Text style={styles.optionPrice}>+Rs {price}</Text> : null}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Customize</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.divider} />

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Add-ons</Text>
            <Checkbox label="Extra Cheese" price={cheesePrice} checked={extraCheese} onChange={setExtraCheese} />
            <Checkbox label="Extra Patty" price={pattyPrice} checked={extraPatty} onChange={setExtraPatty} />
            
            <Text style={[styles.sectionTitle, { marginTop: theme.spacing.md }]}>Preferences</Text>
            <Checkbox label="No Onion" price={0} checked={noOnion} onChange={setNoOnion} />
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.priceWrap}>
              <Text style={styles.totalLabel}>Item Total</Text>
              <Text style={styles.totalPrice}>Rs {finalPrice}</Text>
            </View>
            <PrimaryButton title="Add to Cart" onPress={handleConfirm} style={styles.btn} />
          </View>

        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      backgroundColor: theme.colors.background,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.typography.title,
    },
    itemName: {
      ...theme.typography.subtitle,
      color: theme.colors.primary,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.label,
      fontSize: 14,
      marginBottom: theme.spacing.sm,
    },
    optionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    optionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    optionLabel: {
      ...theme.typography.body,
      marginLeft: theme.spacing.sm,
      fontSize: 16,
    },
    optionPrice: {
      ...theme.typography.body,
      fontWeight: 'bold',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    priceWrap: {
      flex: 1,
    },
    totalLabel: {
      ...theme.typography.label,
    },
    totalPrice: {
      ...theme.typography.title,
      color: theme.colors.primary,
    },
    btn: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },
  });
