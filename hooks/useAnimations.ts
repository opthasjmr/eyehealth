import { useSharedValue, withTiming, withRepeat, withSequence, useAnimatedStyle } from 'react-native-reanimated';
import { useEffect } from 'react';

export const useAnimations = () => {
  // Pulse animation
  const usePulse = (isActive: boolean = true, duration: number = 1000) => {
    const pulseValue = useSharedValue(1);

    useEffect(() => {
      if (isActive) {
        pulseValue.value = withRepeat(
          withSequence(
            withTiming(1.1, { duration: duration / 2 }),
            withTiming(1, { duration: duration / 2 })
          ),
          -1,
          true
        );
      } else {
        pulseValue.value = withTiming(1);
      }
    }, [isActive, duration]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: pulseValue.value }],
    }));

    return { animatedStyle, pulseValue };
  };

  // Fade animation
  const useFade = (isVisible: boolean = true, duration: number = 500) => {
    const fadeValue = useSharedValue(isVisible ? 1 : 0);

    useEffect(() => {
      fadeValue.value = withTiming(isVisible ? 1 : 0, { duration });
    }, [isVisible, duration]);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: fadeValue.value,
    }));

    return { animatedStyle, fadeValue };
  };

  // Slide animation
  const useSlide = (isVisible: boolean = true, direction: 'up' | 'down' | 'left' | 'right' = 'up', distance: number = 100, duration: number = 500) => {
    const slideValue = useSharedValue(isVisible ? 0 : distance);

    useEffect(() => {
      slideValue.value = withTiming(isVisible ? 0 : distance, { duration });
    }, [isVisible, distance, duration]);

    const animatedStyle = useAnimatedStyle(() => {
      const transform = [];
      
      switch (direction) {
        case 'up':
          transform.push({ translateY: slideValue.value });
          break;
        case 'down':
          transform.push({ translateY: -slideValue.value });
          break;
        case 'left':
          transform.push({ translateX: slideValue.value });
          break;
        case 'right':
          transform.push({ translateX: -slideValue.value });
          break;
      }

      return { transform };
    });

    return { animatedStyle, slideValue };
  };

  // Rotation animation
  const useRotation = (isActive: boolean = true, duration: number = 2000) => {
    const rotationValue = useSharedValue(0);

    useEffect(() => {
      if (isActive) {
        rotationValue.value = withRepeat(
          withTiming(360, { duration }),
          -1,
          false
        );
      } else {
        rotationValue.value = withTiming(0);
      }
    }, [isActive, duration]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: `${rotationValue.value}deg` }],
    }));

    return { animatedStyle, rotationValue };
  };

  // Shake animation
  const useShake = (trigger: boolean = false, intensity: number = 10, duration: number = 500) => {
    const shakeValue = useSharedValue(0);

    useEffect(() => {
      if (trigger) {
        shakeValue.value = withSequence(
          withTiming(intensity, { duration: duration / 8 }),
          withTiming(-intensity, { duration: duration / 8 }),
          withTiming(intensity, { duration: duration / 8 }),
          withTiming(-intensity, { duration: duration / 8 }),
          withTiming(intensity, { duration: duration / 8 }),
          withTiming(-intensity, { duration: duration / 8 }),
          withTiming(intensity, { duration: duration / 8 }),
          withTiming(0, { duration: duration / 8 })
        );
      }
    }, [trigger, intensity, duration]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: shakeValue.value }],
    }));

    return { animatedStyle, shakeValue };
  };

  // Scale animation
  const useScale = (isActive: boolean = true, scale: number = 1.2, duration: number = 300) => {
    const scaleValue = useSharedValue(1);

    useEffect(() => {
      scaleValue.value = withTiming(isActive ? scale : 1, { duration });
    }, [isActive, scale, duration]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scaleValue.value }],
    }));

    return { animatedStyle, scaleValue };
  };

  return {
    usePulse,
    useFade,
    useSlide,
    useRotation,
    useShake,
    useScale,
  };
};