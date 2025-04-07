import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppMainPage from './AppMainPage';
import TutorialPage from './TutorialPage';


const Stack = createNativeStackNavigator();

export default function Router() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={AppMainPage} />
        <Stack.Screen name="Tutorial" component={TutorialPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
