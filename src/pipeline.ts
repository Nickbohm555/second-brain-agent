import { LightweightRanker } from "./ranker.js";
import type {
  BucketedDigest,
  CandidateArticle,
  PipelineState,
  RankedArticle,
  UserContext,
} from "./types.js";
import { JsonFileStore } from "./storage/fileStore.js";
import { loadMockBrave, loadMockX } from "./ingestion/mockSources.js";

export interface PipelineOptions {
  context: UserContext;
  statePath?: string;
  useMockSources?: boolean;
}

export interface PipelineResult {
  candidates: CandidateArticle[];
  ranked: RankedArticle[];
  digest: BucketedDigest;
  state: PipelineState;
}

const DEFAULT_STATE_PATH = "data/second-brain-state.json";

export function runPipeline(options: PipelineOptions): PipelineResult {
  const statePath = options.statePath ?? DEFAULT_STATE_PATH;
  const store = new JsonFileStore<PipelineState>(statePath);
  const priorState = store.load();
  const ranker = new LightweightRanker(priorState?.weights);

  const candidates = collectCandidates(options.useMockSources ?? true);
  const ranked = ranker.rank(candidates, options.context);
  const digest = bucketize(ranked);

  const state: PipelineState = {
    weights: ranker.getWeights(),
    feedback: priorState?.feedback ?? [],
    lastDigest: digest,
  };
  store.save(state);

  return { candidates, ranked, digest, state };
}

export function collectCandidates(useMocks: boolean): CandidateArticle[] {
  if (!useMocks) return [];
  return [...loadMockX(), ...loadMockBrave()];
}

export function bucketize(ranked: RankedArticle[]): BucketedDigest {
  const total = ranked.length;
  if (total === 0) {
    return { read_now: [], save: [], background: [], ignore: [] };
  }

  const readNowCount = Math.max(1, Math.ceil(total * 0.2));
  const saveCount = Math.max(1, Math.ceil(total * 0.3));
  const backgroundCount = Math.max(1, Math.ceil(total * 0.3));

  const read_now = ranked.slice(0, readNowCount);
  const save = ranked.slice(readNowCount, readNowCount + saveCount);
  const background = ranked.slice(
    readNowCount + saveCount,
    readNowCount + saveCount + backgroundCount
  );
  const ignore = ranked.slice(readNowCount + saveCount + backgroundCount);

  return { read_now, save, background, ignore };
}
