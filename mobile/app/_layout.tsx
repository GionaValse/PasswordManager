import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.light.primary,
      background: Colors.light.background,
      card: Colors.light.surface,
      text: Colors.light.onBackground,
      border: Colors.light.divider,
    },
  };

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: Colors.dark.primary,
      background: Colors.dark.background,
      card: Colors.dark.surface,
      text: Colors.dark.onBackground,
      border: Colors.dark.divider,
    },
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? MyDarkTheme : MyLightTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'My Passwords',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="scan"
          options={{
            headerShown: false,
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="details"
          options={{
            presentation: 'modal',
            title: 'Password Details',
          }}
        />
        <Stack.Screen
          name="view"
          options={{
            presentation: 'modal',
            title: 'Dettaglio Password',
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
