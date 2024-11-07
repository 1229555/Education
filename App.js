// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomePage from './components/WelcomePage';
import AudioRecording from './components/AudioTab';
import AddFilesTab from './components/AddFilesTab';
import DisplayFilesTab from './components/DisplayFilesTab';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomePage} />
        <Stack.Screen name="Audio" component={AudioRecording} />
        <Stack.Screen name="AddFiles" component={AddFilesTab} />
        <Stack.Screen name="DisplayFiles" component={DisplayFilesTab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
