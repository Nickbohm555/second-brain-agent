import type { CandidateArticle } from "../types.js";

export function loadMockX(): CandidateArticle[] {
  return [
    {
      id: "x_1",
      source: "x",
      title: "Tool calling reliability in multi-agent systems",
      url: "https://x.com/example/1",
      summary: "Benchmarks and failure modes for tool calling in multi-agent setups.",
      topics: ["agentic architecture", "tools", "evals"],
      hasCode: true,
      hasBenchmarks: true,
      depthScore: 0.8,
      recencyHours: 6,
      qualityScore: 0.78,
      author: "researcher_a",
      publishedAt: "2026-02-10T18:00:00Z",
    },
    {
      id: "x_2",
      source: "x",
      title: "General AI news roundup",
      url: "https://x.com/example/2",
      summary: "A light roundup of AI headlines.",
      topics: ["general ai news"],
      hasCode: false,
      hasBenchmarks: false,
      depthScore: 0.2,
      recencyHours: 3,
      qualityScore: 0.45,
      author: "reporter_b",
      publishedAt: "2026-02-10T21:00:00Z",
    },
  ];
}

export function loadMockBrave(): CandidateArticle[] {
  return [
    {
      id: "br_1",
      source: "brave",
      title: "RAG evaluation methods for enterprise search",
      url: "https://search.example.com/rag-evals",
      summary: "Practical evaluation suite for retrieval + generation.",
      topics: ["rag", "evals", "enterprise search"],
      hasCode: true,
      hasBenchmarks: true,
      depthScore: 0.74,
      recencyHours: 12,
      qualityScore: 0.86,
      author: "lab_c",
      publishedAt: "2026-02-10T10:00:00Z",
    },
    {
      id: "br_2",
      source: "brave",
      title: "AI product launch: new assistant",
      url: "https://search.example.com/launch",
      summary: "High-level product announcement.",
      topics: ["product", "ai news"],
      hasCode: false,
      hasBenchmarks: false,
      depthScore: 0.3,
      recencyHours: 24,
      qualityScore: 0.52,
      author: "press_d",
      publishedAt: "2026-02-09T18:00:00Z",
    },
  ];
}
