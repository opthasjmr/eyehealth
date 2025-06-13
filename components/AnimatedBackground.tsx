import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  variant?: 'subtle' | 'dynamic' | 'gaming';
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  children, 
  variant = 'subtle' 
}) => {
  const { theme } = useTheme();
  
  const animation1 = useSharedValue(0);
  const animation2 = useSharedValue(0);
  const animation3 = useSharedValue(0);

  useEffect(() => {
    if (variant === 'dynamic' || variant === 'gaming') {
      animation1.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 3000 }),
          withTiming(0, { duration: 3000 })
        ),
        -1,
        true
      );

      animation2.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 4000 }),
          withTiming(0, { duration: 4000 })
        ),
        -1,
        true
      );

      animation3.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 5000 }),
          withTiming(0, { duration: 5000 })
        ),
        -1,
        true
      );
    }
  }, [variant]);

  const animatedStyle1 = useAnimatedStyle(() => {
    const translateX = animation1.value * 50;
    const translateY = animation1.value * 30;
    const scale = 0.8 + (animation1.value * 0.4);
    
    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
      ],
      opacity: variant === 'subtle' ? 0.1 : 0.2 + (animation1.value * 0.3),
    };
  });

  const animatedStyle2 = useAnimatedStyle(() => {
    const translateX = animation2.value * -40;
    const translateY = animation2.value * 60;
    const scale = 0.6 + (animation2.value * 0.6);
    
    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
      ],
      opacity: variant === 'subtle' ? 0.08 : 0.15 + (animation2.value * 0.25),
    };
  });

  const animatedStyle3 = useAnimatedStyle(() => {
    const translateX = animation3.value * 30;
    const translateY = animation3.value * -40;
    const scale = 0.9 + (animation3.value * 0.3);
    
    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
      ],
      opacity: variant === 'subtle' ? 0.06 : 0.1 + (animation3.value * 0.2),
    };
  });

  const getShapeColor = () => {
    switch (variant) {
      case 'gaming':
        return theme.colors.accent;
      case 'dynamic':
        return theme.colors.primary;
      default:
        return theme.colors.textSecondary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    shape: {
      position: 'absolute',
      borderRadius: 100,
      backgroundColor: getShapeColor(),
    },
    shape1: {
      width: 200,
      height: 200,
      top: height * 0.1,
      left: width * 0.7,
    },
    shape2: {
      width: 150,
      height: 150,
      top: height * 0.6,
      left: width * 0.1,
    },
    shape3: {
      width: 120,
      height: 120,
      top: height * 0.3,
      left: width * 0.5,
    },
    content: {
      flex: 1,
      zIndex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.shape, styles.shape1, animatedStyle1]} />
      <Animated.View style={[styles.shape, styles.shape2, animatedStyle2]} />
      <Animated.View style={[styles.shape, styles.shape3, animatedStyle3]} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};