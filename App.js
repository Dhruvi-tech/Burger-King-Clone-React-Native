import React from 'react';
import { View, Text, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { enableFreeze, enableScreens } from 'react-native-screens';
import MainStack from './src/dhruvi/navigation/MainStack';
import { CartProvider } from './src/dhruvi/utils/CartContext';
import { FavoritesProvider } from './src/dhruvi/utils/FavoritesContext';
import { ThemeProvider } from './src/dhruvi/utils/ThemeContext';
import { AddressProvider } from './src/archana/utils/AddressContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

if (!process.env.JEST_WORKER_ID) {
  try {
    enableScreens();
    enableFreeze(true);
  } catch {
    // Native module isn't available in some non-device environments.
  }
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar backgroundColor="#5c2c06" barStyle="light-content" />
        <ThemeProvider>
          <CartProvider>
            <AddressProvider>
              <FavoritesProvider>
                <NavigationContainer>
                  <MainStack />
                </NavigationContainer>
              </FavoritesProvider>
            </AddressProvider>
          </CartProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
