import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Eye, MoveHorizontal, MoveVertical, RotateCcw, Play, Pause, Timer, CheckCircle } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';

interface Exercise {
  id: number;
  title: string;
  description: string;
  icon: any;
  duration: number; // in seconds
  instructions: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  benefits: string[];
}

const exercises: Exercise[] = [
  {
    id: 1,
    title: 'Focus Change',
    description: 'Look at near and far objects alternately',
    icon: Eye,
    duration: 120,
    difficulty: 'easy',
    benefits: ['Improves focus flexibility', 'Reduces eye strain'],
    instructions: [
      'Hold your thumb about 10 inches from your face',
      'Focus on your thumb for 5 seconds',
      'Look at an object 20 feet away for 5 seconds',
      'Repeat this process for the duration'
    ]
  },
  {
    id: 2,
    title: 'Horizontal Movement',
    description: 'Move eyes left to right slowly',
    icon: MoveHorizontal,
    duration: 60,
    difficulty: 'easy',
    benefits: ['Strengthens eye muscles', 'Improves peripheral vision'],
    instructions: [
      'Keep your head still',
      'Look as far left as comfortable',
      'Slowly move your gaze to the right',
      'Repeat this movement smoothly'
    ]
  },
  {
    id: 3,
    title: 'Vertical Movement',
    description: 'Move eyes up and down gently',
    icon: MoveVertical,
    duration: 60,
    difficulty: 'easy',
    benefits: ['Enhances eye coordination', 'Reduces tension'],
    instructions: [
      'Keep your head still',
      'Look up as far as comfortable',
      'Slowly move your gaze downward',
      'Repeat this movement smoothly'
    ]
  },
  {
    id: 4,
    title: 'Eye Rolling',
    description: 'Roll your eyes in circular motion',
    icon: RotateCcw,
    duration: 30,
    difficulty: 'medium',
    benefits: ['Improves blood circulation', 'Relaxes eye muscles'],
    instructions: [
      'Keep your head still',
      'Roll your eyes clockwise',
      'Complete 5 rotations',
      'Repeat counterclockwise'
    ]
  }
];

export default function ExercisesScreen() {
  const { theme } = useTheme();
  const { user, updateStats } = useUser();
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [isExercising, setIsExercising] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [dailyStreak, setDailyStreak] = useState(0);
  const progressAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadCompletedExercises();
  }, []);

  const loadCompletedExercises = async () => {
    try {
      const saved = await AsyncStorage.getItem('completedExercises');
      const today = new Date().toDateString();
      const lastCompletedDate = await AsyncStorage.getItem('lastCompletedDate');
      
      if (saved) {
        const completed = JSON.parse(saved);
        if (lastCompletedDate === today) {
          setCompletedExercises(completed);
        } else {
          // Reset daily exercises
          setCompletedExercises([]);
          await AsyncStorage.setItem('completedExercises', JSON.stringify([]));
        }
      }

      // Load streak
      const streak = await AsyncStorage.getItem('exerciseStreak');
      if (streak) {
        setDailyStreak(parseInt(streak));
      }
    } catch (error) {
      console.error('Error loading completed exercises:', error);
    }
  };

  const saveCompletedExercise = async (exerciseId: number) => {
    try {
      const updatedCompleted = [...completedExercises, exerciseId];
      const today = new Date().toDateString();
      
      await AsyncStorage.setItem('completedExercises', JSON.stringify(updatedCompleted));
      await AsyncStorage.setItem('lastCompletedDate', today);
      setCompletedExercises(updatedCompleted);

      // Update user stats
      if (user) {
        await updateStats({ 
          totalExercises: (user.stats.totalExercises || 0) + 1,
          streakDays: dailyStreak + 1,
        });
      }

      // Update streak
      const newStreak = dailyStreak + 1;
      setDailyStreak(newStreak);
      await AsyncStorage.setItem('exerciseStreak', newStreak.toString());
    } catch (error) {
      console.error('Error saving completed exercise:', error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExercising && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime === 0) {
            setIsExercising(false);
            if (activeExercise) {
              saveCompletedExercise(activeExercise.id);
            }
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExercising, timeLeft]);

  useEffect(() => {
    if (activeExercise && timeLeft > 0) {
      const progress = 1 - (timeLeft / activeExercise.duration);
      Animated.timing(progressAnimation, {
        toValue: progress,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  }, [timeLeft, activeExercise]);

  const startExercise = (exercise: Exercise) => {
    setActiveExercise(exercise);
    setTimeLeft(exercise.duration);
    setIsExercising(true);
    progressAnimation.setValue(0);
  };

  const toggleExercise = () => {
    setIsExercising(!isExercising);
  };

  const stopExercise = () => {
    setActiveExercise(null);
    setIsExercising(false);
    setTimeLeft(0);
    progressAnimation.setValue(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return theme.colors.success;
      case 'medium': return theme.colors.warning;
      case 'hard': return theme.colors.error;
      default: return theme.colors.primary;
    }
  };

  const getFilteredExercises = () => {
    if (!user) return exercises;
    
    const userDifficulty = user.preferences.exerciseDifficulty;
    return exercises.filter(exercise => {
      if (userDifficulty === 'easy') return exercise.difficulty === 'easy';
      if (userDifficulty === 'medium') return ['easy', 'medium'].includes(exercise.difficulty);
      return true; // hard includes all
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 16,
    },
    header: {
      marginBottom: 20,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    streakContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: 12,
      borderRadius: 12,
      marginBottom: 16,
    },
    streakText: {
      fontSize: 16,
      color: theme.colors.text,
      marginLeft: 8,
    },
    streakNumber: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    exerciseCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    completedExercise: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.success,
      borderWidth: 2,
    },
    iconContainer: {
      width: 60,
      height: 60,
      backgroundColor: theme.colors.background,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    exerciseInfo: {
      flex: 1,
      marginLeft: 16,
    },
    exerciseHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4,
    },
    exerciseTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
    },
    difficultyBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      marginLeft: 8,
    },
    difficultyText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    exerciseDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    exerciseFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    duration: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    completedIcon: {
      marginLeft: 8,
    },
    activeExerciseContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      marginBottom: 20,
    },
    activeExerciseTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    timerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    timerText: {
      fontSize: 32,
      fontWeight: '700',
      color: theme.colors.primary,
      marginLeft: 8,
    },
    progressBar: {
      width: '100%',
      height: 8,
      backgroundColor: theme.colors.background,
      borderRadius: 4,
      marginBottom: 24,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.colors.primary,
    },
    instructionsContainer: {
      width: '100%',
      marginBottom: 24,
    },
    instructionItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    instructionNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      color: '#FFFFFF',
      textAlign: 'center',
      lineHeight: 24,
      marginRight: 12,
      fontSize: 12,
      fontWeight: '600',
    },
    instructionText: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 24,
    },
    controlButtons: {
      flexDirection: 'row',
      gap: 16,
    },
    controlButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    stopButton: {
      backgroundColor: theme.colors.error,
    },
    benefitsContainer: {
      width: '100%',
      marginBottom: 16,
    },
    benefitsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    benefitItem: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Eye Exercises</Text>
        <View style={styles.streakContainer}>
          <CheckCircle size={20} color={theme.colors.success} />
          <Text style={styles.streakText}>
            Daily streak: <Text style={styles.streakNumber}>{dailyStreak} days</Text>
          </Text>
        </View>
      </View>
      
      {activeExercise ? (
        <View style={styles.activeExerciseContainer}>
          <Text style={styles.activeExerciseTitle}>{activeExercise.title}</Text>
          
          <View style={styles.timerContainer}>
            <Timer size={24} color={theme.colors.primary} />
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
          
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>Benefits:</Text>
            {activeExercise.benefits.map((benefit, index) => (
              <Text key={index} style={styles.benefitItem}>• {benefit}</Text>
            ))}
          </View>

          <View style={styles.instructionsContainer}>
            {activeExercise.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>{index + 1}</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          <View style={styles.controlButtons}>
            <TouchableOpacity
              style={[styles.controlButton, styles.stopButton]}
              onPress={stopExercise}>
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>STOP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleExercise}>
              {isExercising ? (
                <Pause size={24} color="#FFFFFF" />
              ) : (
                <Play size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        getFilteredExercises().map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={[
              styles.exerciseCard,
              completedExercises.includes(exercise.id) && styles.completedExercise,
            ]}
            onPress={() => startExercise(exercise)}>
            <View style={styles.iconContainer}>
              <exercise.icon size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.exerciseInfo}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
                  <Text style={styles.difficultyText}>{exercise.difficulty.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.exerciseDescription}>{exercise.description}</Text>
              <View style={styles.exerciseFooter}>
                <Text style={styles.duration}>{formatTime(exercise.duration)}</Text>
                {completedExercises.includes(exercise.id) && (
                  <CheckCircle size={20} color={theme.colors.success} style={styles.completedIcon} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}