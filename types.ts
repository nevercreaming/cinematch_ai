
export enum MediaType {
  MOVIE = 'Movie',
  TV_SHOW = 'TV Show'
}

export interface StreamingPlatform {
  name: string;
  url: string;
}

export interface Person {
  name: string;
  photoUrl: string | null;
}

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  year: string;
  genres: string[];
  summary: string;
  reviewScore: number;
  reviewSnippet: string;
  streamingPlatforms: StreamingPlatform[];
  posterUrl: string;
  posterSource: string; // Source name (e.g. IMDb)
  posterSourceUrl: string; // Direct link to the page where image was found
  cast: Person[];
  director: Person;
  duration: string;
  fullReason: string;
  trailerUrl?: string; // Optional YouTube or trailer link
}

export const AVAILABLE_GENRES = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", 
  "Documentary", "Drama", "Family", "Fantasy", "History", 
  "Horror", "Music", "Musical", "Mystery", "Romance", "Sci-Fi", 
  "Sport", "Thriller", "War", "Western", "Superhero",
  "Cyberpunk", "Dystopian", "Noir", "Post-Apocalyptic", "Heist",
  "Psychological", "Supernatural", "Space", "Satire"
];
