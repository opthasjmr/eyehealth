import { useState, useEffect } from 'react';
import { researchService } from '@/services/ResearchService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ResearchHookState {
  articles: any[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}

export const useResearch = (query?: string) => {
  const [state, setState] = useState<ResearchHookState>({
    articles: [],
    loading: false,
    error: null,
    refreshing: false,
  });

  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    loadBookmarks();
    loadSearchHistory();
    if (query) {
      searchArticles(query);
    } else {
      loadLatestResearch();
    }
  }, [query]);

  const loadBookmarks = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('research_bookmarks');
      if (bookmarks) {
        setBookmarkedArticles(JSON.parse(bookmarks));
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('research_search_history');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const saveBookmarks = async (bookmarks: string[]) => {
    try {
      await AsyncStorage.setItem('research_bookmarks', JSON.stringify(bookmarks));
      setBookmarkedArticles(bookmarks);
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  };

  const saveSearchHistory = async (history: string[]) => {
    try {
      await AsyncStorage.setItem('research_search_history', JSON.stringify(history));
      setSearchHistory(history);
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const searchArticles = async (searchQuery: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Add to search history
      const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10);
      await saveSearchHistory(newHistory);

      // Search multiple sources
      const [pubmedResults, crossrefResults] = await Promise.all([
        researchService.searchPubMed(searchQuery, 10),
        researchService.searchCrossRef(searchQuery, 10),
      ]);

      const allResults = [...pubmedResults, ...crossrefResults];
      const uniqueResults = removeDuplicates(allResults);

      setState(prev => ({
        ...prev,
        articles: uniqueResults,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to search articles',
        loading: false,
      }));
    }
  };

  const loadLatestResearch = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const articles = await researchService.getLatestEyeHealthResearch();
      setState(prev => ({
        ...prev,
        articles,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to load latest research',
        loading: false,
      }));
    }
  };

  const refreshArticles = async () => {
    setState(prev => ({ ...prev, refreshing: true }));
    
    try {
      if (query) {
        await searchArticles(query);
      } else {
        await loadLatestResearch();
      }
    } finally {
      setState(prev => ({ ...prev, refreshing: false }));
    }
  };

  const toggleBookmark = async (articleId: string) => {
    const newBookmarks = bookmarkedArticles.includes(articleId)
      ? bookmarkedArticles.filter(id => id !== articleId)
      : [...bookmarkedArticles, articleId];
    
    await saveBookmarks(newBookmarks);
  };

  const getBookmarkedArticles = () => {
    return state.articles.filter(article => 
      bookmarkedArticles.includes(article.id || article.pmid || article.doi)
    );
  };

  const getTrendingTopics = async () => {
    try {
      return await researchService.getTrendingTopics();
    } catch (error) {
      console.error('Error getting trending topics:', error);
      return [];
    }
  };

  const getPersonalizedRecommendations = async (userProfile: any) => {
    try {
      return await researchService.getPersonalizedRecommendations(userProfile);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  };

  const removeDuplicates = (articles: any[]) => {
    const seen = new Set();
    return articles.filter(article => {
      const identifier = article.doi || article.pmid || article.id || article.title;
      if (seen.has(identifier)) return false;
      seen.add(identifier);
      return true;
    });
  };

  return {
    ...state,
    bookmarkedArticles,
    searchHistory,
    searchArticles,
    refreshArticles,
    toggleBookmark,
    getBookmarkedArticles,
    getTrendingTopics,
    getPersonalizedRecommendations,
  };
};