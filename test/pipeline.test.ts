import { describe, expect, it } from "vitest";
import { mkdtempSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runPipeline } from "../src/pipeline.js";
import type { UserContext } from "../src/types.js";

const context: UserContext = {
  focusTopics: ["agentic architecture", "rag", "evals"],
  preferredDepth: 0.7,
};

describe("pipeline", () => {
  it("ingests mock sources, ranks, buckets, and persists state", () => {
    const dir = mkdtempSync(join(tmpdir(), "second-brain-"));
    const statePath = join(dir, "state.json");

    const result = runPipeline({ context, statePath, useMockSources: true });

    expect(result.candidates.length).toBeGreaterThan(0);
    expect(result.ranked.length).toBeGreaterThan(0);
    expect(result.digest.read_now.length).toBeGreaterThan(0);
    expect(existsSync(statePath)).toBe(true);

    const raw = readFileSync(statePath, "utf8");
    const parsed = JSON.parse(raw) as { lastDigest?: unknown };
    expect(parsed.lastDigest).toBeTruthy();
  });
});
