import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import {
  Eye,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Target,
  Zap,
  CheckCircle,
  Timer,
  Activity,
  Focus,
  Hand,
  Circle,
  Square,
  Triangle,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface Exercise {
  id: string;
  title: string;
  description: string;
  icon: any;
  duration: number;
  instructions: string[];
  benefits: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'basic' | 'focus' | 'movement' | 'relaxation';
}

const exercises: Exercise[] = [
  {
    id: '20-20-20',
    title: '20-20-20 Rule',
    description: 'Look away from your screen every 20 minutes at an object 20 feet away for 20 seconds',
    icon: Clock,
    duration: 20,
    difficulty: 'easy',
    category: 'basic',
    instructions: [
      'Set a timer for 20 minutes',
      'When timer goes off, look away from your screen',
      'Find an object at least 20 feet away',
      'Focus on that object for 20 seconds',
      'Return to your work and reset timer'
    ],
    benefits: [
      'Reduces digital eye strain',
      'Prevents eye fatigue',
      'Maintains natural blinking',
      'Relaxes focusing muscles'
    ]
  },
  {
    id: 'blinking',
    title: 'Conscious Blinking',
    description: 'Blink frequently and fully to keep your eyes lubricated',
    icon: Eye,
    duration: 60,
    difficulty: 'easy',
    category: 'basic',
    instructions: [
      'Sit comfortably with eyes open',
      'Blink slowly and deliberately',
      'Close eyes completely for 1 second',
      'Open eyes and repeat',
      'Perform 20 conscious blinks'
    ],
    benefits: [
      'Improves tear distribution',
      'Reduces dry eye symptoms',
      'Cleanses eye surface',
      'Prevents eye irritation'
    ]
  },
  {
    id: 'palming',
    title: 'Palming Relaxation',
    description: 'Warm your palms and gently cup them over closed eyes to relax and reduce strain',
    icon: Hand,
    duration: 120,
    difficulty: 'easy',
    category: 'relaxation',
    instructions: [
      'Rub your palms together vigorously for 10 seconds',
      'Close your eyes gently',
      'Cup your warm palms over your closed eyes',
      'Ensure no light enters but don\'t press on eyes',
      'Breathe deeply and relax for 2 minutes'
    ],
    benefits: [
      'Deeply relaxes eye muscles',
      'Reduces eye strain',
      'Improves blood circulation',
      'Provides mental relaxation'
    ]
  },
  {
    id: 'eye-rolling',
    title: 'Eye Rolling Exercise',
    description: 'Slowly roll your eyes in circular motion to improve eye muscle flexibility',
    icon: RotateCcw,
    duration: 90,
    difficulty: 'medium',
    category: 'movement',
    instructions: [
      'Sit upright and look straight ahead',
      'Slowly roll eyes clockwise in a large circle',
      'Complete 5 clockwise rotations',
      'Pause and blink a few times',
      'Roll eyes counterclockwise 5 times',
      'Finish with gentle blinking'
    ],
    benefits: [
      'Improves eye muscle flexibility',
      'Enhances blood circulation',
      'Reduces muscle tension',
      'Increases range of motion'
    ]
  },
  {
    id: 'focus-shifting',
    title: 'Focus Shifting',
    description: 'Alternate focus between nearby and distant objects to exercise focusing muscles',
    icon: Target,
    duration: 120,
    difficulty: 'medium',
    category: 'focus',
    instructions: [
      'Hold your thumb 10 inches from your face',
      'Focus on your thumb for 3 seconds',
      'Shift focus to an object 20 feet away',
      'Focus on distant object for 3 seconds',
      'Return focus to your thumb',
      'Repeat 10 times'
    ],
    benefits: [
      'Strengthens focusing muscles',
      'Improves accommodation',
      'Reduces focusing fatigue',
      'Enhances visual flexibility'
    ]
  },
  {
    id: 'near-far-focusing',
    title: 'Near and Far Focusing',
    description: 'Move thumb closer and farther while maintaining focus',
    icon: Focus,
    duration: 90,
    difficulty: 'medium',
    category: 'focus',
    instructions: [
      'Hold thumb at arm\'s length',
      'Focus clearly on your thumb',
      'Slowly bring thumb closer to nose',
      'Stop when thumb becomes blurry',
      'Slowly move thumb back to arm\'s length',
      'Repeat 8-10 times'
    ],
    benefits: [
      'Exercises accommodation',
      'Improves near vision',
      'Strengthens ciliary muscles',
      'Enhances depth perception'
    ]
  },
  {
    id: 'figure-eight',
    title: 'Figure Eight Tracing',
    description: 'Trace an imaginary figure eight with your eyes',
    icon: Activity,
    duration: 60,
    difficulty: 'medium',
    category: 'movement',
    instructions: [
      'Imagine a large figure 8 about 8 feet away',
      'Trace the figure 8 slowly with your eyes',
      'Keep head still, move only eyes',
      'Trace 5 times in one direction',
      'Reverse direction and trace 5 times',
      'Blink and rest between sets'
    ],
    benefits: [
      'Improves eye coordination',
      'Enhances tracking skills',
      'Strengthens eye muscles',
      'Increases visual control'
    ]
  },
  {
    id: 'zooming',
    title: 'Zooming Exercise',
    description: 'Focus on thumb while moving it closer and farther',
    icon: Zap,
    duration: 75,
    difficulty: 'hard',
    category: 'focus',
    instructions: [
      'Extend arm with thumb up',
      'Focus on thumb nail details',
      'Slowly bring thumb toward nose',
      'Maintain sharp focus throughout',
      'Stop before double vision occurs',
      'Slowly extend arm back out',
      'Repeat 6-8 times'
    ],
    benefits: [
      'Maximizes accommodation range',
      'Improves focusing stamina',
      'Enhances visual concentration',
      'Strengthens focusing muscles'
    ]
  },
  {
    id: 'pencil-pushups',
    title: 'Pencil Push-ups',
    description: 'Focus on pencil tip while moving it closer until it blurs',
    icon: Triangle,
    duration: 90,
    difficulty: 'hard',
    category: 'focus',
    instructions: [
      'Hold pencil at arm\'s length vertically',
      'Focus on the pencil tip',
      'Slowly bring pencil toward nose',
      'Keep single, clear image',
      'Stop when pencil doubles or blurs',
      'Slowly move back to clear focus',
      'Repeat 10-15 times'
    ],
    benefits: [
      'Improves convergence',
      'Strengthens eye teaming',
      'Enhances binocular vision',
      'Reduces eye strain'
    ]
  }
];

export default function ExercisesScreen() {
  const { theme } = useTheme();
  const { user, updateStats } = useUser();
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [isExercising, setIsExercising] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dailyStreak, setDailyStreak] = useState(0);
  
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadCompletedExercises();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExercising && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime === 0) {
            completeExercise();
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

  useEffect(() => {
    if (isExercising) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnimation.setValue(1);
    }
  }, [isExercising]);

  const loadCompletedExercises = async () => {
    try {
      const saved = await AsyncStorage.getItem('completedExercises');
      const today = new Date().toDateString();
      const lastCompletedDate = await AsyncStorage.getItem('lastCompletedDate');
      
      if (saved && lastCompletedDate === today) {
        setCompletedExercises(JSON.parse(saved));
      } else {
        setCompletedExercises([]);
        await AsyncStorage.setItem('completedExercises', JSON.stringify([]));
      }

      const streak = await AsyncStorage.getItem('exerciseStreak');
      if (streak) {
        setDailyStreak(parseInt(streak));
      }
    } catch (error) {
      console.error('Error loading completed exercises:', error);
    }
  };

  const startExercise = (exercise: Exercise) => {
    setActiveExercise(exercise);
    setTimeLeft(exercise.duration);
    setCurrentStep(0);
    setIsExercising(true);
    progressAnimation.setValue(0);
  };

  const completeExercise = async () => {
    if (!activeExercise) return;

    setIsExercising(false);
    const updatedCompleted = [...completedExercises, activeExercise.id];
    const today = new Date().toDateString();
    
    try {
      await AsyncStorage.setItem('completedExercises', JSON.stringify(updatedCompleted));
      await AsyncStorage.setItem('lastCompletedDate', today);
      setCompletedExercises(updatedCompleted);

      if (user) {
        await updateStats({ 
          totalExercises: (user.stats.totalExercises || 0) + 1,
          streakDays: dailyStreak + 1,
        });
      }

      const newStreak = dailyStreak + 1;
      setDailyStreak(newStreak);
      await AsyncStorage.setItem('exerciseStreak', newStreak.toString());

      Alert.alert(
        'Exercise Complete!',
        `Great job completing ${activeExercise.title}. Keep up the good work!`,
        [{ text: 'Continue', onPress: () => setActiveExercise(null) }]
      );
    } catch (error) {
      console.error('Error saving completed exercise:', error);
    }
  };

  const toggleExercise = () => {
    setIsExercising(!isExercising);
  };

  const stopExercise = () => {
    setActiveExercise(null);
    setIsExercising(false);
    setTimeLeft(0);
    setCurrentStep(0);
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return theme.colors.primary;
      case 'focus': return theme.colors.accent;
      case 'movement': return theme.colors.warning;
      case 'relaxation': return theme.colors.success;
      default: return theme.colors.textSecondary;
    }
  };

  const getFilteredExercises = () => {
    if (selectedCategory === 'all') return exercises;
    return exercises.filter(exercise => exercise.category === selectedCategory);
  };

  const categories = [
    { id: 'all', name: 'All Exercises', icon: Activity },
    { id: 'basic', name: 'Basic', icon: Eye },
    { id: 'focus', name: 'Focus', icon: Target },
    { id: 'movement', name: 'Movement', icon: RotateCcw },
    { id: 'relaxation', name: 'Relaxation', icon: Hand },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 20,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 16,
    },
    streakContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
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
    categoriesContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    categoriesScroll: {
      flexDirection: 'row',
      gap: 12,
    },
    categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    categoryChipText: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '500',
      marginLeft: 6,
    },
    categoryChipTextActive: {
      color: '#FFFFFF',
    },
    exercisesList: {
      padding: 16,
    },
    exerciseCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    completedExercise: {
      borderColor: theme.colors.success,
      borderWidth: 2,
    },
    exerciseHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    exerciseIcon: {
      marginRight: 12,
    },
    exerciseInfo: {
      flex: 1,
    },
    exerciseTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 4,
    },
    exerciseDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    exerciseMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      gap: 12,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginLeft: 4,
    },
    difficultyBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
    },
    difficultyText: {
      fontSize: 10,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    categoryBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
    },
    categoryText: {
      fontSize: 10,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    startButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
    },
    startButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    completedIcon: {
      marginLeft: 8,
    },
    activeExerciseContainer: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      margin: 16,
      borderRadius: 20,
      padding: 20,
    },
    activeExerciseTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 16,
    },
    timerContainer: {
      alignItems: 'center',
      marginBottom: 24,
    },
    timerText: {
      fontSize: 48,
      fontWeight: '700',
      color: theme.colors.primary,
      marginTop: 8,
    },
    progressBarContainer: {
      width: '100%',
      height: 8,
      backgroundColor: theme.colors.background,
      borderRadius: 4,
      marginBottom: 24,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: theme.colors.primary,
    },
    instructionsContainer: {
      marginBottom: 24,
    },
    instructionsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
    },
    instructionItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
      backgroundColor: theme.colors.background,
      padding: 12,
      borderRadius: 8,
    },
    instructionNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    instructionNumberText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    instructionText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
    },
    controlButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
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
      marginTop: 16,
    },
    benefitsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    benefitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    benefitText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 8,
    },
  });

  if (activeExercise) {
    return (
      <View style={styles.container}>
        <View style={styles.activeExerciseContainer}>
          <Text style={styles.activeExerciseTitle}>{activeExercise.title}</Text>
          
          <View style={styles.timerContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
              <Timer size={32} color={theme.colors.primary} />
            </Animated.View>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            {activeExercise.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>Benefits:</Text>
            {activeExercise.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <CheckCircle size={16} color={theme.colors.success} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          <View style={styles.controlButtons}>
            <TouchableOpacity
              style={[styles.controlButton, styles.stopButton]}
              onPress={stopExercise}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>STOP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleExercise}
            >
              {isExercising ? (
                <Pause size={24} color="#FFFFFF" />
              ) : (
                <Play size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Eye Exercises</Text>
        <Text style={styles.subtitle}>
          Comprehensive eye exercises to improve vision health and reduce strain
        </Text>
        
        <View style={styles.streakContainer}>
          <CheckCircle size={20} color={theme.colors.success} />
          <Text style={styles.streakText}>
            Daily streak: <Text style={styles.streakNumber}>{dailyStreak} days</Text>
          </Text>
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <category.icon 
                size={16} 
                color={selectedCategory === category.id ? '#FFFFFF' : theme.colors.text}
              />
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category.id && styles.categoryChipTextActive,
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.exercisesList}>
        {getFilteredExercises().map((exercise) => (
          <View
            key={exercise.id}
            style={[
              styles.exerciseCard,
              completedExercises.includes(exercise.id) && styles.completedExercise,
            ]}
          >
            <View style={styles.exerciseHeader}>
              <exercise.icon size={32} color={theme.colors.primary} style={styles.exerciseIcon} />
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                <View style={styles.exerciseMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={12} color={theme.colors.textSecondary} />
                    <Text style={styles.metaText}>{formatTime(exercise.duration)}</Text>
                  </View>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
                    <Text style={styles.difficultyText}>{exercise.difficulty.toUpperCase()}</Text>
                  </View>
                  <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(exercise.category) }]}>
                    <Text style={styles.categoryText}>{exercise.category.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
              {completedExercises.includes(exercise.id) && (
                <CheckCircle size={24} color={theme.colors.success} style={styles.completedIcon} />
              )}
            </View>

            <TouchableOpacity style={styles.startButton} onPress={() => startExercise(exercise)}>
              <Play size={20} color="#FFFFFF" />
              <Text style={styles.startButtonText}>Start Exercise</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}