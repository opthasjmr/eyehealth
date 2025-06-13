import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  runOnJS,
  interpolateColor,
} from 'react-native-reanimated';
import { 
  Gamepad2, 
  Eye, 
  Target, 
  Zap, 
  Star, 
  Trophy,
  Play,
  Pause,
  RotateCcw,
  Award,
  TrendingUp
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface GameStats {
  gamesPlayed: number;
  totalScore: number;
  bestScore: number;
  streakDays: number;
  achievements: string[];
}

interface BlinkGameState {
  isActive: boolean;
  blinkCount: number;
  targetBlinks: number;
  timeLeft: number;
  score: number;
}

interface FocusGameState {
  isActive: boolean;
  currentTarget: number;
  score: number;
  timeLeft: number;
  targets: { id: number; x: number; y: number; color: string; size: number }[];
}

interface ColorGameState {
  isActive: boolean;
  currentColor: string;
  options: string[];
  score: number;
  timeLeft: number;
  correctAnswer: string;
}

export default function GamesScreen() {
  const { theme } = useTheme();
  const { user, updateStats } = useUser();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    gamesPlayed: 0,
    totalScore: 0,
    bestScore: 0,
    streakDays: 0,
    achievements: [],
  });

  // Blink Game State
  const [blinkGame, setBlinkGame] = useState<BlinkGameState>({
    isActive: false,
    blinkCount: 0,
    targetBlinks: 20,
    timeLeft: 30,
    score: 0,
  });

  // Focus Game State
  const [focusGame, setFocusGame] = useState<FocusGameState>({
    isActive: false,
    currentTarget: 0,
    score: 0,
    timeLeft: 60,
    targets: [],
  });

  // Color Game State
  const [colorGame, setColorGame] = useState<ColorGameState>({
    isActive: false,
    currentColor: '',
    options: [],
    score: 0,
    timeLeft: 45,
    correctAnswer: '',
  });

  // Animations
  const blinkAnimation = useSharedValue(1);
  const targetAnimation = useSharedValue(0);
  const scoreAnimation = useSharedValue(0);

  useEffect(() => {
    loadGameStats();
  }, []);

  const loadGameStats = async () => {
    try {
      const stats = await AsyncStorage.getItem('gameStats');
      if (stats) {
        setGameStats(JSON.parse(stats));
      }
    } catch (error) {
      console.error('Error loading game stats:', error);
    }
  };

  const saveGameStats = async (newStats: GameStats) => {
    try {
      await AsyncStorage.setItem('gameStats', JSON.stringify(newStats));
      setGameStats(newStats);
    } catch (error) {
      console.error('Error saving game stats:', error);
    }
  };

  const updateGameStats = async (score: number) => {
    const newStats = {
      ...gameStats,
      gamesPlayed: gameStats.gamesPlayed + 1,
      totalScore: gameStats.totalScore + score,
      bestScore: Math.max(gameStats.bestScore, score),
    };

    // Check for achievements
    const newAchievements = [...gameStats.achievements];
    if (gameStats.gamesPlayed === 0) newAchievements.push('First Game');
    if (score > 100 && !newAchievements.includes('High Scorer')) newAchievements.push('High Scorer');
    if (newStats.gamesPlayed >= 10 && !newAchievements.includes('Dedicated Player')) newAchievements.push('Dedicated Player');

    newStats.achievements = newAchievements;
    await saveGameStats(newStats);

    if (user) {
      await updateStats({
        totalExercises: (user.stats.totalExercises || 0) + 1,
      });
    }
  };

  // Blink Game Logic
  const startBlinkGame = () => {
    setBlinkGame({
      isActive: true,
      blinkCount: 0,
      targetBlinks: 20,
      timeLeft: 30,
      score: 0,
    });

    blinkAnimation.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 150 }),
        withTiming(1, { duration: 150 })
      ),
      -1,
      false
    );

    const timer = setInterval(() => {
      setBlinkGame(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          endBlinkGame(prev.blinkCount);
          return { ...prev, isActive: false, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const handleBlink = () => {
    setBlinkGame(prev => {
      const newCount = prev.blinkCount + 1;
      const newScore = Math.max(0, 100 - Math.abs(prev.targetBlinks - newCount) * 5);
      return { ...prev, blinkCount: newCount, score: newScore };
    });
  };

  const endBlinkGame = async (finalCount: number) => {
    blinkAnimation.value = withTiming(1);
    const finalScore = Math.max(0, 100 - Math.abs(20 - finalCount) * 5);
    await updateGameStats(finalScore);
    
    Alert.alert(
      'Blink Game Complete!',
      `You blinked ${finalCount} times!\nTarget: 20 blinks\nScore: ${finalScore}`,
      [{ text: 'Play Again', onPress: () => setSelectedGame(null) }]
    );
  };

  // Focus Game Logic
  const startFocusGame = () => {
    const newTargets = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * (width - 60),
      y: Math.random() * (height - 200) + 100,
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 5)],
      size: 40 + Math.random() * 20,
    }));

    setFocusGame({
      isActive: true,
      currentTarget: 0,
      score: 0,
      timeLeft: 60,
      targets: newTargets,
    });

    targetAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(0.8, { duration: 500 })
      ),
      -1,
      true
    );

    const timer = setInterval(() => {
      setFocusGame(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          endFocusGame(prev.score);
          return { ...prev, isActive: false, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const handleTargetHit = (targetId: number) => {
    setFocusGame(prev => {
      if (targetId === prev.currentTarget) {
        const newScore = prev.score + 10;
        const nextTarget = (prev.currentTarget + 1) % prev.targets.length;
        return { ...prev, score: newScore, currentTarget: nextTarget };
      }
      return prev;
    });
  };

  const endFocusGame = async (finalScore: number) => {
    targetAnimation.value = withTiming(0);
    await updateGameStats(finalScore);
    
    Alert.alert(
      'Focus Game Complete!',
      `Final Score: ${finalScore}`,
      [{ text: 'Play Again', onPress: () => setSelectedGame(null) }]
    );
  };

  // Color Game Logic
  const colors = [
    { name: 'Red', value: '#FF6B6B' },
    { name: 'Blue', value: '#4ECDC4' },
    { name: 'Green', value: '#96CEB4' },
    { name: 'Yellow', value: '#FFEAA7' },
    { name: 'Purple', value: '#A29BFE' },
    { name: 'Orange', value: '#FD79A8' },
  ];

  const startColorGame = () => {
    const correctColor = colors[Math.floor(Math.random() * colors.length)];
    const wrongColors = colors.filter(c => c.name !== correctColor.name);
    const shuffledOptions = [
      correctColor.name,
      ...wrongColors.slice(0, 2).map(c => c.name)
    ].sort(() => Math.random() - 0.5);

    setColorGame({
      isActive: true,
      currentColor: correctColor.value,
      options: shuffledOptions,
      score: 0,
      timeLeft: 45,
      correctAnswer: correctColor.name,
    });

    const timer = setInterval(() => {
      setColorGame(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          endColorGame(prev.score);
          return { ...prev, isActive: false, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const handleColorAnswer = (answer: string) => {
    setColorGame(prev => {
      const isCorrect = answer === prev.correctAnswer;
      const newScore = isCorrect ? prev.score + 10 : prev.score;
      
      // Generate new question
      const correctColor = colors[Math.floor(Math.random() * colors.length)];
      const wrongColors = colors.filter(c => c.name !== correctColor.name);
      const shuffledOptions = [
        correctColor.name,
        ...wrongColors.slice(0, 2).map(c => c.name)
      ].sort(() => Math.random() - 0.5);

      return {
        ...prev,
        score: newScore,
        currentColor: correctColor.value,
        options: shuffledOptions,
        correctAnswer: correctColor.name,
      };
    });
  };

  const endColorGame = async (finalScore: number) => {
    await updateGameStats(finalScore);
    
    Alert.alert(
      'Color Recognition Complete!',
      `Final Score: ${finalScore}`,
      [{ text: 'Play Again', onPress: () => setSelectedGame(null) }]
    );
  };

  const blinkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: blinkAnimation.value,
  }));

  const targetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: targetAnimation.value }],
  }));

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
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    stat: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.primary,
      marginTop: 4,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    gamesGrid: {
      padding: 16,
    },
    gameCard: {
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
    gameHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    gameIcon: {
      marginRight: 12,
    },
    gameTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      flex: 1,
    },
    gameDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    gameBenefits: {
      marginBottom: 16,
    },
    benefitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    benefitText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginLeft: 8,
    },
    playButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    playButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    gameScreen: {
      flex: 1,
      padding: 20,
    },
    gameInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 12,
    },
    gameInfoText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    blinkArea: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      margin: 20,
    },
    blinkButton: {
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    blinkButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
      marginTop: 8,
    },
    focusGameArea: {
      flex: 1,
      position: 'relative',
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      margin: 20,
      overflow: 'hidden',
    },
    target: {
      position: 'absolute',
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    targetText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
    colorGameArea: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    colorDisplay: {
      width: 200,
      height: 200,
      borderRadius: 20,
      marginBottom: 40,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    colorOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 12,
    },
    colorOption: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    colorOptionText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    backButton: {
      backgroundColor: theme.colors.textSecondary,
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      marginTop: 20,
    },
    backButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    achievementsSection: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 12,
    },
    achievementItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      padding: 12,
      borderRadius: 12,
      marginBottom: 8,
    },
    achievementText: {
      fontSize: 14,
      color: theme.colors.text,
      marginLeft: 12,
      fontWeight: '600',
    },
  });

  if (selectedGame === 'blink') {
    return (
      <View style={styles.container}>
        <View style={styles.gameInfo}>
          <Text style={styles.gameInfoText}>Blinks: {blinkGame.blinkCount}/20</Text>
          <Text style={styles.gameInfoText}>Time: {blinkGame.timeLeft}s</Text>
          <Text style={styles.gameInfoText}>Score: {blinkGame.score}</Text>
        </View>

        <View style={styles.blinkArea}>
          <Animated.View style={[styles.blinkButton, blinkAnimatedStyle]}>
            <TouchableOpacity
              style={styles.blinkButton}
              onPress={handleBlink}
              disabled={!blinkGame.isActive}
            >
              <Eye size={48} color="#FFFFFF" />
              <Text style={styles.blinkButtonText}>TAP TO BLINK</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {!blinkGame.isActive && (
          <TouchableOpacity style={styles.playButton} onPress={startBlinkGame}>
            <Play size={20} color="#FFFFFF" />
            <Text style={styles.playButtonText}>Start Blink Game</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedGame(null)}>
          <Text style={styles.backButtonText}>Back to Games</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (selectedGame === 'focus') {
    return (
      <View style={styles.container}>
        <View style={styles.gameInfo}>
          <Text style={styles.gameInfoText}>Target: {focusGame.currentTarget + 1}</Text>
          <Text style={styles.gameInfoText}>Time: {focusGame.timeLeft}s</Text>
          <Text style={styles.gameInfoText}>Score: {focusGame.score}</Text>
        </View>

        <View style={styles.focusGameArea}>
          {focusGame.targets.map((target, index) => (
            <Animated.View
              key={target.id}
              style={[
                styles.target,
                targetAnimatedStyle,
                {
                  left: target.x,
                  top: target.y,
                  width: target.size,
                  height: target.size,
                  backgroundColor: target.color,
                  opacity: index === focusGame.currentTarget ? 1 : 0.3,
                  borderWidth: index === focusGame.currentTarget ? 3 : 0,
                  borderColor: '#FFFFFF',
                },
              ]}
            >
              <TouchableOpacity
                style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                onPress={() => handleTargetHit(target.id)}
                disabled={!focusGame.isActive}
              >
                <Text style={styles.targetText}>{target.id + 1}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {!focusGame.isActive && (
          <TouchableOpacity style={styles.playButton} onPress={startFocusGame}>
            <Play size={20} color="#FFFFFF" />
            <Text style={styles.playButtonText}>Start Focus Game</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedGame(null)}>
          <Text style={styles.backButtonText}>Back to Games</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (selectedGame === 'color') {
    return (
      <View style={styles.container}>
        <View style={styles.gameInfo}>
          <Text style={styles.gameInfoText}>Time: {colorGame.timeLeft}s</Text>
          <Text style={styles.gameInfoText}>Score: {colorGame.score}</Text>
        </View>

        <View style={styles.colorGameArea}>
          <View style={[styles.colorDisplay, { backgroundColor: colorGame.currentColor }]} />
          
          <View style={styles.colorOptions}>
            {colorGame.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.colorOption}
                onPress={() => handleColorAnswer(option)}
                disabled={!colorGame.isActive}
              >
                <Text style={styles.colorOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {!colorGame.isActive && (
          <TouchableOpacity style={styles.playButton} onPress={startColorGame}>
            <Play size={20} color="#FFFFFF" />
            <Text style={styles.playButtonText}>Start Color Game</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedGame(null)}>
          <Text style={styles.backButtonText}>Back to Games</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Eye Health Games</Text>
        <Text style={styles.subtitle}>
          Fun and engaging games to improve your eye health and vision
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Gamepad2 size={20} color={theme.colors.primary} />
            <Text style={styles.statValue}>{gameStats.gamesPlayed}</Text>
            <Text style={styles.statLabel}>Games Played</Text>
          </View>
          <View style={styles.stat}>
            <Trophy size={20} color={theme.colors.warning} />
            <Text style={styles.statValue}>{gameStats.bestScore}</Text>
            <Text style={styles.statLabel}>Best Score</Text>
          </View>
          <View style={styles.stat}>
            <Award size={20} color={theme.colors.success} />
            <Text style={styles.statValue}>{gameStats.achievements.length}</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
        </View>
      </View>

      <View style={styles.gamesGrid}>
        <View style={styles.gameCard}>
          <View style={styles.gameHeader}>
            <Eye size={32} color={theme.colors.primary} style={styles.gameIcon} />
            <Text style={styles.gameTitle}>Blink Training</Text>
          </View>
          <Text style={styles.gameDescription}>
            Practice healthy blinking patterns to reduce eye strain and improve tear distribution.
          </Text>
          <View style={styles.gameBenefits}>
            <View style={styles.benefitItem}>
              <Star size={12} color={theme.colors.success} />
              <Text style={styles.benefitText}>Reduces dry eyes</Text>
            </View>
            <View style={styles.benefitItem}>
              <Star size={12} color={theme.colors.success} />
              <Text style={styles.benefitText}>Improves tear film quality</Text>
            </View>
            <View style={styles.benefitItem}>
              <Star size={12} color={theme.colors.success} />
              <Text style={styles.benefitText}>Prevents eye strain</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.playButton} onPress={() => setSelectedGame('blink')}>
            <Play size={20} color="#FFFFFF" />
            <Text style={styles.playButtonText}>Play Blink Game</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gameCard}>
          <View style={styles.gameHeader}>
            <Target size={32} color={theme.colors.primary} style={styles.gameIcon} />
            <Text style={styles.gameTitle}>Focus Training</Text>
          </View>
          <Text style={styles.gameDescription}>
            Improve your visual tracking and focus abilities by following moving targets in sequence.
          </Text>
          <View style={styles.gameBenefits}>
            <View style={styles.benefitItem}>
              <Star size={12} color={theme.colors.success} />
              <Text style={styles.benefitText}>Enhances eye coordination</Text>
            </View>
            <View style={styles.benefitItem}>
              <Star size={12} color={theme.colors.success} />
              <Text style={styles.benefitText}>Improves visual tracking</Text>
            </View>
            <View style={styles.benefitItem}>
              <Star size={12} color={theme.colors.success} />
              <Text style={styles.benefitText}>Strengthens focus muscles</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.playButton} onPress={() => setSelectedGame('focus')}>
            <Play size={20} color="#FFFFFF" />
            <Text style={styles.playButtonText}>Play Focus Game</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gameCard}>
          <View style={styles.gameHeader}>
            <Zap size={32} color={theme.colors.primary} style={styles.gameIcon} />
            <Text style={styles.gameTitle}>Color Recognition</Text>
          </View>
          <Text style={styles.gameDescription}>
            Test and improve your color perception and visual processing speed.
          </Text>
          <View style={styles.gameBenefits}>
            <View style={styles.benefitItem}>
              <Star size={12} color={theme.colors.success} />
              <Text style={styles.benefitText}>Improves color perception</Text>
            </View>
            <View style={styles.benefitItem}>
              <Star size={12} color={theme.colors.success} />
              <Text style={styles.benefitText}>Enhances visual processing</Text>
            </View>
            <View style={styles.benefitItem}>
              <Star size={12} color={theme.colors.success} />
              <Text style={styles.benefitText}>Boosts reaction time</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.playButton} onPress={() => setSelectedGame('color')}>
            <Play size={20} color="#FFFFFF" />
            <Text style={styles.playButtonText}>Play Color Game</Text>
          </TouchableOpacity>
        </View>
      </View>

      {gameStats.achievements.length > 0 && (
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {gameStats.achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementItem}>
              <Trophy size={20} color={theme.colors.warning} />
              <Text style={styles.achievementText}>{achievement}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}