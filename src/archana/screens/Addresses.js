import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAddresses } from '../utils/AddressContext';
import { useAppTheme } from '../../dhruvi/utils/ThemeContext';

export default function AddressesScreen({ navigation }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { addresses, selectedAddress, selectAddress, addAddress } = useAddresses();
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleAddAddress = () => {
    if (!label.trim() || !address.trim()) return;
    addAddress({
      label: label.trim(),
      address: address.trim(),
      instructions: instructions.trim() || 'No special instructions.',
    });
    setLabel('');
    setAddress('');
    setInstructions('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={(
          <View style={styles.deliveryCard}>
            <Text style={styles.deliveryTitle}>Delivery Preferences</Text>
            <Text style={styles.deliveryText}>
              Delivering to {selectedAddress?.label || 'selected address'}
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          const selected = item.id === selectedAddress?.id;
          return (
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.addressCard, selected && styles.selectedCard]}
              onPress={() => selectAddress(item.id)}
            >
              <View style={styles.addressIcon}>
                <Icon name={selected ? 'radio-button-on' : 'radio-button-off'} size={22} color={theme.colors.accent} />
              </View>
              <View style={styles.addressBody}>
                <Text style={styles.addressLabel}>{item.label}</Text>
                <Text style={styles.addressText}>{item.address}</Text>
                <Text style={styles.instructions}>{item.instructions}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={(
          <View style={styles.addCard}>
            <Text style={styles.addTitle}>Add Quick Address</Text>
            <TextInput style={styles.input} value={label} onChangeText={setLabel} placeholder="Label: Home, Hostel..." placeholderTextColor={theme.colors.textSecondary} />
            <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Complete address" placeholderTextColor={theme.colors.textSecondary} />
            <TextInput style={styles.input} value={instructions} onChangeText={setInstructions} placeholder="Delivery instructions" placeholderTextColor={theme.colors.textSecondary} />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddAddress}>
              <Text style={styles.addBtnText}>Save Address</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
      ...theme.shadows.light,
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
    listContent: {
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    deliveryCard: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    deliveryTitle: {
      color: '#fff',
      fontWeight: '900',
      fontSize: 16,
    },
    deliveryText: {
      color: theme.colors.secondary,
      marginTop: 4,
    },
    addressCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    selectedCard: {
      borderColor: theme.colors.accent,
    },
    addressIcon: {
      marginRight: theme.spacing.sm,
      paddingTop: 2,
    },
    addressBody: {
      flex: 1,
    },
    addressLabel: {
      ...theme.typography.subtitle,
      color: theme.colors.primary,
      fontSize: 16,
    },
    addressText: {
      ...theme.typography.body,
      marginTop: 4,
    },
    instructions: {
      ...theme.typography.label,
      marginTop: 6,
    },
    addCard: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    addTitle: {
      ...theme.typography.subtitle,
      marginBottom: theme.spacing.sm,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
    },
    addBtn: {
      backgroundColor: theme.colors.accent,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
    },
    addBtnText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });