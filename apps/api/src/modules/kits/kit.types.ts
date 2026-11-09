export interface Kit {
  id: string;
  name: string;
  description: string;
  category: string; // "Reels", "Vlog", "Portrait", "Podcast"
  dailyPrice: number; // in paise per CLAUDE.md §8
  images: string[];
  cityId: string;
}