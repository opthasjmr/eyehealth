import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { ExternalLink } from 'lucide-react-native';

const articles = [
  {
    id: 1,
    title: 'Understanding Digital Eye Strain',
    image: 'https://images.pexels.com/photos/4064840/pexels-photo-4064840.jpeg',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'The Importance of Regular Eye Breaks',
    image: 'https://images.pexels.com/photos/5257759/pexels-photo-5257759.jpeg',
    readTime: '3 min read',
  },
  {
    id: 3,
    title: 'Protecting Your Eyes in the Digital Age',
    image: 'https://images.pexels.com/photos/4064841/pexels-photo-4064841.jpeg',
    readTime: '4 min read',
  },
];

export default function EducationScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Latest Articles</Text>
      {articles.map((article) => (
        <TouchableOpacity key={article.id} style={styles.articleCard}>
          <Image source={{ uri: article.image }} style={styles.articleImage} />
          <View style={styles.articleContent}>
            <Text style={styles.articleTitle}>{article.title}</Text>
            <View style={styles.articleMeta}>
              <Text style={styles.readTime}>{article.readTime}</Text>
              <ExternalLink size={16} color="#007AFF" />
            </View>
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
  articleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  articleImage: {
    width: '100%',
    height: 200,
  },
  articleContent: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readTime: {
    fontSize: 14,
    color: '#666666',
  },
});