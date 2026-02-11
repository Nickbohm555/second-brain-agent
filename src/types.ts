export interface CandidateArticle {
  id: string;
  source: "x" | "brave" | "rss" | "manual";
  topics: string[];
  hasCode: boolean;
  hasBenchmarks: boolean;
  depthScore: number; // 0..1
  recencyHours: number;
  qualityScore: number; // 0..1
}

export interface UserContext {
  focusTopics: string[];
  preferredDepth: number; // 0..1
}

export interface RankerWeights {
  topicMatch: number;
  depthFit: number;
  recency: number;
  quality: number;
  hasCode: number;
  hasBenchmarks: number;
}

export interface FeedbackEvent {
  articleId: string;
  signal: "useful" | "not_useful" | "too_basic" | "too_advanced" | "saved";
}
