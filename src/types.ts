export type SourceId = "x" | "brave" | "rss" | "manual";

export interface CandidateArticle {
  id: string;
  source: SourceId;
  topics: string[];
  hasCode: boolean;
  hasBenchmarks: boolean;
  depthScore: number; // 0..1
  recencyHours: number;
  qualityScore: number; // 0..1
  title?: string;
  url?: string;
  summary?: string;
  author?: string;
  publishedAt?: string;
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

export interface RankedArticle {
  article: CandidateArticle;
  score: number;
  reasons: string[];
}

export type DigestBucket = "read_now" | "save" | "background" | "ignore";

export interface BucketedDigest {
  read_now: RankedArticle[];
  save: RankedArticle[];
  background: RankedArticle[];
  ignore: RankedArticle[];
}

export interface PipelineState {
  weights: RankerWeights;
  feedback: FeedbackEvent[];
  lastDigest?: BucketedDigest;
}
