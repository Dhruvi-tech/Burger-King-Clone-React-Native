import React, { useCallback, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import OrderCard from '../components/OrderCard';
import OrderTracker from '../components/OrderTracker';
import { CartContext } from '../../dhruvi/utils/CartContext';
import { useAppTheme } from '../../dhruvi/utils/ThemeContext';

export default function OrdersScreen({ navigation }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { orders } = useContext(CartContext);

  const dummyOrders = [
    {
      id: 'BK99001',
      date: 'Just Now',
      status: 'Preparing',
      total: 349,
      items: '1x Paneer Whopper Meal',
      isActive: true,
    },
    {
      id: 'BK98213',
      date: 'Today, 2:30 PM',
      status: 'Delivered',
      total: 468,
      items: '1x Veg Whopper Deluxe Meal, 1x Burger + Fries Combo',
    },
    {
      id: 'BK97542',
      date: 'Yesterday, 8:15 PM',
      status: 'Delivered',
      total: 249,
      items: '1x Spicy Chicken Burger',
    },
    {
      id: 'BK96411',
      date: 'Oct 12, 1:00 PM',
      status: 'Cancelled',
      total: 149,
      items: '1x Cold Coffee',
    },
  ];

  const data = useMemo(() => {
    if (!orders || orders.length === 0) return dummyOrders;

    const mapped = [...orders]
      .slice()
      .reverse()
      .map((order, index) => {
        const itemsText = (order.items || [])
          .map((item) => `${item.qty || 1}x ${item.name}`)
          .join(', ');
        const computedTotal = (order.items || []).reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
        const total = order.details?.grandTotal ?? computedTotal;
        return {
          id: `BK${order.id}`,
          date: new Date(order.id).toLocaleString(),
          status: 'Preparing',
          total,
          items: itemsText || '—',
          paymentMethod: order.details?.paymentMethod,
          isActive: index === 0,
        };
      });

    return mapped;
  }, [dummyOrders, orders]);

  const renderItem = useCallback(({ item }) => (
    <View>
      <OrderCard
        orderId={item.id}
        date={item.date}
        status={item.status}
        total={item.total}
        items={item.items}
        paymentMethod={item.paymentMethod}
      />
      {item.isActive && (
        <View style={styles.trackerWrap}>
          <Text style={styles.trackerTitle}>Live Tracking</Text>
          <OrderTracker status={item.status} />
        </View>
      )}
    </View>
  ), [styles]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
        updateCellsBatchingPeriod={50}
        renderItem={renderItem}
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
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background,
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
      paddingVertical: theme.spacing.md,
    },
    trackerWrap: {
      backgroundColor: theme.colors.card,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.light,
    },
    trackerTitle: {
      ...theme.typography.subtitle,
      color: theme.colors.primary,
      marginBottom: theme.spacing.sm,
    },
  });