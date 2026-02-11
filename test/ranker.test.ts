import { describe, expect, it } from "vitest";
import { LightweightRanker } from "../src/ranker.js";
import type { CandidateArticle, UserContext } from "../src/types.js";

const context: UserContext = {
  focusTopics: ["agentic architecture", "rag", "evals"],
  preferredDepth: 0.7,
};

const candidates: CandidateArticle[] = [
  {
    id: "a",
    source: "brave",
    topics: ["rag", "evals"],
    hasCode: true,
    hasBenchmarks: true,
    depthScore: 0.75,
    recencyHours: 4,
    qualityScore: 0.85,
  },
  {
    id: "b",
    source: "x",
    topics: ["general ai news"],
    hasCode: false,
    hasBenchmarks: false,
    depthScore: 0.2,
    recencyHours: 2,
    qualityScore: 0.55,
  },
];

describe("LightweightRanker", () => {
  it("ranks high-fit technical content above low-fit content", () => {
    const ranker = new LightweightRanker();
    const ranked = ranker.rank(candidates, context);
    expect(ranked[0]?.article.id).toBe("a");
    expect(ranked[0]?.reasons.length).toBeGreaterThan(0);
  });

  it("adjusts weights after positive feedback", () => {
    const ranker = new LightweightRanker();
    const before = ranker.getWeights();
    ranker.applyFeedback({ articleId: "a", signal: "saved" });
    const after = ranker.getWeights();
    expect(after.topicMatch).toBeGreaterThan(before.topicMatch);
    expect(after.quality).toBeGreaterThan(before.quality);
  });

  it("adjusts depth sensitivity from negative feedback", () => {
    const ranker = new LightweightRanker();
    const before = ranker.getWeights();
    ranker.applyFeedback({ articleId: "b", signal: "too_advanced" });
    const after = ranker.getWeights();
    expect(after.depthFit).toBeLessThan(before.depthFit);
  });
});
