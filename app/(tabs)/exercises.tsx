import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Eye, MoveHorizontal, MoveVertical, RotateCcw } from 'lucide-react-native';

const exercises = [
  {
    id: 1,
    title: 'Focus Change',
    description: 'Look at near and far objects alternately',
    icon: Eye,
    duration: '2 minutes',
  },
  {
    id: 2,
    title: 'Horizontal Movement',
    description: 'Move eyes left to right slowly',
    icon: MoveHorizontal,
    duration: '1 minute',
  },
  {
    id: 3,
    title: 'Vertical Movement',
    description: 'Move eyes up and down gently',
    icon: MoveVertical,
    duration: '1 minute',
  },
  {
    id: 4,
    title: 'Eye Rolling',
    description: 'Roll your eyes in circular motion',
    icon: RotateCcw,
    duration: '30 seconds',
  },
];

export default function ExercisesScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Daily Eye Exercises</Text>
      {exercises.map((exercise) => (
        <TouchableOpacity key={exercise.id} style={styles.exerciseCard}>
          <View style={styles.iconContainer}>
            <exercise.icon size={32} color="#007AFF" />
          </View>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseTitle}>{exercise.title}</Text>
            <Text style={styles.exerciseDescription}>{exercise.description}</Text>
            <Text style={styles.duration}>{exercise.duration}</Text>
          </View>
        </TouchableOpacity>
      ))}
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
});