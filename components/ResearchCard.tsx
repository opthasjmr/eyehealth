import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import {
  Calendar,
  User,
  ExternalLink,
  Bookmark,
  Share,
  Download,
  Star,
  Clock,
  Tag,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ResearchCardProps {
  article: {
    id: string;
    title: string;
    authors: string[];
    journal: string;
    publishedDate: string;
    abstract: string;
    url: string;
    imageUrl?: string;
    category?: string;
    tags?: string[];
    citationCount?: number;
    isBookmarked?: boolean;
    readingTime?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
  onBookmark?: (articleId: string) => void;
  onShare?: (article: any) => void;
}

export const ResearchCard: React.FC<ResearchCardProps> = ({
  article,
  onBookmark,
  onShare,
}) => {
  const { theme } = useTheme();

  const openArticle = async () => {
    try {
      const supported = await Linking.canOpenURL(article.url);
      if (supported) {
        await Linking.openURL(article.url);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open article');
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return theme.colors.success;
      case 'intermediate': return theme.colors.warning;
      case 'advanced': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      marginBottom: 16,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: 200,
    },
    content: {
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.text,
      flex: 1,
      marginRight: 8,
      lineHeight: 24,
    },
    bookmarkButton: {
      padding: 4,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      flexWrap: 'wrap',
      gap: 8,
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
    authors: {
      fontSize: 14,
      color: theme.colors.primary,
      marginBottom: 4,
    },
    journal: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    abstract: {
      fontSize: 14,
      color: theme.colors.text,
      lineHeight: 20,
      marginBottom: 12,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 12,
    },
    tag: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    tagText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
    },
    actionButtonText: {
      fontSize: 12,
      color: theme.colors.text,
      marginLeft: 4,
      fontWeight: '500',
    },
    readButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    readButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 4,
    },
  });

  return (
    <View style={styles.card}>
      {article.imageUrl && (
        <Image 
          source={{ uri: article.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{article.title}</Text>
          {onBookmark && (
            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={() => onBookmark(article.id)}
            >
              <Bookmark
                size={20}
                color={article.isBookmarked ? theme.colors.warning : theme.colors.textSecondary}
                fill={article.isBookmarked ? theme.colors.warning : 'none'}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Calendar size={12} color={theme.colors.textSecondary} />
            <Text style={styles.metaText}>
              {formatDate(article.publishedDate)}
            </Text>
          </View>
          
          {article.readingTime && (
            <View style={styles.metaItem}>
              <Clock size={12} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{article.readingTime} min read</Text>
            </View>
          )}
          
          {article.citationCount !== undefined && (
            <View style={styles.metaItem}>
              <Star size={12} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{article.citationCount} citations</Text>
            </View>
          )}
          
          {article.difficulty && (
            <View style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(article.difficulty) }
            ]}>
              <Text style={styles.difficultyText}>
                {article.difficulty.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.authors}>
          {article.authors.join(', ')}
        </Text>
        
        <Text style={styles.journal}>
          {article.journal}
        </Text>

        <Text style={styles.abstract} numberOfLines={3}>
          {article.abstract}
        </Text>

        {article.tags && article.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {article.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <View style={styles.actionButtons}>
            {onShare && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onShare(article)}
              >
                <Share size={14} color={theme.colors.text} />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.actionButton}>
              <Download size={14} color={theme.colors.text} />
              <Text style={styles.actionButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.readButton}
            onPress={openArticle}
          >
            <ExternalLink size={14} color="#FFFFFF" />
            <Text style={styles.readButtonText}>Read Full</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};