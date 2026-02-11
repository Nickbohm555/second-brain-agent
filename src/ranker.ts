import type {
  CandidateArticle,
  FeedbackEvent,
  RankerWeights,
  UserContext,
} from "./types.js";

export const DEFAULT_WEIGHTS: RankerWeights = {
  topicMatch: 3.2,
  depthFit: 1.7,
  recency: 0.8,
  quality: 1.6,
  hasCode: 1.1,
  hasBenchmarks: 0.9,
};

export interface RankedArticle {
  article: CandidateArticle;
  score: number;
  reasons: string[];
}

export class LightweightRanker {
  private weights: RankerWeights;

  constructor(weights: RankerWeights = DEFAULT_WEIGHTS) {
    this.weights = { ...weights };
  }

  rank(candidates: CandidateArticle[], context: UserContext): RankedArticle[] {
    return candidates
      .map((article) => this.scoreArticle(article, context))
      .sort((a, b) => b.score - a.score);
  }

  applyFeedback(event: FeedbackEvent): void {
    switch (event.signal) {
      case "useful":
      case "saved":
        this.weights.topicMatch += 0.04;
        this.weights.quality += 0.03;
        break;
      case "not_useful":
        this.weights.topicMatch = Math.max(0.5, this.weights.topicMatch - 0.06);
        this.weights.quality = Math.max(0.5, this.weights.quality - 0.04);
        break;
      case "too_basic":
        this.weights.depthFit += 0.05;
        break;
      case "too_advanced":
        this.weights.depthFit = Math.max(0.4, this.weights.depthFit - 0.05);
        break;
    }
  }

  getWeights(): RankerWeights {
    return { ...this.weights };
  }

  private scoreArticle(article: CandidateArticle, context: UserContext): RankedArticle {
    const topicOverlap = this.topicOverlap(article.topics, context.focusTopics);
    const depthFit = 1 - Math.abs(article.depthScore - context.preferredDepth);
    const recencyScore = 1 / (1 + article.recencyHours / 24);

    const score =
      topicOverlap * this.weights.topicMatch +
      depthFit * this.weights.depthFit +
      recencyScore * this.weights.recency +
      article.qualityScore * this.weights.quality +
      (article.hasCode ? this.weights.hasCode : 0) +
      (article.hasBenchmarks ? this.weights.hasBenchmarks : 0);

    const reasons: string[] = [];
    if (topicOverlap > 0.5) reasons.push("High topic overlap");
    if (depthFit > 0.75) reasons.push("Matches your preferred depth");
    if (article.hasCode) reasons.push("Includes implementation code");
    if (article.hasBenchmarks) reasons.push("Contains benchmark evidence");

    return { article, score, reasons };
  }

  private topicOverlap(articleTopics: string[], focusTopics: string[]): number {
    if (focusTopics.length === 0) return 0;
    const focus = new Set(focusTopics.map((t) => t.toLowerCase()));
    const hits = articleTopics.filter((t) => focus.has(t.toLowerCase())).length;
    return hits / focusTopics.length;
  }
}
