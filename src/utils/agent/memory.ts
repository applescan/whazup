import { AgentMemory } from "@/types/Agent";

const memoryStore = new Map<string, AgentMemory>();

export function getMemory(sessionId: string): AgentMemory {
  if (!memoryStore.has(sessionId)) {
    memoryStore.set(sessionId, {});
  }
  return memoryStore.get(sessionId)!;
}

export function updateMemory(sessionId: string, updates: Partial<AgentMemory>): AgentMemory {
  const current = getMemory(sessionId);
  const next = { ...current, ...updates };
  memoryStore.set(sessionId, next);
  return next;
}

export function resetMemory(sessionId: string): void {
  memoryStore.delete(sessionId);
}
