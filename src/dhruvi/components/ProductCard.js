import React, { useCallback, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppTheme } from '../utils/ThemeContext';
import FavoriteButton from './FavoriteButton';

function ProductCard({ 
  item, 
  cartItem, 
  onAdd, 
  onIncrease, 
  onDecrease, 
  isFavorite, 
  onToggleFavorite 
}) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleToggleFavorite = useCallback(() => onToggleFavorite(item), [item, onToggleFavorite]);
  const handleAdd = useCallback(() => onAdd(item), [item, onAdd]);
  const handleDecrease = useCallback(() => onDecrease(item.id), [item.id, onDecrease]);
  const handleIncrease = useCallback(() => onIncrease(item), [item, onIncrease]);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.card}
    >
      <FavoriteButton 
        isFavorite={isFavorite} 
        onPress={handleToggleFavorite} 
        style={styles.favBtn}
      />
      
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
      </View>

      {item.badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      ) : null}

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        ) : null}
        <View style={styles.priceRow}>
          {item.oldPrice && <Text style={styles.oldPrice}>Rs {item.oldPrice}</Text>}
          <Text style={styles.price}>Rs {item.price}</Text>
        </View>

        {!cartItem ? (
          <TouchableOpacity activeOpacity={0.8} style={styles.addBtn} onPress={handleAdd}>
            <Text style={styles.addBtnText}>ADD</Text>
            <Icon name="add" size={16} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.qtyContainer}>
            <TouchableOpacity style={styles.qtyBtn} onPress={handleDecrease}>
              <Icon name="remove" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{cartItem.qty}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={handleIncrease}>
              <Icon name="add" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(ProductCard);

const createStyles = (theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      margin: theme.spacing.sm,
      width: '45%',
      ...theme.shadows.light,
      position: 'relative',
      minHeight: 238,
    },
    favBtn: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      zIndex: 10,
      padding: 4,
    },
    imageContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 100,
      marginBottom: theme.spacing.sm,
    },
    image: {
      width: 80,
      height: 80,
      resizeMode: 'contain',
    },
    infoContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    title: {
      ...theme.typography.subtitle,
      fontSize: 14,
      minHeight: 36,
      marginBottom: theme.spacing.xs,
    },
    description: {
      ...theme.typography.label,
      minHeight: 32,
      marginBottom: theme.spacing.xs,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    oldPrice: {
      ...theme.typography.body,
      fontSize: 12,
      textDecorationLine: 'line-through',
      marginRight: theme.spacing.xs,
    },
    price: {
      ...theme.typography.subtitle,
      color: theme.colors.primary,
    },
    addBtn: {
      backgroundColor: theme.colors.accent,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      borderRadius: theme.borderRadius.md,
    },
    addBtnText: {
      color: '#fff',
      fontWeight: 'bold',
      marginRight: 4,
      fontSize: 14,
    },
    qtyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 2,
    },
    qtyBtn: {
      padding: 6,
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.sm,
    },
    qtyText: {
      ...theme.typography.subtitle,
      fontSize: 14,
      color: theme.colors.primary,
    },
    badge: {
      position: 'absolute',
      top: theme.spacing.sm,
      left: theme.spacing.sm,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: theme.borderRadius.round,
    },
    badgeText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: '900',
    },
  });
