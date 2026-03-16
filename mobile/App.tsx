import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SitesScreen from './screens/SitesScreen';
import NewSiteScreen from './screens/NewSiteScreen';
import SiteDetailScreen from './screens/SiteDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0f172a' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen name="Sites" component={SitesScreen} options={{ title: '🌱 CarbonTrack' }} />
        <Stack.Screen name="NewSite" component={NewSiteScreen} options={{ title: 'Nouveau site' }} />
        <Stack.Screen name="SiteDetail" component={SiteDetailScreen} options={{ title: 'Détail du site' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
