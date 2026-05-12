import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileOption from '../components/ProfileOption';
import SectionHeader from '../components/SectionHeader';
import profileImg from '../../assets/images/profile.png';
import { useAppTheme } from '../../dhruvi/utils/ThemeContext';
import { CartContext } from '../../dhruvi/utils/CartContext';

export default function ProfileScreen({ navigation }) {
  const { isDark, theme, toggleTheme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { paymentMethod } = useContext(CartContext);

  const paymentValue = paymentMethod === 'cash' ? 'Cash' : 'UPI';
  const accountOptions = [
    { label: 'Recent Orders', icon: 'time-outline', route: 'Orders' },
    { label: 'Saved Addresses', icon: 'location-outline', route: 'Addresses' },
    { label: 'Payment Methods', icon: 'card-outline', route: 'PaymentMethods', value: paymentValue },
  ];

  const supportOptions = [
    { label: 'Customer Care', icon: 'headset-outline', route: 'CustomerCare' },
    { label: 'FAQs', icon: 'help-circle-outline', route: 'Profile' },
    { label: 'Logout', icon: 'log-out-outline', route: 'Tabs' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <Icon name="notifications-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* User Info Card */}
        <View style={styles.userInfoCard}>
          <Image source={profileImg} style={styles.profileImage} />
          <View style={styles.userDetails}>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.phone}>+91 9876543210</Text>
            <TouchableOpacity>
              <Text style={styles.editProfile}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Crown Rewards */}
        <View style={styles.rewardCard}>
          <View>
            <Text style={styles.rewardTitle}>Crown Rewards</Text>
            <Text style={styles.rewardSubtitle}>1,240 Crowns available</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.redeemBtn}
            onPress={() => navigation.navigate('Menu')}
          >
            <Text style={styles.redeemText}>Redeem</Text>
          </TouchableOpacity>
        </View>

        {/* Options List */}
        <SectionHeader title="My Account" />
        <View style={styles.optionsGroup}>
          {accountOptions.map((item, i) => (
            <ProfileOption
              key={i}
              title={item.label}
              icon={item.icon}
              value={item.value}
              onPress={() => navigation.navigate(item.route)}
            />
          ))}
        </View>

        <SectionHeader title="Support & More" />
        <View style={styles.optionsGroup}>
          <ProfileOption
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            icon={isDark ? 'sunny-outline' : 'moon-outline'}
            onPress={toggleTheme}
          />
          {supportOptions.map((item, i) => (
            <ProfileOption
              key={i}
              title={item.label}
              icon={item.icon}
              onPress={() => navigation.navigate(item.route)}
            />
          ))}
        </View>

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
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.background,
    },
    headerTitle: {
      ...theme.typography.title,
      color: theme.colors.primary,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    userInfoCard: {
      flexDirection: 'row',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.card,
      marginHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.light,
      marginBottom: theme.spacing.md,
    },
    profileImage: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginRight: theme.spacing.md,
    },
    userDetails: {
      justifyContent: 'center',
    },
    name: {
      ...theme.typography.title,
      fontSize: 20,
      marginBottom: 4,
    },
    phone: {
      ...theme.typography.body,
      marginBottom: 8,
    },
    editProfile: {
      ...theme.typography.label,
      color: theme.colors.accent,
      fontWeight: 'bold',
    },
    rewardCard: {
      backgroundColor: theme.colors.primary,
      marginHorizontal: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      ...theme.shadows.medium,
    },
    rewardTitle: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 4,
    },
    rewardSubtitle: {
      color: '#e0e0e0',
      fontSize: 12,
    },
    redeemBtn: {
      backgroundColor: theme.colors.accent,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
    },
    redeemText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
    optionsGroup: {
      backgroundColor: theme.colors.card,
      marginHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      ...theme.shadows.light,
      marginBottom: theme.spacing.md,
    },
  });