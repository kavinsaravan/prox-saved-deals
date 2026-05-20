import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types';
import { DealsListScreen } from './src/screens/DealsListScreen';
import { DealDetailScreen } from './src/screens/DealDetailScreen';
import { SavedItemsScreen } from './src/screens/SavedItemsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="DealsList"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="DealsList" component={DealsListScreen} />
        <Stack.Screen name="DealDetail" component={DealDetailScreen} />
        <Stack.Screen name="SavedItems" component={SavedItemsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
