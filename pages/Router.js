import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppMainPage from './AppMainPage';
import TutorialPage from './TutorialPage';
import TestPage from './TestPage';
import ResultPage from './ResultPage';
import RepeatSentencepage from './testpages/RepeatSentencePage ';
import StorytellingPage from './testpages/StorytellingPage ';
import ImageJudgementPage from './testpages/ImageJudgementPage ';
import FluencyPage from './testpages/FluencyPage ';


const Stack = createNativeStackNavigator();

export default function Router() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={AppMainPage} />
        <Stack.Screen name="Tutorial" component={TutorialPage} />
        <Stack.Screen name="Repeat" component={RepeatSentencepage} />
        <Stack.Screen name="Image" component={ImageJudgementPage} />
        <Stack.Screen name="Fluency" component={FluencyPage} />
        <Stack.Screen name="Story" component={StorytellingPage} />
        <Stack.Screen name="Result" component={ResultPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
