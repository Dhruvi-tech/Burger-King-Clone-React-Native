import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileOption from '../components/ProfileOption';
import { useAppTheme } from '../../dhruvi/utils/ThemeContext';

export default function CustomerCareScreen({ navigation }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Care</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Need help with your order? Our support team is here for you.
        </Text>
        
        <View style={styles.optionsGroup}>
          <ProfileOption
            title="Call Us"
            icon="call-outline"
            value="1800-123-456"
            onPress={() => {}}
          />
          <ProfileOption
            title="Email Support"
            icon="mail-outline"
            value="help@bkclone.com"
            onPress={() => {}}
          />
          <ProfileOption
            title="Live Chat"
            icon="chatbubbles-outline"
            onPress={() => {}}
          />
        </View>
      </View>
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
    content: {
      flex: 1,
      padding: theme.spacing.md,
    },
    description: {
      ...theme.typography.body,
      fontSize: 16,
      textAlign: 'center',
      marginVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
      color: theme.colors.text,
    },
    optionsGroup: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      ...theme.shadows.light,
    },
  });