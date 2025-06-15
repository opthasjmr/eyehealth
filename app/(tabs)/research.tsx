import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Linking,
  RefreshControl,
  ActivityIndicator,
  Alert,
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
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ResearchArticle {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  publishedDate: string;
  abstract: string;
  url: string;
  imageUrl?: string;
  category: 'clinical' | 'technology' | 'prevention' | 'treatment' | 'genetics';
  tags: string[];
  citationCount: number;
  isBookmarked: boolean;
  readingTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface ResearchCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  articleCount: number;
}

const categories: ResearchCategory[] = [
  {
    id: 'clinical',
    name: 'Clinical Studies',
    description: 'Latest clinical trials and patient studies',
    icon: Microscope,
    color: '#007AFF',
    articleCount: 156,
  },
  {
    id: 'technology',
    name: 'Eye Tech',
    description: 'AI, devices, and digital health innovations',
    icon: Brain,
    color: '#5856D6',
    articleCount: 89,
  },
  {
    id: 'prevention',
    name: 'Prevention',
    description: 'Preventive care and early detection methods',
    icon: Eye,
    color: '#34C759',
    articleCount: 124,
  },
  {
    id: 'treatment',
    name: 'Treatments',
    description: 'New therapies and treatment protocols',
    icon: TrendingUp,
    color: '#FF9500',
    articleCount: 203,
  },
  {
    id: 'genetics',
    name: 'Genetics',
    description: 'Genetic research and hereditary conditions',
    icon: Globe,
    color: '#AF52DE',
    articleCount: 67,
  },
];

// Mock research articles - in production, these would come from APIs like PubMed, arXiv, etc.
const mockArticles: ResearchArticle[] = [
  {
    id: '1',
    title: 'AI-Powered Early Detection of Diabetic Retinopathy Using Smartphone Cameras',
    authors: ['Dr. Sarah Chen', 'Prof. Michael Rodriguez', 'Dr. Lisa Wang'],
    journal: 'Nature Digital Medicine',
    publishedDate: '2024-06-10',
    abstract: 'This study presents a novel deep learning approach for detecting diabetic retinopathy using smartphone cameras. Our AI model achieved 94.2% accuracy in identifying early-stage diabetic retinopathy, potentially revolutionizing screening in underserved communities.',
    url: 'https://www.nature.com/articles/s41746-024-01234-5',
    imageUrl: 'https://images.pexels.com/photos/5752242/pexels-photo-5752242.jpeg',
    category: 'technology',
    tags: ['AI', 'Diabetic Retinopathy', 'Smartphone', 'Screening'],
    citationCount: 23,
    isBookmarked: false,
    readingTime: 8,
    difficulty: 'intermediate',
  },
  {
    id: '2',
    title: 'Blue Light Exposure and Digital Eye Strain: A Comprehensive Meta-Analysis',
    authors: ['Dr. James Thompson', 'Dr. Emily Foster'],
    journal: 'Ophthalmology Research',
    publishedDate: '2024-06-08',
    abstract: 'A systematic review of 47 studies examining the relationship between blue light exposure from digital devices and eye strain symptoms. Results show significant correlation between prolonged exposure and dry eye symptoms.',
    url: 'https://journals.lww.com/ophthalmology/Abstract/2024/06000/Blue_Light_Exposure.12.aspx',
    imageUrl: 'https://images.pexels.com/photos/4064840/pexels-photo-4064840.jpeg',
    category: 'prevention',
    tags: ['Blue Light', 'Digital Eye Strain', 'Meta-Analysis'],
    citationCount: 156,
    isBookmarked: true,
    readingTime: 12,
    difficulty: 'advanced',
  },
  {
    id: '3',
    title: 'Gene Therapy Breakthrough for Leber Congenital Amaurosis',
    authors: ['Dr. Robert Kim', 'Prof. Anna Petrov', 'Dr. David Lee'],
    journal: 'Cell Stem Cell',
    publishedDate: '2024-06-05',
    abstract: 'Phase II clinical trial results show promising outcomes for CRISPR-based gene therapy in treating Leber congenital amaurosis. 78% of patients showed significant vision improvement after 6 months.',
    url: 'https://www.cell.com/cell-stem-cell/fulltext/S1934-5909(24)00123-4',
    imageUrl: 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg',
    category: 'genetics',
    tags: ['Gene Therapy', 'CRISPR', 'Leber Congenital Amaurosis'],
    citationCount: 89,
    isBookmarked: false,
    readingTime: 15,
    difficulty: 'advanced',
  },
  {
    id: '4',
    title: 'Virtual Reality Therapy for Amblyopia in Children: Randomized Controlled Trial',
    authors: ['Dr. Maria Gonzalez', 'Dr. Peter Johnson'],
    journal: 'JAMA Ophthalmology',
    publishedDate: '2024-06-03',
    abstract: 'This RCT demonstrates that VR-based therapy is as effective as traditional patching for treating amblyopia in children aged 4-12, with significantly higher compliance rates (89% vs 67%).',
    url: 'https://jamanetwork.com/journals/jamaophthalmology/fullarticle/2789456',
    imageUrl: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg',
    category: 'treatment',
    tags: ['Virtual Reality', 'Amblyopia', 'Pediatric', 'RCT'],
    citationCount: 45,
    isBookmarked: true,
    readingTime: 10,
    difficulty: 'intermediate',
  },
  {
    id: '5',
    title: 'Machine Learning Predicts Glaucoma Progression from OCT Scans',
    authors: ['Dr. Kevin Zhang', 'Prof. Rachel Adams', 'Dr. Mark Wilson'],
    journal: 'Science Translational Medicine',
    publishedDate: '2024-05-28',
    abstract: 'Novel ML algorithm analyzes OCT scans to predict glaucoma progression with 91% accuracy, enabling personalized treatment plans and improved patient outcomes.',
    url: 'https://www.science.org/doi/10.1126/scitranslmed.abcd1234',
    imageUrl: 'https://images.pexels.com/photos/5752242/pexels-photo-5752242.jpeg',
    category: 'technology',
    tags: ['Machine Learning', 'Glaucoma', 'OCT', 'Prediction'],
    citationCount: 67,
    isBookmarked: false,
    readingTime: 9,
    difficulty: 'advanced',
  },
];

export default function ResearchScreen() {
  const { theme } = useTheme();
  const { user } = useUser();
  const [articles, setArticles] = useState<ResearchArticle[]>(mockArticles);
  const [filteredArticles, setFilteredArticles] = useState<ResearchArticle[]>(mockArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([]);

  useEffect(() => {
    loadBookmarkedArticles();
    fetchLatestResearch();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchQuery, selectedCategory, selectedDifficulty, articles]);

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

  const saveBookmarkedArticles = async (bookmarks: string[]) => {
    try {
      await AsyncStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  };

  const fetchLatestResearch = async () => {
    setIsLoading(true);
    try {
      // In production, this would fetch from real APIs like:
      // - PubMed API
      // - arXiv API
      // - Google Scholar API
      // - CrossRef API
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update articles with bookmarked status
      const updatedArticles = mockArticles.map(article => ({
        ...article,
        isBookmarked: bookmarkedArticles.includes(article.id),
      }));
      
      setArticles(updatedArticles);
    } catch (error) {
      console.error('Error fetching research:', error);
      Alert.alert('Error', 'Failed to fetch latest research articles');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLatestResearch();
    setRefreshing(false);
  };

  const filterArticles = () => {
    let filtered = articles;

    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.authors.some(author => 
          author.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        article.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(article => article.difficulty === selectedDifficulty);
    }

    setFilteredArticles(filtered);
  };

  const toggleBookmark = async (articleId: string) => {
    const updatedBookmarks = bookmarkedArticles.includes(articleId)
      ? bookmarkedArticles.filter(id => id !== articleId)
      : [...bookmarkedArticles, articleId];

    setBookmarkedArticles(updatedBookmarks);
    await saveBookmarkedArticles(updatedBookmarks);

    // Update articles state
    const updatedArticles = articles.map(article => ({
      ...article,
      isBookmarked: updatedBookmarks.includes(article.id),
    }));
    setArticles(updatedArticles);
  };

  const openArticle = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open article');
    }
  };

  const shareArticle = async (article: ResearchArticle) => {
    try {
      // In production, use expo-sharing
      Alert.alert('Share', `Sharing: ${article.title}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to share article');
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
    categoriesSection: {
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
    articlesSection: {
      padding: 16,
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
    articleAuthors: {
      fontSize: 14,
      color: theme.colors.primary,
      marginBottom: 4,
    },
    articleJournal: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    articleAbstract: {
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

  if (isLoading && articles.length === 0) {
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
        <Text style={styles.headerTitle}>Research Hub</Text>
        <Text style={styles.subtitle}>
          Latest eye health research and scientific breakthroughs
        </Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles, authors, topics..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

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

        <TouchableOpacity
          style={[
            styles.filterChip,
            bookmarkedArticles.length > 0 && { borderColor: theme.colors.warning },
          ]}
          onPress={() => {
            const bookmarked = articles.filter(a => bookmarkedArticles.includes(a.id));
            setFilteredArticles(bookmarked);
          }}
        >
          <Text style={styles.filterChipText}>Bookmarked</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Research Categories</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
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

      <View style={styles.articlesSection}>
        <Text style={styles.sectionTitle}>
          Latest Articles ({filteredArticles.length})
        </Text>
        
        {filteredArticles.length === 0 ? (
          <View style={styles.emptyState}>
            <BookOpen size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyStateText}>No articles found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        ) : (
          filteredArticles.map((article) => (
            <View key={article.id} style={styles.articleCard}>
              {article.imageUrl && (
                <Image 
                  source={{ uri: article.imageUrl }} 
                  style={styles.articleImage}
                  resizeMode="cover"
                />
              )}
              
              <View style={styles.articleContent}>
                <View style={styles.articleHeader}>
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <TouchableOpacity
                    style={styles.bookmarkButton}
                    onPress={() => toggleBookmark(article.id)}
                  >
                    <Bookmark
                      size={20}
                      color={article.isBookmarked ? theme.colors.warning : theme.colors.textSecondary}
                      fill={article.isBookmarked ? theme.colors.warning : 'none'}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.articleMeta}>
                  <View style={styles.metaItem}>
                    <Calendar size={12} color={theme.colors.textSecondary} />
                    <Text style={styles.metaText}>
                      {new Date(article.publishedDate).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <View style={styles.metaItem}>
                    <Clock size={12} color={theme.colors.textSecondary} />
                    <Text style={styles.metaText}>{article.readingTime} min read</Text>
                  </View>
                  
                  <View style={styles.metaItem}>
                    <Star size={12} color={theme.colors.textSecondary} />
                    <Text style={styles.metaText}>{article.citationCount} citations</Text>
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

                <Text style={styles.articleAuthors}>
                  {article.authors.join(', ')}
                </Text>
                
                <Text style={styles.articleJournal}>
                  {article.journal}
                </Text>

                <Text style={styles.articleAbstract} numberOfLines={3}>
                  {article.abstract}
                </Text>

                <View style={styles.tagsContainer}>
                  {article.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.articleActions}>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => shareArticle(article)}
                    >
                      <Share size={14} color={theme.colors.text} />
                      <Text style={styles.actionButtonText}>Share</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.actionButton}>
                      <Download size={14} color={theme.colors.text} />
                      <Text style={styles.actionButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.readButton}
                    onPress={() => openArticle(article.url)}
                  >
                    <ExternalLink size={14} color="#FFFFFF" />
                    <Text style={styles.readButtonText}>Read Full</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}