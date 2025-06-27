import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface NeumorphicCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  pressed?: boolean;
  borderRadius?: number;
  padding?: number;
}

export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({
  children,
  style,
  pressed = false,
  borderRadius = 20,
  padding = 20,
}) => {
  const { theme, isDark } = useTheme();

  const styles = StyleSheet.create({
    container: {
      borderRadius,
      padding,
      backgroundColor: theme.colors.surface,
    },
    shadow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius,
      shadowColor: isDark ? '#000000' : '#FFFFFF',
      shadowOffset: pressed 
        ? { width: 2, height: 2 }
        : { width: -8, height: -8 },
      shadowOpacity: isDark ? 0.3 : 0.8,
      shadowRadius: pressed ? 4 : 16,
      elevation: pressed ? 2 : 8,
    },
    shadowDark: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius,
      shadowColor: isDark ? '#000000' : '#D1D5DB',
      shadowOffset: pressed 
        ? { width: -2, height: -2 }
        : { width: 8, height: 8 },
      shadowOpacity: isDark ? 0.5 : 0.6,
      shadowRadius: pressed ? 4 : 16,
      elevation: pressed ? 2 : 8,
    },
    content: {
      zIndex: 1,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.shadow} />
      <View style={styles.shadowDark} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};