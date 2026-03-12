import { EventDateFilter } from "@/types/Event";

export type AgentRole = "user" | "assistant";

export interface AgentRecommendation {
  id: string;
  title: string;
  location: string;
  datetime: string;
  url?: string;
  image?: string;
  whyThis?: string;
}

export interface AgentMessage {
  id: string;
  role: AgentRole;
  content: string;
  recommendations?: AgentRecommendation[];
  followUpQuestion?: string;
}

export interface AgentContext {
  location?: string;
  dateFilter?: EventDateFilter;
}

export interface AgentRequest {
  sessionId: string;
  message: string;
  context?: AgentContext;
}

export interface AgentResponse {
  assistantMessage: string;
  recommendations?: AgentRecommendation[];
  followUpQuestion?: string;
  memory?: AgentMemory;
}

export interface AgentMemory {
  location?: string;
  dateFilter?: EventDateFilter;
  budget?: number;
  vibe?: string;
  query?: string;
  lastCategoryIds?: string;
}
