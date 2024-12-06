export interface SearchResult {
  id: string;
  title: string;
  relevance: number;
}

export interface SearchOptions {
  query: string;
  tag?: string;
  userId: string;
} 