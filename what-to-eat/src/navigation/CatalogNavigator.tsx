import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CatalogScreen } from '../screens/CatalogScreen';
import { MealDetailScreen } from '../screens/MealDetailScreen';
import { AddMealScreen } from '../screens/AddMealScreen';
import { Meal } from '../types';

export type CatalogStackParamList = {
  CatalogList: undefined;
  MealDetail: { meals: Meal[]; initialIndex: number; onMealMutated?: () => void };
  AddMeal: undefined;
};

const Stack = createNativeStackNavigator<CatalogStackParamList>();

export function CatalogNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CatalogList" component={CatalogScreen} options={{ title: 'Catalog' }} />
      <Stack.Screen name="MealDetail" component={MealDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="AddMeal" component={AddMealScreen} options={{ title: 'Add Meal' }} />
    </Stack.Navigator>
  );
}
