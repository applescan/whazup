import { EventDateFilter } from "@/types/Event";

export type AgentRole = "user" | "assistant";

export interface AgentQuickAction {
  label: string;
  prompt: string;
}

export interface AgentRecommendation {
  id: string;
  title: string;
  location: string;
  datetime: string;
  category?: string;
  description?: string;
  url?: string;
  image?: string;
  price?: string;
  priceValue?: number;
  isFree?: boolean;
  startsAt?: string;
  endsAt?: string;
  latitude?: number;
  longitude?: number;
  planOrder?: number;
  distanceFromPreviousKm?: number;
  whyThis?: string;
}

export interface AgentMessage {
  id: string;
  role: AgentRole;
  content: string;
  recommendations?: AgentRecommendation[];
  followUpQuestion?: string;
  quickActions?: AgentQuickAction[];
}

export interface AgentContext {
  location?: string;
  dateFilter?: EventDateFilter;
}

export interface AgentRequest {
  sessionId: string;
  message: string;
  context?: AgentContext;
  memory?: AgentMemory;
}

export interface AgentResponse {
  assistantMessage: string;
  recommendations?: AgentRecommendation[];
  followUpQuestion?: string;
  quickActions?: AgentQuickAction[];
  memory?: AgentMemory;
  fallbackApplied?: boolean;
}

export interface AgentMemory {
  location?: string;
  dateFilter?: EventDateFilter;
  budget?: number;
  vibe?: string;
  query?: string;
  lastCategoryIds?: string;
  lastCategoryNames?: string[];
  excludeTerms?: string[];
  indoorPreference?: "indoor" | "outdoor";
  freeOnly?: boolean;
}
