import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";

export class JsonFileStore<T> {
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  load(): T | null {
    if (!existsSync(this.path)) return null;
    const raw = readFileSync(this.path, "utf8");
    return JSON.parse(raw) as T;
  }

  save(data: T): void {
    const dir = dirname(this.path);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    const payload = JSON.stringify(data, null, 2);
    writeFileSync(this.path, payload, "utf8");
  }
}
