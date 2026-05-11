/**
 * CartScreen displays the current shopping cart with item controls.
 * It handles promo codes, order totals, and navigation to checkout.
 */
import React, { useCallback, useContext, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { CartContext } from '../../dhruvi/utils/CartContext';
import { useAppTheme } from '../../dhruvi/utils/ThemeContext';
import EmptyCart from '../components/EmptyCart';
import QuantitySelector from '../components/QuantitySelector';
import PrimaryButton from '../components/PrimaryButton';
import PromoCodeInput from '../components/PromoCodeInput';

export default function CartScreen({ navigation }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {
    cart,
    cartPayableSubTotal,
    increaseQty,
    decreaseQty,
    removeFromCart,
    offerCode,
    offerDiscount,
    offerFreeDelivery,
    applyOffer,
  } = useContext(CartContext);

  // Convert cart object into an ordered array for list rendering and totals.
  // Convert the cart object into an array for list rendering and calculations.
  const cartItems = useMemo(() => Object.values(cart), [cart]);

  // Determine the payable subtotal either from context or by summing cart items.
  const total = useMemo(() => {
    if (typeof cartPayableSubTotal === 'number') return cartPayableSubTotal;
    return cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cartItems, cartPayableSubTotal]);
  const totalMrp = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.oldPrice || item.price) * item.qty, 0),
    [cartItems]
  );
  const savings = useMemo(() => totalMrp - total, [total, totalMrp]);
  const deliveryFee = useMemo(() => {
    if (offerFreeDelivery) return 0;
    return total >= 399 ? 0 : 39;
  }, [offerFreeDelivery, total]);
  const platformFee = useMemo(() => (cartItems.length > 0 ? 7 : 0), [cartItems.length]);
  const taxes = useMemo(() => Math.round(total * 0.05), [total]);
  const grandTotal = useMemo(
    () => Math.max(0, total + deliveryFee + platformFee + taxes - offerDiscount),
    [deliveryFee, offerDiscount, platformFee, taxes, total]
  );

  const offerLabel = useMemo(() => {
    if (!offerCode) return 'Promo Code';
    if (offerCode === 'B1G1') return 'Offer (B1G1)';
    return `Promo Code (${offerCode})`;
  }, [offerCode]);

  // Render each cart item with swipe-to-delete and quantity controls.
  const renderItem = useCallback(
    ({ item }) => (
      <Swipeable
        overshootRight={false}
        renderRightActions={() => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => removeFromCart(item.id)}
            style={styles.deleteAction}
          >
            <Icon name="trash-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      >
        <View style={styles.cartItemCard}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.itemPrice}>Rs {item.price}</Text>
          </View>
          <QuantitySelector
            quantity={item.qty}
            onIncrease={() => increaseQty(item)}
            onDecrease={() => decreaseQty(item.id)}
          />
        </View>
      </Swipeable>
    ),
    [decreaseQty, increaseQty, removeFromCart, styles]
  );

  // Show the empty cart UI when no items are present in the cart.
  if (cartItems.length === 0) {
    return <EmptyCart onBrowseMenu={() => navigation.navigate('Menu')} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cart</Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={9}
        updateCellsBatchingPeriod={50}
        ListFooterComponent={(
          <>
            <PromoCodeInput onApply={({ code }) => applyOffer(code, cartItems)} />

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Bill Details</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Item Total</Text>
                <Text style={styles.summaryValue}>Rs {totalMrp}</Text>
              </View>

              {savings > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Item Discount</Text>
                  <Text style={styles.savings}>- Rs {savings}</Text>
                </View>
              )}

              {offerDiscount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{offerLabel}</Text>
                  <Text style={styles.savings}>- Rs {offerDiscount}</Text>
                </View>
              )}

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={deliveryFee === 0 ? styles.savings : styles.summaryValue}>
                  {deliveryFee === 0 ? 'FREE' : `Rs ${deliveryFee}`}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Platform Fee</Text>
                <Text style={styles.summaryValue}>Rs {platformFee}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Taxes</Text>
                <Text style={styles.summaryValue}>Rs {taxes}</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryRow}>
                <Text style={styles.grandLabel}>To Pay</Text>
                <Text style={styles.grandValue}>Rs {grandTotal}</Text>
              </View>

              <PrimaryButton
                title="Proceed to Checkout"
                onPress={() => navigation.navigate('Checkout')}
                style={styles.checkoutBtn}
              />
            </View>
          </>
        )}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background,
    },
    title: {
      ...theme.typography.title,
      color: theme.colors.primary,
    },
    listContent: {
      padding: theme.spacing.md,
      paddingBottom: 40,
    },
    cartItemCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      ...theme.shadows.light,
    },
    itemInfo: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    itemName: {
      ...theme.typography.subtitle,
      fontSize: 16,
      marginBottom: 4,
    },
    itemPrice: {
      ...theme.typography.body,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    deleteAction: {
      backgroundColor: theme.colors.error,
      justifyContent: 'center',
      alignItems: 'center',
      width: 70,
      marginBottom: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginLeft: theme.spacing.sm,
    },
    summaryCard: {
      backgroundColor: theme.colors.card,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.md,
      ...theme.shadows.medium,
    },
    summaryTitle: {
      ...theme.typography.title,
      fontSize: 18,
      marginBottom: theme.spacing.md,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    summaryLabel: {
      ...theme.typography.body,
    },
    summaryValue: {
      ...theme.typography.body,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    summaryDivider: {
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.md,
    },
    savings: {
      ...theme.typography.body,
      fontWeight: 'bold',
      color: theme.colors.success,
    },
    grandLabel: {
      ...theme.typography.subtitle,
    },
    grandValue: {
      ...theme.typography.title,
      fontSize: 20,
      color: theme.colors.primary,
    },
    checkoutBtn: {
      marginTop: theme.spacing.lg,
    },
  });
