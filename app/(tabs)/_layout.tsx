import { Tabs } from 'expo-router';
import { Eye, Activity, Book, Settings, Pill } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontFamily: 'Inter-Bold',
        },
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