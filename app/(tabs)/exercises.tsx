import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Eye, MoveHorizontal, MoveVertical, RotateCcw, Play, Pause, Timer } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Exercise {
  id: number;
  title: string;
  description: string;
  icon: any;
  duration: number; // in seconds
  instructions: string[];
}

const exercises: Exercise[] = [
  {
    id: 1,
    title: 'Focus Change',
    description: 'Look at near and far objects alternately',
    icon: Eye,
    duration: 120,
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
    instructions: [
      'Keep your head still',
      'Roll your eyes clockwise',
      'Complete 5 rotations',
      'Repeat counterclockwise'
    ]
  }
];

export default function ExercisesScreen() {
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [isExercising, setIsExercising] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const progressAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadCompletedExercises();
  }, []);

  const loadCompletedExercises = async () => {
    try {
      const saved = await AsyncStorage.getItem('completedExercises');
      if (saved) {
        setCompletedExercises(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading completed exercises:', error);
    }
  };

  const saveCompletedExercise = async (exerciseId: number) => {
    try {
      const updatedCompleted = [...completedExercises, exerciseId];
      await AsyncStorage.setItem('completedExercises', JSON.stringify(updatedCompleted));
      setCompletedExercises(updatedCompleted);
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
    Animated.timing(progressAnimation, {
      toValue: isExercising ? 1 : 0,
      duration: timeLeft * 1000,
      useNativeDriver: false,
    }).start();
  }, [isExercising]);

  const startExercise = (exercise: Exercise) => {
    setActiveExercise(exercise);
    setTimeLeft(exercise.duration);
    setIsExercising(true);
  };

  const toggleExercise = () => {
    setIsExercising(!isExercising);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Daily Eye Exercises</Text>
      
      {activeExercise ? (
        <View style={styles.activeExerciseContainer}>
          <Text style={styles.activeExerciseTitle}>{activeExercise.title}</Text>
          <View style={styles.timerContainer}>
            <Timer size={24} color="#007AFF" />
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

          <View style={styles.instructionsContainer}>
            {activeExercise.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>{index + 1}</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>

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
      ) : (
        exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={[
              styles.exerciseCard,
              completedExercises.includes(exercise.id) && styles.completedExercise,
            ]}
            onPress={() => startExercise(exercise)}>
            <View style={styles.iconContainer}>
              <exercise.icon size={32} color="#007AFF" />
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseTitle}>{exercise.title}</Text>
              <Text style={styles.exerciseDescription}>{exercise.description}</Text>
              <Text style={styles.duration}>{formatTime(exercise.duration)}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#000000',
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  completedExercise: {
    backgroundColor: '#F0F9FF',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#F2F2F7',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 16,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  duration: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  activeExerciseContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  activeExerciseTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#007AFF',
    marginLeft: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  instructionsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});