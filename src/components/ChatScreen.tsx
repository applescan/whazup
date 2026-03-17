"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  Calendar,
  Maximize2,
  MapPin,
  Minimize2,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import {
  AgentMessage,
  AgentRecommendation,
  AgentResponse,
} from "@/types/Agent";
import { EventDateFilter } from "@/types/Event";

interface ChatScreenProps {
  location: string;
  dateFilter: EventDateFilter;
  onBack: () => void;
}

const quickChips = [
  "Plan my night",
  "Live music this weekend",
  "Free events",
  "Chill vibe",
  "Family friendly",
];

const dateFilterLabels: Record<EventDateFilter, string> = {
  future: "upcoming",
  today: "today",
  this_week: "this week",
  this_weekend: "this weekend",
};

const ChatScreen: React.FC<ChatScreenProps> = ({ location, dateFilter, onBack }) => {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const sessionId = useMemo(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `session-${Math.random().toString(36).slice(2)}`;
  }, []);

  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `Tell me the vibe, budget, or who you are heading out with, and I will find ${dateFilterLabels[dateFilter]} picks in ${location || "New Zealand"}.`,
      },
    ]);
  }, [dateFilter, location]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const container = messagesRef.current;
      if (!container) return;

      container.scrollTo({
        top: container.scrollHeight,
        behavior: messages.length > 1 ? "smooth" : "auto",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isExpanded, loading, messages]);

  useEffect(() => {
    const composer = inputRef.current;
    if (!composer) return;

    composer.style.height = "0px";
    const nextHeight = Math.min(composer.scrollHeight, 144);
    composer.style.height = `${nextHeight}px`;
    composer.style.overflowY = composer.scrollHeight > 144 ? "auto" : "hidden";
  }, [input]);

  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  const addAssistantMessage = (
    content: string,
    recommendations?: AgentRecommendation[],
    followUpQuestion?: string
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content,
        recommendations,
        followUpQuestion,
      },
    ]);
  };

  const handleSend = async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || loading) return;

    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "0px";
    }
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", content: message },
    ]);

    setLoading(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message,
          context: { location, dateFilter },
        }),
      });

      if (!response.ok) {
        throw new Error("Agent request failed");
      }

      const data: AgentResponse = await response.json();
      addAssistantMessage(
        data.assistantMessage || "Here is what I found.",
        data.recommendations,
        data.followUpQuestion
      );
    } catch {
      addAssistantMessage("I ran into a problem. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="relative h-[100dvh] overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 -right-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-cyan-500/5 blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+3rem)] pt-[calc(env(safe-area-inset-top)+1.25rem)] sm:px-10 sm:pt-10 sm:pb-16">
        { !isExpanded && (
          <div className="mb-3 rounded-[28px] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-xl sm:mb-5 sm:p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/30 via-white/15 to-cyan-400/20">
                  <Sparkles className="h-5 w-5 text-cyan-100" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base font-semibold text-white sm:text-lg">
                    AI Event Assistant
                  </h1>
                  <p className="mt-1 text-xs leading-relaxed text-white/65 sm:text-sm">
                    Ask for a mood, a budget, or a full night plan and get mobile-friendly recommendations fast.
                  </p>
                </div>
              </div>
              <button
                onClick={ onBack }
                aria-label="Back"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-black/15 px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                type="button"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-black/15 px-3 py-1.5 text-[11px] font-medium text-white/75 sm:text-xs">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-cyan-200" />
                <span className="truncate capitalize">{ location || "New Zealand" }</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-3 py-1.5 text-[11px] font-medium text-white/75 sm:text-xs">
                <Calendar className="h-3.5 w-3.5 shrink-0 text-cyan-200" />
                <span className="capitalize">{ dateFilterLabels[dateFilter] }</span>
              </div>
            </div>
          </div>
        ) }

        <div
          className={
            isExpanded
              ? "fixed inset-0 z-30 flex min-h-0 flex-col overflow-hidden bg-slate-950/94 shadow-2xl backdrop-blur-2xl"
              : "flex min-h-0 flex-1 flex-col overflow-hidden rounded-[30px] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl"
          }
        >
          <div
            className={
              isExpanded
                ? "border-b border-white/10 px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] sm:px-6 sm:pb-5"
                : "border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5"
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">
                  { isExpanded ? "Chat in full screen" : "Start with a shortcut" }
                </p>
                <p className="mt-1 text-xs text-white/55">
                  { isExpanded
                    ? "Stay focused on the conversation and press Escape anytime to collapse."
                    : "Great on mobile when you want a quick answer." }
                </p>
              </div>
              <div className="flex items-center gap-2">
                { isExpanded && (
                  <button
                    onClick={ onBack }
                    aria-label="Back"
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-black/15 px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                    type="button"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Back</span>
                  </button>
                ) }
                <button
                  onClick={ handleToggleExpanded }
                  aria-label={ isExpanded ? "Exit full screen chat" : "Open full screen chat" }
                  aria-pressed={ isExpanded }
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-black/15 px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                  type="button"
                >
                  { isExpanded ? (
                    <>
                      <Minimize2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Exit full screen</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Full screen</span>
                    </>
                  ) }
                </button>
                { !isExpanded && (
                  <div className="hidden rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-100 sm:block">
                    Live Chat
                  </div>
                ) }
              </div>
            </div>

            { isExpanded && (
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-black/15 px-3 py-1.5 text-[11px] font-medium text-white/75 sm:text-xs">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-cyan-200" />
                  <span className="truncate capitalize">{ location || "New Zealand" }</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-3 py-1.5 text-[11px] font-medium text-white/75 sm:text-xs">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-cyan-200" />
                  <span className="capitalize">{ dateFilterLabels[dateFilter] }</span>
                </div>
              </div>
            ) }

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              { quickChips.map((chip) => (
                <button
                  key={ chip }
                  onClick={ () => handleSend(chip) }
                  className="shrink-0 rounded-full border border-white/15 bg-black/15 px-4 py-2 text-xs font-semibold text-white/80 transition hover:border-purple-300/30 hover:bg-white/10 hover:text-white disabled:opacity-50"
                  disabled={ loading }
                  type="button"
                >
                  { chip }
                </button>
              )) }
            </div>
          </div>

          <div
            ref={ messagesRef }
            className="flex-1 min-h-0 space-y-4 overflow-y-auto overscroll-contain px-3 py-4 sm:px-6 sm:py-6"
          >
            { messages.map((msg) => (
              <div
                key={ msg.id }
                className={
                  msg.role === "user"
                    ? "flex items-end justify-end gap-2"
                    : "flex items-start gap-3"
                }
              >
                { msg.role === "assistant" && (
                  <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-cyan-100 sm:flex">
                    <Bot className="h-4 w-4" />
                  </div>
                ) }
                <div
                  className={
                    msg.role === "user"
                      ? "max-w-[88%] rounded-[22px] rounded-br-md bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-3 text-white shadow-lg shadow-purple-950/30 sm:max-w-[70%]"
                      : "max-w-[94%] rounded-[22px] rounded-tl-md border border-white/65 bg-white/95 px-4 py-3 text-slate-900 shadow-xl shadow-slate-950/10 sm:max-w-[78%]"
                  }
                >
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
                    { msg.role === "user" ? (
                      <>
                        <User className="h-3.5 w-3.5" />
                        <span>You</span>
                      </>
                    ) : (
                      <>
                        <Bot className="h-3.5 w-3.5 text-purple-700" />
                        <span className="text-purple-700">Assistant</span>
                      </>
                    ) }
                  </div>

                  <p className="text-sm leading-relaxed">{ msg.content }</p>

                  { msg.followUpQuestion && (
                    <p className="mt-3 rounded-2xl bg-slate-100 px-3 py-2 text-xs text-slate-600">
                      { msg.followUpQuestion }
                    </p>
                  ) }

                  { msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="mt-3 grid gap-2">
                      { msg.recommendations.map((rec) => (
                        <div
                          key={ rec.id }
                          className="w-full min-w-0 rounded-[18px] border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                        >
                          <div className="flex items-start gap-3">
                            { rec.image && (
                              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20">
                                <img
                                  src={ rec.image }
                                  alt={ rec.title }
                                  className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent"></div>
                              </div>
                            ) }

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="truncate text-[13px] font-semibold text-slate-900 sm:text-sm">
                                    { rec.title }
                                  </p>
                                  <p className="mt-0.5 truncate text-[11px] text-slate-500">
                                    { rec.location }
                                  </p>
                                </div>
                                <span className="shrink-0 rounded-full bg-cyan-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-700">
                                  Match
                                </span>
                              </div>

                              <p className="mt-2 text-[11px] font-medium text-cyan-700">
                                { rec.datetime }
                              </p>

                              { rec.whyThis && (
                                <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-slate-600">
                                  { rec.whyThis }
                                </p>
                              ) }

                              { rec.url && (
                                <a
                                  href={ rec.url }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 transition hover:text-purple-900"
                                >
                                  View details
                                  <ArrowUpRight className="h-3 w-3" />
                                </a>
                              ) }
                            </div>
                          </div>
                        </div>
                      )) }
                    </div>
                  ) }
                </div>
              </div>
            )) }

            { loading && (
              <div className="flex items-start gap-3">
                <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-cyan-100 sm:flex">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-[22px] rounded-tl-md border border-white/65 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-500"></span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-500 [animation-delay:150ms]"></span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-500 [animation-delay:300ms]"></span>
                    <span className="ml-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                      Thinking
                    </span>
                  </div>
                </div>
              </div>
            ) }
          </div>

          <div
            className={
              isExpanded
                ? "border-t border-white/10 bg-black/20 px-3 pb-[calc(env(safe-area-inset-bottom)+0.9rem)] pt-3 sm:px-6 sm:pt-5"
                : "border-t border-white/10 bg-black/20 px-3 py-3 sm:px-6 sm:py-5"
            }
          >
            <div className="rounded-[26px] border border-white/15 bg-black/15 p-2 shadow-inner shadow-black/10">
              <div className="flex items-end gap-2 sm:gap-3">
                <textarea
                  ref={ inputRef }
                  value={ input }
                  onChange={ (e) => setInput(e.target.value) }
                  onKeyDown={ (e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  } }
                  placeholder="Ask for an idea or a surprise"
                  rows={ 1 }
                  className="min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 text-white placeholder:text-white/45 focus:outline-none"
                />
                <button
                  onClick={ () => handleSend() }
                  disabled={ loading || !input.trim() }
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 px-4 text-sm font-semibold text-white shadow-lg shadow-purple-950/30 transition hover:from-purple-500 hover:to-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
            <p className="mt-2 px-1 text-[11px] text-white/45">
              Press Enter to send. Use Shift+Enter for a new line.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
