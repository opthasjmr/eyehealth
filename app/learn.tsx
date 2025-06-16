import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import {
  Search,
  BookOpen,
  ExternalLink,
  Calendar,
  User,
  TrendingUp,
  Filter,
  Bookmark,
  Share,
  Download,
  Eye,
  Brain,
  Microscope,
  Globe,
  Star,
  Clock,
  Tag,
  Lightbulb,
  Zap,
  Target,
  ArrowRight,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { aiService, AISearchResult, ResearchPaper } from '@/services/AIService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EducationalArticle {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  readTime: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

interface ResearchCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  articleCount: number;
}

const educationalArticles: EducationalArticle[] = [
  {
    id: '1',
    title: 'Understanding Digital Eye Strain in the Modern Age',
    excerpt: 'Learn about the causes, symptoms, and prevention strategies for digital eye strain affecting millions of screen users worldwide.',
    imageUrl: 'https://images.pexels.com/photos/4064840/pexels-photo-4064840.jpeg?auto=compress&cs=tinysrgb&w=800',
    readTime: 5,
    category: 'Prevention',
    difficulty: 'beginner',
    tags: ['Digital Eye Strain', 'Screen Time', 'Prevention'],
  },
  {
    id: '2',
    title: 'The Science Behind Blue Light and Eye Health',
    excerpt: 'Explore the latest research on blue light exposure, its effects on circadian rhythms, and evidence-based protection methods.',
    imageUrl: 'https://images.pexels.com/photos/5257759/pexels-photo-5257759.jpeg?auto=compress&cs=tinysrgb&w=800',
    readTime: 8,
    category: 'Research',
    difficulty: 'intermediate',
    tags: ['Blue Light', 'Circadian Rhythm', 'Research'],
  },
  {
    id: '3',
    title: 'AI Revolution in Ophthalmology: Current Applications',
    excerpt: 'Discover how artificial intelligence is transforming eye care, from automated screening to personalized treatment plans.',
    imageUrl: 'https://images.pexels.com/photos/5752242/pexels-photo-5752242.jpeg?auto=compress&cs=tinysrgb&w=800',
    readTime: 12,
    category: 'Technology',
    difficulty: 'advanced',
    tags: ['AI', 'Ophthalmology', 'Technology'],
  },
  {
    id: '4',
    title: 'Eye Exercises: Evidence-Based Approaches',
    excerpt: 'Scientific review of eye exercises, their effectiveness, and proper techniques for maintaining optimal vision health.',
    imageUrl: 'https://images.pexels.com/photos/4064841/pexels-photo-4064841.jpeg?auto=compress&cs=tinysrgb&w=800',
    readTime: 6,
    category: 'Exercise',
    difficulty: 'beginner',
    tags: ['Eye Exercises', 'Vision Health', 'Wellness'],
  },
];

const researchCategories: ResearchCategory[] = [
  {
    id: 'ai-technology',
    name: 'AI & Technology',
    description: 'Latest developments in AI-powered eye care and digital health',
    icon: Brain,
    color: '#5856D6',
    articleCount: 156,
  },
  {
    id: 'clinical-research',
    name: 'Clinical Research',
    description: 'Peer-reviewed studies and clinical trial results',
    icon: Microscope,
    color: '#007AFF',
    articleCount: 234,
  },
  {
    id: 'prevention',
    name: 'Prevention & Wellness',
    description: 'Preventive care strategies and lifestyle interventions',
    icon: Eye,
    color: '#34C759',
    articleCount: 189,
  },
  {
    id: 'treatment',
    name: 'Treatment Advances',
    description: 'New therapies and treatment innovations',
    icon: Target,
    color: '#FF9500',
    articleCount: 167,
  },
];

export default function LearnScreen() {
  const { theme } = useTheme();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<AISearchResult[]>([]);
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'education' | 'research'>('education');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadBookmarkedArticles();
    loadInitialData();
  }, []);

  const loadBookmarkedArticles = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarkedArticles');
      if (bookmarks) {
        setBookmarkedArticles(JSON.parse(bookmarks));
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [papers, topics] = await Promise.all([
        aiService.getLatestResearch(),
        aiService.getTrendingTopics(),
      ]);
      
      setResearchPapers(papers);
      setTrendingTopics(topics);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await aiService.searchEyeHealthInfo(searchQuery);
      setSearchResults(results);
    } catch (error) {
      Alert.alert('Search Error', 'Failed to search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const toggleBookmark = async (articleId: string) => {
    const newBookmarks = bookmarkedArticles.includes(articleId)
      ? bookmarkedArticles.filter(id => id !== articleId)
      : [...bookmarkedArticles, articleId];
    
    setBookmarkedArticles(newBookmarks);
    await AsyncStorage.setItem('bookmarkedArticles', JSON.stringify(newBookmarks));
  };

  const openExternalLink = (url: string) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Alert.alert('External Link', `Would open: ${url}`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return theme.colors.success;
      case 'intermediate': return theme.colors.warning;
      case 'advanced': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const getFilteredArticles = () => {
    let filtered = educationalArticles;

    if (selectedCategory) {
      filtered = filtered.filter(article => 
        article.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(article => article.difficulty === selectedDifficulty);
    }

    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

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
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      marginLeft: 12,
    },
    searchButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      padding: 8,
      marginLeft: 8,
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 4,
      marginBottom: 16,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    activeTab: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    activeTabText: {
      color: '#FFFFFF',
    },
    filtersContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 8,
    },
    filterChip: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    filterChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterChipText: {
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: '500',
    },
    filterChipTextActive: {
      color: '#FFFFFF',
    },
    section: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 16,
    },
    categoriesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 24,
    },
    categoryCard: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryIcon: {
      marginRight: 8,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    categoryDescription: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    categoryCount: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    articleCard: {
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
    articleImage: {
      width: '100%',
      height: 200,
    },
    articleContent: {
      padding: 16,
    },
    articleHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    articleTitle: {
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
    articleMeta: {
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
    articleExcerpt: {
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
    articleActions: {
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
    searchResults: {
      marginTop: 16,
    },
    searchResultItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    searchResultTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    searchResultSnippet: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      lineHeight: 20,
    },
    searchResultMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    searchResultSource: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    trendingSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
    },
    trendingTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    trendingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    trendingItemLast: {
      borderBottomWidth: 0,
    },
    trendingText: {
      fontSize: 14,
      color: theme.colors.text,
      marginLeft: 12,
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    loadingText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: 16,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyStateText: {
      fontSize: 18,
      color: theme.colors.text,
      marginTop: 16,
      textAlign: 'center',
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 8,
      textAlign: 'center',
    },
  });

  if (isLoading && researchPapers.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading latest research...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learn & Research</Text>
        <Text style={styles.subtitle}>
          Educational content and latest research with AI-powered search
        </Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles, research, topics..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            {isSearching ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Globe size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'education' && styles.activeTab]}
            onPress={() => setActiveTab('education')}
          >
            <Text style={[styles.tabText, activeTab === 'education' && styles.activeTabText]}>
              Education
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'research' && styles.activeTab]}
            onPress={() => setActiveTab('research')}
          >
            <Text style={[styles.tabText, activeTab === 'research' && styles.activeTabText]}>
              Research
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {searchResults.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search Results</Text>
          <View style={styles.searchResults}>
            {searchResults.map((result, index) => (
              <TouchableOpacity
                key={index}
                style={styles.searchResultItem}
                onPress={() => openExternalLink(result.url)}
              >
                <Text style={styles.searchResultTitle}>{result.title}</Text>
                <Text style={styles.searchResultSnippet}>{result.snippet}</Text>
                <View style={styles.searchResultMeta}>
                  <Text style={styles.searchResultSource}>{result.source}</Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Bookmark size={16} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <ExternalLink size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {activeTab === 'education' ? (
        <>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filtersContainer}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedDifficulty === 'beginner' && styles.filterChipActive,
              ]}
              onPress={() => setSelectedDifficulty(
                selectedDifficulty === 'beginner' ? null : 'beginner'
              )}
            >
              <Text style={[
                styles.filterChipText,
                selectedDifficulty === 'beginner' && styles.filterChipTextActive,
              ]}>
                Beginner
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedDifficulty === 'intermediate' && styles.filterChipActive,
              ]}
              onPress={() => setSelectedDifficulty(
                selectedDifficulty === 'intermediate' ? null : 'intermediate'
              )}
            >
              <Text style={[
                styles.filterChipText,
                selectedDifficulty === 'intermediate' && styles.filterChipTextActive,
              ]}>
                Intermediate
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedDifficulty === 'advanced' && styles.filterChipActive,
              ]}
              onPress={() => setSelectedDifficulty(
                selectedDifficulty === 'advanced' ? null : 'advanced'
              )}
            >
              <Text style={[
                styles.filterChipText,
                selectedDifficulty === 'advanced' && styles.filterChipTextActive,
              ]}>
                Advanced
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Educational Articles</Text>
            
            {getFilteredArticles().map((article) => (
              <View key={article.id} style={styles.articleCard}>
                <Image 
                  source={{ uri: article.imageUrl }} 
                  style={styles.articleImage}
                  resizeMode="cover"
                />
                
                <View style={styles.articleContent}>
                  <View style={styles.articleHeader}>
                    <Text style={styles.articleTitle}>{article.title}</Text>
                    <TouchableOpacity
                      style={styles.bookmarkButton}
                      onPress={() => toggleBookmark(article.id)}
                    >
                      <Bookmark
                        size={20}
                        color={bookmarkedArticles.includes(article.id) ? theme.colors.warning : theme.colors.textSecondary}
                        fill={bookmarkedArticles.includes(article.id) ? theme.colors.warning : 'none'}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.articleMeta}>
                    <View style={styles.metaItem}>
                      <Clock size={12} color={theme.colors.textSecondary} />
                      <Text style={styles.metaText}>{article.readTime} min read</Text>
                    </View>
                    
                    <View style={styles.metaItem}>
                      <Tag size={12} color={theme.colors.textSecondary} />
                      <Text style={styles.metaText}>{article.category}</Text>
                    </View>
                    
                    <View style={[
                      styles.difficultyBadge,
                      { backgroundColor: getDifficultyColor(article.difficulty) }
                    ]}>
                      <Text style={styles.difficultyText}>
                        {article.difficulty.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.articleExcerpt}>{article.excerpt}</Text>

                  <View style={styles.tagsContainer}>
                    {article.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.articleActions}>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Share size={14} color={theme.colors.text} />
                        <Text style={styles.actionButtonText}>Share</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity style={styles.actionButton}>
                        <Download size={14} color={theme.colors.text} />
                        <Text style={styles.actionButtonText}>Save</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.readButton}>
                      <BookOpen size={14} color="#FFFFFF" />
                      <Text style={styles.readButtonText}>Read Article</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </>
      ) : (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Research Categories</Text>
            <View style={styles.categoriesGrid}>
              {researchCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    selectedCategory === category.id && {
                      borderWidth: 2,
                      borderColor: category.color,
                    },
                  ]}
                  onPress={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                >
                  <View style={styles.categoryHeader}>
                    <category.icon 
                      size={20} 
                      color={category.color} 
                      style={styles.categoryIcon}
                    />
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                  <Text style={styles.categoryDescription}>
                    {category.description}
                  </Text>
                  <Text style={styles.categoryCount}>
                    {category.articleCount} articles
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.trendingSection}>
              <View style={styles.trendingTitle}>
                <TrendingUp size={20} color={theme.colors.primary} />
                <Text style={[styles.sectionTitle, { marginBottom: 0, marginLeft: 8 }]}>
                  Trending Research Topics
                </Text>
              </View>
              {trendingTopics.slice(0, 5).map((topic, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.trendingItem,
                    index === trendingTopics.slice(0, 5).length - 1 && styles.trendingItemLast,
                  ]}
                  onPress={() => {
                    setSearchQuery(topic);
                    handleSearch();
                  }}
                >
                  <Lightbulb size={16} color={theme.colors.accent} />
                  <Text style={styles.trendingText}>{topic}</Text>
                  <ArrowRight size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Latest Research Papers ({researchPapers.length})
            </Text>
            
            {researchPapers.length === 0 ? (
              <View style={styles.emptyState}>
                <Microscope size={48} color={theme.colors.textSecondary} />
                <Text style={styles.emptyStateText}>No research papers found</Text>
                <Text style={styles.emptyStateSubtext}>
                  Try adjusting your search or check back later
                </Text>
              </View>
            ) : (
              researchPapers.map((paper) => (
                <TouchableOpacity
                  key={paper.id}
                  style={styles.searchResultItem}
                  onPress={() => openExternalLink(paper.url)}
                >
                  <Text style={styles.searchResultTitle}>{paper.title}</Text>
                  <Text style={styles.searchResultSnippet} numberOfLines={3}>
                    {paper.abstract}
                  </Text>
                  <View style={styles.articleMeta}>
                    <View style={styles.metaItem}>
                      <User size={12} color={theme.colors.textSecondary} />
                      <Text style={styles.metaText}>
                        {paper.authors.slice(0, 2).join(', ')}
                        {paper.authors.length > 2 && ' et al.'}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Calendar size={12} color={theme.colors.textSecondary} />
                      <Text style={styles.metaText}>
                        {new Date(paper.publishedDate).getFullYear()}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Star size={12} color={theme.colors.textSecondary} />
                      <Text style={styles.metaText}>{paper.citationCount} citations</Text>
                    </View>
                  </View>
                  <View style={styles.searchResultMeta}>
                    <Text style={styles.searchResultSource}>{paper.journal}</Text>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.actionButton}>
                        <Bookmark size={16} color={theme.colors.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <ExternalLink size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}