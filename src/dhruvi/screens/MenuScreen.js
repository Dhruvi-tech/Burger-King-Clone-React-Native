import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useAppTheme } from '../utils/ThemeContext';
import { menuData } from '../../archana/utils/menuData';
import { CartContext } from '../utils/CartContext';
import { useFavorites } from '../hooks/useFavorites';
import AnimatedCategoryTabs from '../components/AnimatedCategoryTabs';
import ProductCard from '../components/ProductCard';
import CustomizationModal from '../components/CustomizationModal';
import SearchBar from '../components/SearchBar';

const CATEGORIES = [
  { name: 'Burgers', image: require('../../assets/images/category_burgers.png'), type: 'burgers' },
  { name: 'Combos', image: require('../../assets/images/category_combos.png'), type: 'combos' },
  { name: 'Korean', image: require('../../assets/images/category_korean.png'), type: 'korean' },
  { name: 'Drinks', image: require('../../assets/images/category_beverages.png'), type: 'drinks' },
  { name: 'Cafe', image: require('../../assets/images/category_cafe.png'), type: 'cafe' },
  { name: 'Deals', image: require('../../assets/images/category_deals.png'), type: 'deals' },
  { name: 'Offers', image: require('../../assets/images/category_offers.png'), type: 'offers' },
  { name: 'Dessert', image: require('../../assets/images/dessert.png'), type: 'dessert' },
];

export default function MenuScreen() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const route = useRoute();
  const initialCategory = route.params?.category || 'burgers';
  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [search, setSearch] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [customItem, setCustomItem] = useState(null);

  const { cart, addToCart, increaseQty, decreaseQty } = useContext(CartContext);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    if (route.params?.category) {
      setSelectedCat(route.params.category);
    }
  }, [route.params?.category]);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    return menuData.filter(item => {
      const matchesCategory = selectedCat === 'all' || item.category === selectedCat;
      const matchesSearch = !query
        || item.name.toLowerCase().includes(query)
        || item.description?.toLowerCase().includes(query)
        || item.badge?.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCat]);

  const suggestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [];
    return menuData
      .filter(item => item.name.toLowerCase().includes(query))
      .slice(0, 3);
  }, [search]);

  const handleAddClick = useCallback((item) => {
    if (item.category === 'burgers') {
      setCustomItem(item);
      setModalVisible(true);
    } else {
      addToCart(item);
    }
  }, [addToCart]);

  const handleConfirmCustomization = useCallback((customizedItem) => {
    addToCart(customizedItem);
    setModalVisible(false);
  }, [addToCart]);

  const renderProduct = useCallback(({ item }) => (
    <ProductCard
      item={item}
      cartItem={cart[item.id]}
      onAdd={handleAddClick}
      onIncrease={increaseQty}
      onDecrease={decreaseQty}
      isFavorite={isFavorite(item.id)}
      onToggleFavorite={toggleFavorite}
    />
  ), [cart, decreaseQty, handleAddClick, increaseQty, isFavorite, toggleFavorite]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerEyebrow}>Have it your way</Text>
        <Text style={styles.headerTitle}>Burger King Menu</Text>
      </View>

      <View style={styles.stickyControls}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search Whopper, fries, coffee..."
        />
        {suggestions.length > 0 ? (
          <View style={styles.suggestions}>
            {suggestions.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.suggestionChip}
                onPress={() => setSearch(item.name)}
              >
                <Text style={styles.suggestionText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
        <AnimatedCategoryTabs 
          categories={CATEGORIES} 
          selected={selectedCat} 
          onSelect={setSelectedCat} 
        />
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
        removeClippedSubviews
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderProduct}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items found in this category.</Text>
          </View>
        }
      />

      <CustomizationModal
        visible={modalVisible}
        item={customItem}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmCustomization}
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
    headerEyebrow: {
      ...theme.typography.label,
      color: theme.colors.accent,
      fontWeight: '800',
      textTransform: 'uppercase',
      marginBottom: 2,
    },
    stickyControls: {
      backgroundColor: theme.colors.card,
      paddingBottom: theme.spacing.sm,
      ...theme.shadows.light,
      zIndex: 10,
    },
    suggestions: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.xs,
      gap: theme.spacing.xs,
    },
    suggestionChip: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.round,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    suggestionText: {
      ...theme.typography.label,
      color: theme.colors.primary,
      fontWeight: '700',
    },
    listContent: {
      padding: theme.spacing.xs,
      paddingBottom: 100,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 100,
    },
    emptyText: {
      ...theme.typography.body,
      fontSize: 16,
    },
  });
