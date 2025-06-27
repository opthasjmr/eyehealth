import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolate 
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

interface MaterialButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const MaterialButton: React.FC<MaterialButtonProps> = ({
  title,
  onPress,
  variant = 'filled',
  size = 'medium',
  color,
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
    opacity.value = withTiming(0.8, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 16, paddingVertical: 8, fontSize: 14 };
      case 'large':
        return { paddingHorizontal: 32, paddingVertical: 16, fontSize: 18 };
      default:
        return { paddingHorizontal: 24, paddingVertical: 12, fontSize: 16 };
    }
  };

  const sizeStyles = getSizeStyles();
  const buttonColor = color || theme.colors.primary;

  const styles = StyleSheet.create({
    container: {
      borderRadius: 12,
      overflow: 'hidden',
      opacity: disabled || loading ? 0.6 : 1,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: sizeStyles.paddingHorizontal,
      paddingVertical: sizeStyles.paddingVertical,
      borderRadius: 12,
    },
    filled: {
      backgroundColor: buttonColor,
      shadowColor: buttonColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: buttonColor,
    },
    text: {
      backgroundColor: 'transparent',
    },
    buttonText: {
      fontSize: sizeStyles.fontSize,
      fontFamily: 'Inter-SemiBold',
      textAlign: 'center',
    },
    filledText: {
      color: '#FFFFFF',
    },
    outlinedText: {
      color: buttonColor,
    },
    textText: {
      color: buttonColor,
    },
    iconContainer: {
      marginHorizontal: 4,
    },
    gradient: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: sizeStyles.paddingHorizontal,
      paddingVertical: sizeStyles.paddingVertical,
    },
  });

  const getTextStyle = () => {
    switch (variant) {
      case 'outlined':
        return styles.outlinedText;
      case 'text':
        return styles.textText;
      default:
        return styles.filledText;
    }
  };

  const renderContent = () => (
    <>
      {icon && iconPosition === 'left' && (
        <div style={styles.iconContainer}>{icon}</div>
      )}
      <Text style={[styles.buttonText, getTextStyle(), textStyle]}>
        {loading ? 'Loading...' : title}
      </Text>
      {icon && iconPosition === 'right' && (
        <div style={styles.iconContainer}>{icon}</div>
      )}
    </>
  );

  if (variant === 'filled') {
    const gradientColors = [
      buttonColor,
      `${buttonColor}DD`,
    ];

    return (
      <AnimatedTouchableOpacity
        style={[styles.container, style, animatedStyle]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {renderContent()}
        </LinearGradient>
      </AnimatedTouchableOpacity>
    );
  }

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.container,
        styles.button,
        variant === 'outlined' ? styles.outlined : styles.text,
        style,
        animatedStyle,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={1}
    >
      {renderContent()}
    </AnimatedTouchableOpacity>
  );
};