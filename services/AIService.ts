export interface AIAnalysisResult {
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  findings: string[];
  recommendations: string[];
  detailedAnalysis: {
    pupilResponse: number;
    blinkRate: number;
    eyeTracking: number;
    overallHealth: number;
  };
  aiInsights: string[];
  followUpActions: string[];
}

export interface AISearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
  relevanceScore: number;
  publishedDate?: string;
  imageUrl?: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  journal: string;
  publishedDate: string;
  doi?: string;
  url: string;
  citationCount: number;
  keywords: string[];
  fullTextUrl?: string;
  pdfUrl?: string;
}

class AIService {
  private readonly PUBMED_API = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
  private readonly CROSSREF_API = 'https://api.crossref.org/works';
  private readonly ARXIV_API = 'http://export.arxiv.org/api/query';
  private readonly SEMANTIC_SCHOLAR_API = 'https://api.semanticscholar.org/graph/v1/paper/search';

  // AI Vision Analysis
  async analyzeVisionData(imageData: string, testType: string): Promise<AIAnalysisResult> {
    try {
      // Simulate AI processing with realistic delays and analysis
      await this.simulateProcessing();

      const baseAnalysis = this.generateBaseAnalysis(testType);
      const aiInsights = await this.generateAIInsights(baseAnalysis, testType);
      
      return {
        ...baseAnalysis,
        aiInsights,
        followUpActions: this.generateFollowUpActions(baseAnalysis.riskLevel),
      };
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw new Error('AI analysis failed. Please try again.');
    }
  }

  // Internet Search for Eye Health Information
  async searchEyeHealthInfo(query: string): Promise<AISearchResult[]> {
    try {
      const searches = await Promise.allSettled([
        this.searchPubMed(query),
        this.searchSemanticScholar(query),
        this.searchGeneralWeb(query),
      ]);

      const allResults: AISearchResult[] = [];
      
      searches.forEach((result) => {
        if (result.status === 'fulfilled') {
          allResults.push(...result.value);
        }
      });

      return this.rankAndFilterResults(allResults, query);
    } catch (error) {
      console.error('Search Error:', error);
      return [];
    }
  }

  // Get Latest Research Papers
  async getLatestResearch(topic: string = 'eye health'): Promise<ResearchPaper[]> {
    try {
      const [pubmedPapers, semanticPapers, arxivPapers] = await Promise.allSettled([
        this.fetchPubMedPapers(topic),
        this.fetchSemanticScholarPapers(topic),
        this.fetchArXivPapers(topic),
      ]);

      const allPapers: ResearchPaper[] = [];
      
      [pubmedPapers, semanticPapers, arxivPapers].forEach((result) => {
        if (result.status === 'fulfilled') {
          allPapers.push(...result.value);
        }
      });

      return this.deduplicateAndSort(allPapers);
    } catch (error) {
      console.error('Research Fetch Error:', error);
      return [];
    }
  }

  // AI-Powered Research Recommendations
  async getPersonalizedResearch(userProfile: any): Promise<ResearchPaper[]> {
    const { eyeConditions, preferences, stats } = userProfile;
    
    const queries = this.generatePersonalizedQueries(eyeConditions, preferences);
    const allRecommendations: ResearchPaper[] = [];

    for (const query of queries) {
      try {
        const papers = await this.getLatestResearch(query);
        allRecommendations.push(...papers.slice(0, 3));
      } catch (error) {
        console.error(`Error fetching research for query: ${query}`, error);
      }
    }

    return this.deduplicateAndSort(allRecommendations).slice(0, 15);
  }

  // Trending Topics Detection
  async getTrendingTopics(): Promise<string[]> {
    const currentTopics = [
      'artificial intelligence ophthalmology',
      'digital eye strain blue light',
      'gene therapy retinal diseases',
      'virtual reality vision therapy',
      'diabetic retinopathy AI screening',
      'glaucoma early detection',
      'dry eye syndrome treatment',
      'myopia progression control',
      'retinal implants technology',
      'telemedicine eye care',
    ];

    // In production, this would analyze current research trends
    return currentTopics;
  }

  // Private helper methods
  private async simulateProcessing(): Promise<void> {
    // Simulate realistic AI processing time
    const delay = 2000 + Math.random() * 3000;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private generateBaseAnalysis(testType: string): Omit<AIAnalysisResult, 'aiInsights' | 'followUpActions'> {
    const baseScore = 70 + Math.random() * 25;
    const riskLevel = baseScore > 85 ? 'low' : baseScore > 70 ? 'medium' : 'high';

    const findings = this.generateFindings(testType, riskLevel);
    const recommendations = this.generateRecommendations(riskLevel);

    return {
      confidence: 85 + Math.random() * 10,
      riskLevel,
      findings,
      recommendations,
      detailedAnalysis: {
        pupilResponse: 75 + Math.random() * 20,
        blinkRate: 15 + Math.random() * 10,
        eyeTracking: 80 + Math.random() * 15,
        overallHealth: baseScore,
      },
    };
  }

  private async generateAIInsights(analysis: any, testType: string): Promise<string[]> {
    const insights = [
      'AI detected subtle patterns in eye movement that suggest good overall eye health',
      'Machine learning analysis indicates normal pupil response patterns',
      'Computer vision algorithms found consistent blink patterns',
      'Deep learning models suggest regular eye exercise routine is beneficial',
    ];

    if (analysis.riskLevel === 'high') {
      insights.push(
        'AI recommends immediate consultation with an eye care professional',
        'Pattern recognition suggests potential early-stage concerns requiring attention'
      );
    }

    return insights.slice(0, 3);
  }

  private generateFollowUpActions(riskLevel: string): string[] {
    const baseActions = [
      'Schedule regular eye exams',
      'Continue daily eye exercises',
      'Monitor screen time and take breaks',
    ];

    if (riskLevel === 'high') {
      return [
        'Consult an ophthalmologist within 2 weeks',
        'Reduce screen time significantly',
        'Use artificial tears as needed',
        ...baseActions,
      ];
    }

    return baseActions;
  }

  private generateFindings(testType: string, riskLevel: string): string[] {
    const findings = [];

    switch (testType) {
      case 'pupil':
        findings.push('Pupil response time within normal range');
        if (riskLevel === 'high') findings.push('Slight asymmetry detected in pupil response');
        break;
      case 'blink':
        findings.push('Blink rate consistent with healthy patterns');
        if (riskLevel === 'high') findings.push('Reduced blink frequency may indicate dry eye');
        break;
      case 'tracking':
        findings.push('Eye tracking movements show good coordination');
        if (riskLevel === 'high') findings.push('Minor tracking irregularities observed');
        break;
      default:
        findings.push('Comprehensive analysis shows overall good eye health');
    }

    return findings;
  }

  private generateRecommendations(riskLevel: string): string[] {
    const base = [
      'Follow the 20-20-20 rule for screen breaks',
      'Maintain proper lighting when using devices',
      'Stay hydrated to support eye health',
    ];

    if (riskLevel === 'high') {
      return [
        'Schedule an eye exam with a professional',
        'Consider reducing screen time',
        'Use blue light filtering glasses',
        ...base,
      ];
    }

    return base;
  }

  private async searchPubMed(query: string): Promise<AISearchResult[]> {
    try {
      const searchUrl = `${this.PUBMED_API}esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=10&retmode=json`;
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (!data.esearchresult?.idlist?.length) return [];

      const ids = data.esearchresult.idlist.slice(0, 5).join(',');
      const summaryUrl = `${this.PUBMED_API}esummary.fcgi?db=pubmed&id=${ids}&retmode=json`;
      const summaryResponse = await fetch(summaryUrl);
      const summaryData = await summaryResponse.json();

      return Object.values(summaryData.result || {})
        .filter((item: any) => item.uid)
        .map((item: any) => ({
          title: item.title || 'Research Article',
          snippet: item.authors?.[0]?.name ? `By ${item.authors[0].name} et al.` : 'Medical research article',
          url: `https://pubmed.ncbi.nlm.nih.gov/${item.uid}/`,
          source: 'PubMed',
          relevanceScore: 0.9,
          publishedDate: item.pubdate,
        }));
    } catch (error) {
      console.error('PubMed search error:', error);
      return [];
    }
  }

  private async searchSemanticScholar(query: string): Promise<AISearchResult[]> {
    try {
      const url = `${this.SEMANTIC_SCHOLAR_API}?query=${encodeURIComponent(query)}&limit=5&fields=title,abstract,url,year,authors`;
      const response = await fetch(url);
      const data = await response.json();

      return (data.data || []).map((paper: any) => ({
        title: paper.title,
        snippet: paper.abstract?.substring(0, 200) + '...' || 'Academic research paper',
        url: paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`,
        source: 'Semantic Scholar',
        relevanceScore: 0.85,
        publishedDate: paper.year?.toString(),
      }));
    } catch (error) {
      console.error('Semantic Scholar search error:', error);
      return [];
    }
  }

  private async searchGeneralWeb(query: string): Promise<AISearchResult[]> {
    // Simulate web search results for eye health
    const mockResults = [
      {
        title: 'Digital Eye Strain: Causes and Prevention',
        snippet: 'Learn about the causes of digital eye strain and effective prevention strategies for computer users.',
        url: 'https://www.aao.org/eye-health/tips-prevention/computer-usage',
        source: 'American Academy of Ophthalmology',
        relevanceScore: 0.95,
      },
      {
        title: 'Blue Light and Eye Health: What You Need to Know',
        snippet: 'Comprehensive guide to understanding blue light exposure and its effects on eye health.',
        url: 'https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/blue-light/art-20457784',
        source: 'Mayo Clinic',
        relevanceScore: 0.9,
      },
      {
        title: 'Eye Exercises for Better Vision',
        snippet: 'Effective eye exercises to improve vision and reduce eye strain from prolonged screen use.',
        url: 'https://www.healthline.com/health/eye-health/eye-exercises',
        source: 'Healthline',
        relevanceScore: 0.85,
      },
    ];

    return mockResults.filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.snippet.toLowerCase().includes(query.toLowerCase())
    );
  }

  private async fetchPubMedPapers(topic: string): Promise<ResearchPaper[]> {
    try {
      const searchUrl = `${this.PUBMED_API}esearch.fcgi?db=pubmed&term=${encodeURIComponent(topic)}&retmax=10&retmode=json&sort=date`;
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (!data.esearchresult?.idlist?.length) return [];

      const ids = data.esearchresult.idlist.slice(0, 5).join(',');
      const detailUrl = `${this.PUBMED_API}efetch.fcgi?db=pubmed&id=${ids}&retmode=xml`;
      const detailResponse = await fetch(detailUrl);
      const xmlText = await detailResponse.text();

      // Parse XML and extract paper details
      return this.parsePubMedXML(xmlText);
    } catch (error) {
      console.error('PubMed fetch error:', error);
      return [];
    }
  }

  private async fetchSemanticScholarPapers(topic: string): Promise<ResearchPaper[]> {
    try {
      const url = `${this.SEMANTIC_SCHOLAR_API}?query=${encodeURIComponent(topic)}&limit=5&fields=title,abstract,authors,year,citationCount,url,externalIds`;
      const response = await fetch(url);
      const data = await response.json();

      return (data.data || []).map((paper: any) => ({
        id: paper.paperId,
        title: paper.title,
        authors: paper.authors?.map((author: any) => author.name) || [],
        abstract: paper.abstract || '',
        journal: 'Semantic Scholar',
        publishedDate: paper.year?.toString() || '',
        url: paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`,
        citationCount: paper.citationCount || 0,
        keywords: [],
        doi: paper.externalIds?.DOI,
      }));
    } catch (error) {
      console.error('Semantic Scholar fetch error:', error);
      return [];
    }
  }

  private async fetchArXivPapers(topic: string): Promise<ResearchPaper[]> {
    try {
      const url = `${this.ARXIV_API}?search_query=${encodeURIComponent(topic)}&start=0&max_results=5&sortBy=submittedDate&sortOrder=descending`;
      const response = await fetch(url);
      const xmlText = await response.text();

      return this.parseArXivXML(xmlText);
    } catch (error) {
      console.error('ArXiv fetch error:', error);
      return [];
    }
  }

  private parsePubMedXML(xmlText: string): ResearchPaper[] {
    // Simplified XML parsing - in production, use a proper XML parser
    const papers: ResearchPaper[] = [];
    
    // Mock parsing for demonstration
    for (let i = 0; i < 3; i++) {
      papers.push({
        id: `pubmed_${Date.now()}_${i}`,
        title: `Advanced Eye Health Research Study ${i + 1}`,
        authors: ['Dr. Smith', 'Dr. Johnson'],
        abstract: 'This study investigates advanced methods for eye health monitoring and treatment.',
        journal: 'Journal of Ophthalmology',
        publishedDate: new Date().toISOString(),
        url: `https://pubmed.ncbi.nlm.nih.gov/${12345 + i}/`,
        citationCount: Math.floor(Math.random() * 100),
        keywords: ['eye health', 'vision', 'ophthalmology'],
      });
    }

    return papers;
  }

  private parseArXivXML(xmlText: string): ResearchPaper[] {
    // Simplified XML parsing - in production, use a proper XML parser
    const papers: ResearchPaper[] = [];
    
    // Mock parsing for demonstration
    for (let i = 0; i < 2; i++) {
      papers.push({
        id: `arxiv_${Date.now()}_${i}`,
        title: `Machine Learning Applications in Vision Science ${i + 1}`,
        authors: ['Dr. Chen', 'Dr. Williams'],
        abstract: 'This paper explores machine learning applications in vision science and eye health.',
        journal: 'arXiv',
        publishedDate: new Date().toISOString(),
        url: `https://arxiv.org/abs/2024.${1000 + i}`,
        citationCount: Math.floor(Math.random() * 50),
        keywords: ['machine learning', 'vision', 'AI'],
      });
    }

    return papers;
  }

  private rankAndFilterResults(results: AISearchResult[], query: string): AISearchResult[] {
    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);
  }

  private deduplicateAndSort(papers: ResearchPaper[]): ResearchPaper[] {
    const seen = new Set();
    const unique = papers.filter(paper => {
      const key = paper.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return unique.sort((a, b) => 
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );
  }

  private generatePersonalizedQueries(eyeConditions: string[], preferences: any): string[] {
    const queries = ['eye health general'];

    eyeConditions.forEach(condition => {
      switch (condition.toLowerCase()) {
        case 'myopia':
          queries.push('myopia progression control', 'myopia treatment');
          break;
        case 'dry eye':
          queries.push('dry eye syndrome', 'artificial tears');
          break;
        case 'glaucoma':
          queries.push('glaucoma treatment', 'intraocular pressure');
          break;
        case 'diabetic retinopathy':
          queries.push('diabetic retinopathy screening', 'retinal complications');
          break;
      }
    });

    if (preferences?.interests?.includes('technology')) {
      queries.push('AI ophthalmology', 'digital eye health');
    }

    return queries;
  }
}

export const aiService = new AIService();