import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabs from './BottomTabs';
import CustomerCare from '../../archana/screens/CustomerCare';
import Orders from '../../archana/screens/Orders';
import Addresses from '../../archana/screens/Addresses';
import CheckoutScreen from '../../bimala/screens/CheckoutScreen';
import PaymentMethods from '../../archana/screens/PaymentMethods';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="Tabs" component={BottomTabs} />
      <Stack.Screen name="CustomerCare" component={CustomerCare} />
      <Stack.Screen name="Orders" component={Orders} />
      <Stack.Screen name="Addresses" component={Addresses} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
    </Stack.Navigator>
  );
}
