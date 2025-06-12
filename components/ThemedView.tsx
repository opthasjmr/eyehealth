import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemedViewProps extends ViewProps {
  backgroundColor?: keyof typeof useTheme extends () => { theme: { colors: infer T } } ? T : never;
}

export const ThemedView: React.FC<ThemedViewProps> = ({ 
  style, 
  backgroundColor = 'background',
  ...props 
}) => {
  const { theme } = useTheme();
  
  return (
    <View
      style={[
        { backgroundColor: theme.colors[backgroundColor as keyof typeof theme.colors] },
        style
      ]}
      {...props}
    />
  );
};