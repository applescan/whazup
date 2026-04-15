import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { AgentMemory } from "@/types/Agent";

const memoryStore = new Map<string, AgentMemory>();
const memoryFilePath = resolve(process.cwd(), ".cache", "agent-memory.json");
let hasLoadedMemory = false;

function loadPersistedMemory() {
  if (hasLoadedMemory) {
    return;
  }

  hasLoadedMemory = true;

  try {
    if (!existsSync(memoryFilePath)) {
      return;
    }

    const raw = readFileSync(memoryFilePath, "utf8");
    const parsed = JSON.parse(raw) as Record<string, AgentMemory>;

    for (const [sessionId, memory] of Object.entries(parsed)) {
      if (memory && typeof memory === "object") {
        memoryStore.set(sessionId, memory);
      }
    }
  } catch (error) {
    console.warn("[agent] failed to load persisted memory", error);
  }
}

function persistMemoryStore() {
  try {
    mkdirSync(dirname(memoryFilePath), { recursive: true });
    writeFileSync(
      memoryFilePath,
      JSON.stringify(Object.fromEntries(memoryStore.entries()), null, 2),
      "utf8"
    );
  } catch (error) {
    console.warn("[agent] failed to persist memory", error);
  }
}

export function getMemory(sessionId: string): AgentMemory {
  loadPersistedMemory();

  if (!memoryStore.has(sessionId)) {
    memoryStore.set(sessionId, {});
  }

  return memoryStore.get(sessionId)!;
}

export function updateMemory(sessionId: string, updates: Partial<AgentMemory>): AgentMemory {
  const current = getMemory(sessionId);
  const next = { ...current, ...updates };
  memoryStore.set(sessionId, next);
  persistMemoryStore();
  return next;
}

export function resetMemory(sessionId: string): void {
  loadPersistedMemory();
  memoryStore.delete(sessionId);
  persistMemoryStore();
}
