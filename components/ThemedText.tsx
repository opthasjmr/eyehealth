import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemedTextProps extends TextProps {
  color?: 'text' | 'textSecondary' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export const ThemedText: React.FC<ThemedTextProps> = ({ 
  style, 
  color = 'text',
  ...props 
}) => {
  const { theme } = useTheme();
  
  return (
    <Text
      style={[
        { color: theme.colors[color] },
        style
      ]}
      {...props}
    />
  );
};