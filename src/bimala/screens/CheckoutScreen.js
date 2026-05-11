/**
 * CheckoutScreen collects delivery and payment details and places an order.
 * It validates user inputs and displays toast feedback before navigation.
 */
import React, { useContext, useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { CartContext } from '../../dhruvi/utils/CartContext';
import { validateRequired, validatePhone } from '../../archana/utils/validation';
import { useAddresses } from '../../archana/utils/AddressContext';
import PrimaryButton from '../components/PrimaryButton';
import Toast from '../components/Toast';
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

export default function CheckoutScreen({ navigation }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    cart,
    cartPayableSubTotal,
    placeOrder,
    paymentMethod,
    updatePaymentMethod,
    offerCode,
    offerDiscount,
    offerFreeDelivery,
  } = useContext(CartContext);

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const total = useMemo(() => {
    if (typeof cartPayableSubTotal === 'number') return cartPayableSubTotal;
    return cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
  }, [cartItems, cartPayableSubTotal]);
  const deliveryFee = useMemo(() => {
    if (offerFreeDelivery) return 0;
    return total >= 399 ? 0 : 39;
  }, [offerFreeDelivery, total]);
  const platformFee = useMemo(() => (cartItems.length > 0 ? 7 : 0), [cartItems.length]);
  const taxes = useMemo(() => Math.round(total * 0.05), [total]);
  const grandTotal = useMemo(
    () => Math.max(0, total + deliveryFee + platformFee + taxes - (offerDiscount || 0)),
    [deliveryFee, offerDiscount, platformFee, taxes, total]
  );
  const { selectedAddress } = useAddresses();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState(selectedAddress?.address || '');
  
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Display a toast message for form validation and order feedback.
  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  // Validate user input and submit the order payload to the cart context.
  const submitOrder = () => {
    if (!validateRequired(name)) {
      showToast('Please enter your full name.');
      return;
    }
    if (!validatePhone(phone)) {
      showToast('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!validateRequired(address)) {
      showToast('Please enter your delivery address.');
      return;
    }

    if (Object.keys(cart).length === 0) {
      showToast('Your cart is empty.');
      setTimeout(() => navigation.navigate('Menu'), 200);
      return;
    }

    placeOrder({
      name,
      phone,
      address,
      paymentMethod,
      offerCode,
      offerDiscount,
      offerFreeDelivery,
      subTotal: total,
      deliveryFee,
      platformFee,
      taxes,
      grandTotal,
    });
    showToast('Order placed successfully! Redirecting...');
    setTimeout(() => {
      navigation.navigate('Orders');
    }, 200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Icon name="arrow-back" size={24} color={theme.colors.primary} onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Checkout</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {selectedAddress ? (
          <View style={styles.addressHint}>
            <Icon name="location" size={18} color={theme.colors.accent} />
            <View style={styles.addressHintBody}>
              <Text style={styles.addressHintTitle}>Delivering to {selectedAddress.label}</Text>
              <Text style={styles.addressHintText}>{selectedAddress.address}</Text>
              <Text style={styles.addressHintText}>{selectedAddress.instructions}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <Icon name="person-outline" size={20} color={theme.colors.textSecondary} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Icon name="call-outline" size={20} color={theme.colors.textSecondary} style={styles.icon} />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="9876543210"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Delivery Address</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <Icon name="location-outline" size={20} color={theme.colors.textSecondary} style={styles.textAreaIcon} />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter complete delivery address..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Payment Method</Text>
          <View style={styles.paymentGroup}>
            {PAYMENT_OPTIONS.map((option) => {
              const selected = paymentMethod === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  activeOpacity={0.85}
                  style={[styles.paymentCard, selected ? styles.paymentCardSelected : null]}
                  onPress={() => updatePaymentMethod(option.key)}
                >
                  <View style={styles.paymentLeft}>
                    <View style={[styles.paymentIcon, selected ? styles.paymentIconSelected : null]}>
                      <Icon
                        name={option.icon}
                        size={20}
                        color={selected ? theme.colors.primary : theme.colors.textSecondary}
                      />
                    </View>
                    <View style={styles.paymentText}>
                      <Text style={styles.paymentTitle}>{option.title}</Text>
                      <Text style={styles.paymentSubtitle}>{option.subtitle}</Text>
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
        </View>

        <PrimaryButton
          title="Place Order"
          onPress={submitOrder}
          style={styles.submitBtn}
        />
      </ScrollView>

      <Toast 
        message={toastMessage} 
        visible={toastVisible} 
        onHide={() => setToastVisible(false)} 
      />
    </SafeAreaView>
  );
}

const createStyles = (theme) => StyleSheet.create({
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
  title: {
    ...theme.typography.title,
    fontSize: 20,
    color: theme.colors.primary,
  },
  headerSpacer: {
    width: 24,
  },
  container: {
    padding: theme.spacing.lg,
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.label,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    ...theme.typography.body,
    paddingVertical: theme.spacing.md,
    color: theme.colors.text,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.sm,
  },
  textAreaIcon: {
    marginTop: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  textArea: {
    minHeight: 100,
    paddingVertical: theme.spacing.sm,
  },
  submitBtn: {
    marginTop: theme.spacing.xl,
  },
  addressHint: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  addressHintBody: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  addressHintTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.primary,
    fontSize: 15,
  },
  addressHintText: {
    ...theme.typography.label,
    marginTop: 3,
  },
  paymentGroup: {
    gap: theme.spacing.sm,
  },
  paymentCard: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentCardSelected: {
    borderColor: theme.colors.accent,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.md,
  },
  paymentIcon: {
    width: 38,
    height: 38,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.md,
  },
  paymentIconSelected: {
    borderColor: theme.colors.accent,
  },
  paymentText: {
    flex: 1,
  },
  paymentTitle: {
    ...theme.typography.subtitle,
    fontSize: 15,
    color: theme.colors.text,
  },
  paymentSubtitle: {
    ...theme.typography.label,
    marginTop: 2,
  },
});
