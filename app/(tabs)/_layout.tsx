import { Tabs } from 'expo-router';
import { Eye, Activity, Book, Settings, Pill, Target, User, Brain, Gamepad2, Search } from 'lucide-react-native';
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
          height: 85,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTitleStyle: {
          fontFamily: 'Inter-Bold',
          color: theme.colors.text,
        },
        headerTintColor: theme.colors.text,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Eye size={size} color={color} />,
          headerTitle: 'Eye Health Dashboard',
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
        name="games"
        options={{
          title: 'Games',
          tabBarIcon: ({ color, size }) => <Gamepad2 size={size} color={color} />,
          headerTitle: 'Vision Games',
        }}
      />
      <Tabs.Screen
        name="ai-screening"
        options={{
          title: 'AI Screen',
          tabBarIcon: ({ color, size }) => <Brain size={size} color={color} />,
          headerTitle: 'AI Vision Screening',
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
        name="research"
        options={{
          title: 'Research',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
          headerTitle: 'Research Hub',
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