/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.useFakeTimers();

jest.mock('@react-navigation/native', () => {
  return {
    NavigationContainer: ({ children }: { children: any }) => children,
    useRoute: () => ({ params: {} }),
  };
});

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: { children: any }) => children,
    Screen: ({ children }: { children: any }) => children || null,
  }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }: { children: any }) => children,
    Screen: ({ children }: { children: any }) => children || null,
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: any }) => children,
  SafeAreaView: ({ children }: { children: any }) => children,
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
  Swipeable: ({ children }: { children: React.ReactNode }) => children,
}));

import App from '../App';

test('renders correctly', async () => {
  let root: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(() => {
    root = ReactTestRenderer.create(<App />);
  });

  await ReactTestRenderer.act(() => {
    jest.runOnlyPendingTimers();
  });

  await ReactTestRenderer.act(() => {
    root?.unmount();
  });
});
