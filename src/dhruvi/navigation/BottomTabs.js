import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../../archana/screens/ProfileScreen';
import CartScreen from '../../bimala/screens/CartScreen';
import { CartContext } from '../utils/CartContext';
import { useFavoritesContext } from '../utils/FavoritesContext';
import { useAppTheme } from '../utils/ThemeContext';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { cart } = useContext(CartContext);
  const { favoriteCount } = useFavoritesContext();
  const cartCount = Object.keys(cart).length;
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        lazy: true,
        detachInactiveScreens: true,
        freezeOnBlur: true,
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          backgroundColor: theme.colors.primary,
          borderTopWidth: 0,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ color, focused }) => {
          let icon;
          if (route.name === 'Home') icon = focused ? 'home' : 'home-outline';
          else if (route.name === 'Menu') icon = focused ? 'fast-food' : 'fast-food-outline';
          else if (route.name === 'Favorites') icon = focused ? 'heart' : 'heart-outline';
          else if (route.name === 'Cart') icon = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'Profile') icon = focused ? 'person' : 'person-outline';

          return (
            <View style={styles.iconWrap}>
              <Icon name={icon} size={24} color={color} />
              {route.name === 'Cart' && cartCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              ) : null}
              {route.name === 'Favorites' && favoriteCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{favoriteCount}</Text>
                </View>
              ) : null}
            </View>
          );
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const createStyles = (theme) =>
  StyleSheet.create({
    iconWrap: {
      width: 28,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
    },
    badge: {
      position: 'absolute',
      top: -8,
      right: -8,
      backgroundColor: theme.colors.accent,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      paddingHorizontal: 5,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    badgeText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: '900',
    },
  });
