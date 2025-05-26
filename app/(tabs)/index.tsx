import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Clock, Sun, Moon, CircleAlert as AlertCircle, Activity, Eye } from 'lucide-react-native';
import { useState, useEffect } from 'react';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [screenTime, setScreenTime] = useState(0);
  const [nextBreak, setNextBreak] = useState(1200); // 20 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setScreenTime(prev => prev + 1);
      setNextBreak(prev => (prev > 0 ? prev - 1 : 1200));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Eye Health Dashboard</Text>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Clock size={24} color="#007AFF" />
            <Text style={styles.statLabel}>Screen Time</Text>
            <Text style={styles.statValue}>{formatTime(screenTime)}</Text>
          </View>
          <View style={styles.stat}>
            <Activity size={24} color="#FF9500" />
            <Text style={styles.statLabel}>Next Break</Text>
            <Text style={styles.statValue}>{formatTime(nextBreak)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Eye Care</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.card}>
            <Clock size={32} color="#007AFF" />
            <Text style={styles.cardTitle}>20-20-20 Rule</Text>
            <Text style={styles.cardDescription}>Take a 20-second break every 20 minutes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <Sun size={32} color="#FF9500" />
            <Text style={styles.cardTitle}>Blue Light</Text>
            <Text style={styles.cardDescription}>Adjust screen settings for comfort</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Exercises</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exerciseScroll}>
          <TouchableOpacity style={styles.exerciseCard}>
            <Eye size={24} color="#007AFF" />
            <Text style={styles.exerciseTitle}>Focus Shift</Text>
            <Text style={styles.exerciseTime}>2 min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exerciseCard}>
            <Activity size={24} color="#007AFF" />
            <Text style={styles.exerciseTitle}>Eye Rolling</Text>
            <Text style={styles.exerciseTime}>1 min</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exerciseCard}>
            <Moon size={24} color="#007AFF" />
            <Text style={styles.exerciseTitle}>Palming</Text>
            <Text style={styles.exerciseTime}>3 min</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eye Health Tips</Text>
        <View style={styles.tipContainer}>
          <AlertCircle size={24} color="#007AFF" />
          <Text style={styles.tipText}>Maintain proper screen distance (20-24 inches)</Text>
        </View>
        <View style={styles.tipContainer}>
          <Moon size={24} color="#007AFF" />
          <Text style={styles.tipText}>Reduce screen brightness in dark environments</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginTop: 2,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    color: '#000000',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
  },
  exerciseScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    width: width * 0.4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginTop: 8,
  },
  exerciseTime: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tipText: {
    fontSize: 15,
    color: '#000000',
    marginLeft: 12,
    flex: 1,
  },
});