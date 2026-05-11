import React, { useCallback, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppTheme } from '../utils/ThemeContext';
import { CartContext } from '../utils/CartContext';
import { useFavorites } from '../hooks/useFavorites';
import ProductCard from '../components/ProductCard';

export default function FavoritesScreen() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { cart, addToCart, increaseQty, decreaseQty } = useContext(CartContext);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const renderItem = useCallback(({ item }) => (
    <ProductCard
      item={item}
      cartItem={cart[item.id]}
      onAdd={addToCart}
      onIncrease={increaseQty}
      onDecrease={decreaseQty}
      isFavorite={isFavorite(item.id)}
      onToggleFavorite={toggleFavorite}
    />
  ), [addToCart, cart, decreaseQty, increaseQty, isFavorite, toggleFavorite]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="heart-outline" size={60} color={theme.colors.border} />
          <Text style={styles.emptyText}>No favorites yet!</Text>
          <Text style={styles.emptySubText}>Items you heart will show up here.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={7}
          updateCellsBatchingPeriod={50}
          renderItem={renderItem}
        />
      )}
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
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      ...theme.typography.title,
      color: theme.colors.primary,
    },
    listContent: {
      padding: theme.spacing.xs,
      paddingBottom: 100,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      ...theme.typography.title,
      fontSize: 18,
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.xs,
    },
    emptySubText: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
    },
  });
