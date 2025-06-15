export interface PubMedArticle {
  pmid: string;
  title: string;
  authors: string[];
  journal: string;
  publishedDate: string;
  abstract: string;
  doi?: string;
  url: string;
}

export interface ArXivArticle {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publishedDate: string;
  categories: string[];
  url: string;
}

export interface CrossRefArticle {
  doi: string;
  title: string;
  authors: string[];
  journal: string;
  publishedDate: string;
  abstract?: string;
  citationCount: number;
  url: string;
}

class ResearchService {
  private readonly PUBMED_BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
  private readonly ARXIV_BASE_URL = 'http://export.arxiv.org/api/query';
  private readonly CROSSREF_BASE_URL = 'https://api.crossref.org/works';

  // PubMed API integration
  async searchPubMed(query: string, maxResults: number = 20): Promise<PubMedArticle[]> {
    try {
      // Step 1: Search for article IDs
      const searchUrl = `${this.PUBMED_BASE_URL}esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&retmode=json`;
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      
      if (!searchData.esearchresult?.idlist?.length) {
        return [];
      }

      const ids = searchData.esearchresult.idlist.join(',');

      // Step 2: Fetch article details
      const fetchUrl = `${this.PUBMED_BASE_URL}efetch.fcgi?db=pubmed&id=${ids}&retmode=xml`;
      const fetchResponse = await fetch(fetchUrl);
      const xmlText = await fetchResponse.text();

      // Parse XML and extract article data
      return this.parsePubMedXML(xmlText);
    } catch (error) {
      console.error('Error fetching PubMed articles:', error);
      return [];
    }
  }

  // ArXiv API integration
  async searchArXiv(query: string, maxResults: number = 20): Promise<ArXivArticle[]> {
    try {
      const searchUrl = `${this.ARXIV_BASE_URL}?search_query=${encodeURIComponent(query)}&start=0&max_results=${maxResults}`;
      const response = await fetch(searchUrl);
      const xmlText = await response.text();

      return this.parseArXivXML(xmlText);
    } catch (error) {
      console.error('Error fetching ArXiv articles:', error);
      return [];
    }
  }

  // CrossRef API integration
  async searchCrossRef(query: string, maxResults: number = 20): Promise<CrossRefArticle[]> {
    try {
      const searchUrl = `${this.CROSSREF_BASE_URL}?query=${encodeURIComponent(query)}&rows=${maxResults}`;
      const response = await fetch(searchUrl);
      const data = await response.json();

      return this.parseCrossRefData(data);
    } catch (error) {
      console.error('Error fetching CrossRef articles:', error);
      return [];
    }
  }

  // Get trending eye health topics
  async getTrendingTopics(): Promise<string[]> {
    const topics = [
      'artificial intelligence ophthalmology',
      'digital eye strain',
      'diabetic retinopathy screening',
      'gene therapy retinal diseases',
      'virtual reality vision therapy',
      'machine learning glaucoma',
      'blue light exposure',
      'telemedicine eye care',
      'CRISPR eye diseases',
      'smartphone ophthalmoscopy',
    ];

    return topics;
  }

  // Get latest eye health research
  async getLatestEyeHealthResearch(): Promise<any[]> {
    try {
      const queries = [
        'ophthalmology artificial intelligence 2024',
        'retinal diseases gene therapy',
        'digital eye strain prevention',
        'glaucoma early detection',
        'diabetic retinopathy screening',
      ];

      const allArticles = [];
      
      for (const query of queries) {
        const pubmedArticles = await this.searchPubMed(query, 5);
        const crossrefArticles = await this.searchCrossRef(query, 5);
        
        allArticles.push(...pubmedArticles, ...crossrefArticles);
      }

      // Remove duplicates and sort by date
      const uniqueArticles = this.removeDuplicates(allArticles);
      return this.sortByDate(uniqueArticles);
    } catch (error) {
      console.error('Error fetching latest research:', error);
      return [];
    }
  }

  // Helper methods for parsing XML/JSON responses
  private parsePubMedXML(xmlText: string): PubMedArticle[] {
    // In a real implementation, you would use a proper XML parser
    // This is a simplified version for demonstration
    const articles: PubMedArticle[] = [];
    
    // Parse XML and extract article information
    // This would require a proper XML parsing library like react-native-xml2js
    
    return articles;
  }

  private parseArXivXML(xmlText: string): ArXivArticle[] {
    // Parse ArXiv XML response
    const articles: ArXivArticle[] = [];
    
    // Implementation would parse the XML and extract article data
    
    return articles;
  }

  private parseCrossRefData(data: any): CrossRefArticle[] {
    if (!data.message?.items) return [];

    return data.message.items.map((item: any) => ({
      doi: item.DOI,
      title: item.title?.[0] || 'No title',
      authors: item.author?.map((author: any) => 
        `${author.given || ''} ${author.family || ''}`.trim()
      ) || [],
      journal: item['container-title']?.[0] || 'Unknown journal',
      publishedDate: this.formatCrossRefDate(item.published),
      citationCount: item['is-referenced-by-count'] || 0,
      url: item.URL || `https://doi.org/${item.DOI}`,
    }));
  }

  private formatCrossRefDate(dateObj: any): string {
    if (!dateObj?.['date-parts']?.[0]) return '';
    
    const [year, month = 1, day = 1] = dateObj['date-parts'][0];
    return new Date(year, month - 1, day).toISOString();
  }

  private removeDuplicates(articles: any[]): any[] {
    const seen = new Set();
    return articles.filter(article => {
      const identifier = article.doi || article.pmid || article.id || article.title;
      if (seen.has(identifier)) return false;
      seen.add(identifier);
      return true;
    });
  }

  private sortByDate(articles: any[]): any[] {
    return articles.sort((a, b) => 
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );
  }

  // Get research recommendations based on user profile
  async getPersonalizedRecommendations(userProfile: any): Promise<any[]> {
    const { eyeConditions, preferences } = userProfile;
    
    const queries = [];
    
    // Add condition-specific queries
    if (eyeConditions.includes('myopia')) {
      queries.push('myopia progression control', 'orthokeratology myopia');
    }
    if (eyeConditions.includes('dry eye')) {
      queries.push('dry eye syndrome treatment', 'artificial tears efficacy');
    }
    if (eyeConditions.includes('glaucoma')) {
      queries.push('glaucoma neuroprotection', 'intraocular pressure management');
    }

    // Add general interest queries based on difficulty preference
    if (preferences.researchDifficulty === 'beginner') {
      queries.push('eye health prevention', 'digital eye strain tips');
    } else if (preferences.researchDifficulty === 'advanced') {
      queries.push('retinal gene therapy', 'artificial intelligence ophthalmology');
    }

    const recommendations = [];
    for (const query of queries) {
      const articles = await this.searchPubMed(query, 3);
      recommendations.push(...articles);
    }

    return this.removeDuplicates(recommendations);
  }
}

export const researchService = new ResearchService();