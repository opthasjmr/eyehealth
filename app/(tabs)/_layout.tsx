import { Tabs } from 'expo-router';
import { Eye, Activity, Book, Settings, Pill, Target, User } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTitleStyle: {
          fontFamily: 'Inter-Bold',
          color: theme.colors.text,
        },
        headerTintColor: theme.colors.text,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Eye Care',
          tabBarIcon: ({ color, size }) => <Eye size={size} color={color} />,
          headerTitle: 'Eye Health',
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />,
          headerTitle: 'Eye Exercises',
        }}
      />
      <Tabs.Screen
        name="vision-test"
        options={{
          title: 'Vision Test',
          tabBarIcon: ({ color, size }) => <Target size={size} color={color} />,
          headerTitle: 'Vision Test',
        }}
      />
      <Tabs.Screen
        name="medications"
        options={{
          title: 'Medicines',
          tabBarIcon: ({ color, size }) => <Pill size={size} color={color} />,
          headerTitle: 'Medicine Reminders',
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => <Book size={size} color={color} />,
          headerTitle: 'Eye Education',
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'My Account',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          headerTitle: 'Settings',
        }}
      />
    </Tabs>
  );
}