import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Eye, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface TestResult {
  date: string;
  score: number;
  type: string;
}

const letters = ['E', 'F', 'P', 'T', 'O', 'Z', 'L', 'D', 'C'];
const directions = ['up', 'right', 'down', 'left'];
const levels = [
  { size: 100, distance: '20 feet' },
  { size: 80, distance: '20 feet' },
  { size: 60, distance: '20 feet' },
  { size: 40, distance: '20 feet' },
  { size: 30, distance: '20 feet' },
];

export default function VisionTestScreen() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentLetter, setCurrentLetter] = useState('');
  const [direction, setDirection] = useState('');
  const [score, setScore] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);

  useEffect(() => {
    loadTestHistory();
  }, []);

  const loadTestHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('visionTestHistory');
      if (history) {
        setTestHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading test history:', error);
    }
  };

  const saveTestResult = async (score: number) => {
    try {
      const newResult: TestResult = {
        date: new Date().toISOString(),
        score,
        type: 'Visual Acuity',
      };
      const updatedHistory = [...testHistory, newResult];
      await AsyncStorage.setItem('visionTestHistory', JSON.stringify(updatedHistory));
      setTestHistory(updatedHistory);
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  };

  const startTest = () => {
    setIsTestActive(true);
    setCurrentLevel(0);
    setScore(0);
    generateNewLetter();
  };

  const generateNewLetter = () => {
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    setCurrentLetter(randomLetter);
    setDirection(randomDirection);
  };

  const handleDirectionPress = (selectedDirection: string) => {
    if (selectedDirection === direction) {
      setScore(score + 1);
    }

    if (score + 1 >= 3) {
      if (currentLevel + 1 < levels.length) {
        setCurrentLevel(currentLevel + 1);
        setScore(0);
      } else {
        endTest();
      }
    }
    generateNewLetter();
  };

  const endTest = async () => {
    setIsTestActive(false);
    const finalScore = ((currentLevel + 1) / levels.length) * 100;
    await saveTestResult(finalScore);
  };

  const getRotationStyle = () => {
    switch (direction) {
      case 'up':
        return { transform: [{ rotate: '0deg' }] };
      case 'right':
        return { transform: [{ rotate: '90deg' }] };
      case 'down':
        return { transform: [{ rotate: '180deg' }] };
      case 'left':
        return { transform: [{ rotate: '270deg' }] };
      default:
        return {};
    }
  };

  return (
    <View style={styles.container}>
      {!isTestActive ? (
        <View style={styles.startContainer}>
          <Eye size={48} color="#007AFF" />
          <Text style={styles.title}>Vision Acuity Test</Text>
          <Text style={styles.instructions}>
            Hold your device at arm's length and indicate which direction the letter is pointing.
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={startTest}>
            <Text style={styles.startButtonText}>Start Test</Text>
          </TouchableOpacity>

          {testHistory.length > 0 && (
            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Previous Results</Text>
              {testHistory.slice(-3).map((result, index) => (
                <View key={index} style={styles.historyItem}>
                  <Text style={styles.historyDate}>
                    {new Date(result.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.historyScore}>{Math.round(result.score)}%</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.testContainer}>
          <Text style={styles.levelText}>
            Level {currentLevel + 1} of {levels.length}
          </Text>
          <View style={styles.letterContainer}>
            <Text
              style={[
                styles.letter,
                { fontSize: levels[currentLevel].size },
                getRotationStyle(),
              ]}>
              {currentLetter}
            </Text>
          </View>
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.directionButton}
              onPress={() => handleDirectionPress('up')}>
              <ArrowLeft size={32} color="#007AFF" style={{ transform: [{ rotate: '90deg' }] }} />
            </TouchableOpacity>
            <View style={styles.horizontalControls}>
              <TouchableOpacity
                style={styles.directionButton}
                onPress={() => handleDirectionPress('left')}>
                <ArrowLeft size={32} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.directionButton}
                onPress={() => handleDirectionPress('right')}>
                <ArrowRight size={32} color="#007AFF" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.directionButton}
              onPress={() => handleDirectionPress('down')}>
              <ArrowLeft size={32} color="#007AFF" style={{ transform: [{ rotate: '-90deg' }] }} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  startContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#000000',
  },
  instructions: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  historyContainer: {
    width: '100%',
    marginTop: 32,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 16,
    color: '#666666',
  },
  historyScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  testContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  levelText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666666',
    marginTop: 20,
  },
  letterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontWeight: '700',
    color: '#000000',
  },
  controlsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  horizontalControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: 20,
  },
  directionButton: {
    width: 64,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});