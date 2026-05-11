import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppTheme } from '../utils/ThemeContext';
import SearchBar from '../components/SearchBar';
import FeaturedBanner from '../components/FeaturedBanner';
import AnimatedCategoryTabs from '../components/AnimatedCategoryTabs';
import bannerImg from '../../assets/images/banner.png';
import { menuData } from '../../archana/utils/menuData';

const CATEGORIES = [
  { name: 'Whoppers', image: require('../../assets/images/category_burgers.png'), type: 'burgers' },
  { name: 'King Combos', image: require('../../assets/images/category_combos.png'), type: 'combos' },
  { name: 'Fiery Range', image: require('../../assets/images/category_korean.png'), type: 'korean' },
  { name: 'Beverages', image: require('../../assets/images/category_beverages.png'), type: 'drinks' },
  { name: 'Deals', image: require('../../assets/images/category_deals.png'), type: 'deals' },
  { name: 'BK Cafe', image: require('../../assets/images/category_cafe.png'), type: 'cafe' },
];

const QUICK_ACTIONS = [
  { label: 'Dine-in', icon: 'restaurant-outline' },
  { label: 'Delivery', icon: 'bicycle-outline' },
  { label: 'Takeaway', icon: 'bag-handle-outline' },
];

const DEALS = [
  { id: 'deal-1', title: 'Whopper Wednesday', subtitle: 'Limited-time flame-grilled deals', category: 'offers' },
  { id: 'deal-2', title: 'King Box Combos', subtitle: 'Meal boxes from Rs 349', category: 'combos' },
  { id: 'deal-3', title: 'BK Cafe Break', subtitle: 'Cold coffee and shakes', category: 'cafe' },
];

export default function HomeScreen({ navigation }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [search, setSearch] = useState('');
  const recommended = useMemo(
    () => menuData.filter(item => ['BESTSELLER', 'POPULAR', 'KING BOX', 'LIMITED'].includes(item.badge)).slice(0, 4),
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Deliver to</Text>
          <View style={styles.locationRow}>
            <Icon name="location" size={18} color={theme.colors.accent} />
            <Text style={styles.locationText}>Gopalan Arcade, Bengaluru</Text>
            <Icon name="chevron-down" size={16} color={theme.colors.primary} />
          </View>
        </View>
        <View style={styles.crownBadge}>
          <Icon name="star" size={14} color="#fff" />
          <Text style={styles.crownText}>1240</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search for your favorite Whopper..."
        />

        <FeaturedBanner
          image={bannerImg}
          title="Super Saver Combos"
          subtitle="Get up to 40% OFF on Meals"
          onPress={() => navigation.navigate('Menu', { category: 'deals' })}
        />

        <View style={styles.heroStrip}>
          <View>
            <Text style={styles.heroKicker}>BK Crown Rewards</Text>
            <Text style={styles.heroTitle}>Flame-grilled cravings, faster.</Text>
          </View>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>2X</Text>
            <Text style={styles.heroBadgeLabel}>Crowns</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          {QUICK_ACTIONS.map(action => (
            <TouchableOpacity key={action.label} activeOpacity={0.8} style={styles.quickAction}>
              <Icon name={action.icon} size={20} color={theme.colors.primary} />
              <Text style={styles.quickActionText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Deals</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Menu', { category: 'offers' })}>
            <Text style={styles.sectionAction}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dealsList}
        >
          {DEALS.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              style={styles.dealCard}
              onPress={() => navigation.navigate('Menu', { category: item.category })}
            >
              <Text style={styles.dealTitle}>{item.title}</Text>
              <Text style={styles.dealSubtitle}>{item.subtitle}</Text>
              <Text style={styles.dealCta}>Order now</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore BK Menu</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Text style={styles.sectionAction}>View all</Text>
          </TouchableOpacity>
        </View>

        <AnimatedCategoryTabs
          categories={CATEGORIES}
          selected={null}
          onSelect={(type) => navigation.navigate('Menu', { category: type })}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
        </View>
        {recommended.map(item => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.85}
            style={styles.recommendationRow}
            onPress={() => navigation.navigate('Menu', { category: item.category })}
          >
            <View>
              <Text style={styles.recommendationTitle}>{item.name}</Text>
              <Text style={styles.recommendationSub}>{item.description}</Text>
            </View>
            <Text style={styles.recommendationPrice}>Rs {item.price}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    greeting: {
      ...theme.typography.label,
      color: theme.colors.textSecondary,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
    },
    locationText: {
      ...theme.typography.subtitle,
      fontSize: 16,
      color: theme.colors.primary,
      marginHorizontal: 4,
    },
    crownBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.secondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.round,
    },
    crownText: {
      color: '#fff',
      fontWeight: 'bold',
      marginLeft: 4,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      marginTop: theme.spacing.lg,
      marginBottom: theme.spacing.xs,
    },
    sectionTitle: {
      ...theme.typography.title,
      fontSize: 20,
      color: theme.colors.primary,
    },
    sectionAction: {
      ...theme.typography.label,
      color: theme.colors.accent,
      fontWeight: '800',
    },
    heroStrip: {
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.sm,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    heroKicker: {
      ...theme.typography.label,
      color: theme.colors.secondary,
      fontWeight: '800',
      textTransform: 'uppercase',
    },
    heroTitle: {
      ...theme.typography.subtitle,
      color: '#fff',
      marginTop: 4,
      maxWidth: 230,
    },
    heroBadge: {
      backgroundColor: theme.colors.secondary,
      width: 58,
      height: 58,
      borderRadius: 29,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroBadgeText: {
      color: theme.colors.primary,
      fontSize: 20,
      fontWeight: '900',
    },
    heroBadgeLabel: {
      color: theme.colors.primary,
      fontSize: 10,
      fontWeight: '800',
    },
    quickActions: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    quickAction: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.sm,
      alignItems: 'center',
      gap: 4,
    },
    quickActionText: {
      ...theme.typography.label,
      color: theme.colors.primary,
      fontWeight: '700',
    },
    dealsList: {
      paddingHorizontal: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    dealCard: {
      width: 210,
      backgroundColor: theme.colors.secondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
    },
    dealTitle: {
      ...theme.typography.subtitle,
      color: theme.colors.primary,
      fontWeight: '900',
    },
    dealSubtitle: {
      ...theme.typography.label,
      color: theme.colors.primary,
      marginTop: 4,
      minHeight: 34,
    },
    dealCta: {
      ...theme.typography.label,
      color: theme.colors.accent,
      fontWeight: '900',
      marginTop: theme.spacing.sm,
    },
    recommendationRow: {
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    recommendationTitle: {
      ...theme.typography.subtitle,
      fontSize: 15,
    },
    recommendationSub: {
      ...theme.typography.label,
      marginTop: 3,
      maxWidth: 220,
    },
    recommendationPrice: {
      ...theme.typography.subtitle,
      color: theme.colors.accent,
      fontSize: 14,
    },
  });
