"use client";

import React, { useState, ComponentType, useEffect, useRef } from "react";
import { ArrowLeft, ExternalLink, Calendar, MapPin, DollarSign, Sparkles, Star, Gauge, Flame, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { Event } from "@/types/Event";

interface RecommendationsScreenProps {
  events: Event[];
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onReturnHome: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
}

const RecommendationsScreen: ComponentType<RecommendationsScreenProps> = ({
  events,
  loading,
  error,
  onBack,
  onReturnHome,
  onLoadMore,
  hasMore,
  loadingMore,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const heroEvent = events[0];
  const secondaryEvents = heroEvent ? events.slice(1) : events;
  const freeExperiences = events.filter((event) => {
    if (event.isFree) return true;
    if (!event.price) return false;
    return event.price.toLowerCase().includes("free");
  }).length;
  const uniqueCategories = Array.from(
    new Set(events.map((event) => event.category).filter(Boolean))
  ).length;
  const curatedScore = Math.min(99, Math.max(72, 65 + events.length * 3));
  const vibeLabel = curatedScore > 92 ? "Best Match" : curatedScore > 85 ? "Lively" : "Chill";
  const highlightStats = [
    { label: "Curated Picks", value: events.length || "-" },
    { label: "Free Experiences", value: freeExperiences || 0 },
    { label: "Unique Categories", value: uniqueCategories || 1 },
  ];
  const accentGradients = [
    "from-purple-500/20 to-cyan-500/20",
    "from-pink-500/20 to-orange-500/20",
    "from-blue-500/20 to-emerald-500/20",
  ];

  useEffect(() => {
    setTimeout(() => setIsAnimated(true), 100);
  }, []);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          onLoadMore();
        }
      },
      { threshold: 1 }
    );

    const current = loadMoreRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
      observer.disconnect();
    };
  }, [hasMore, loadingMore, onLoadMore, events.length]);

  const handleEventClick = (url?: string) => {
    if (url) window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-cyan-400"></div>
              <p className="text-white text-lg font-medium">
                Finding your perfect events...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>


        <div className="relative z-10 flex flex-col items-center justify-center min-h-full p-6 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
            <p className="text-white/80 mb-6">{ error }</p>
            <button
              onClick={ onReturnHome }
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 p-6 sm:p-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <button
                onClick={ () => setSelectedEvent(null) }
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full transition-all duration-300 hover:bg-white/20 border border-white/20"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Back to Events</span>
              </button>
            </div>

            <motion.div
              initial={ { opacity: 0, y: 20 } }
              animate={ { opacity: 1, y: 0 } }
              className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="relative h-64 sm:h-80">
                <img
                  src={ selectedEvent.image }
                  alt={ selectedEvent.title }
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-semibold text-gray-800">Recommended</span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  { selectedEvent.title }
                </h1>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      { selectedEvent.location && (
                        <p className="text-sm text-gray-600">{ selectedEvent.location }</p>
                      ) }
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-cyan-600" />
                    </div>
                    <p className="text-gray-800 font-medium">{ selectedEvent.datetime }</p>
                  </div>

                  { selectedEvent.price && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <DollarSign className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-green-700 font-semibold">{ selectedEvent.price }</p>
                    </div>
                  ) }
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    { selectedEvent.fullDescription || selectedEvent.description }
                  </p>
                </div>

                <button
                  onClick={ () => handleEventClick(selectedEvent.url) }
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                >
                  <ExternalLink className="w-5 h-5" />
                  Get Tickets on Eventfinda
                </button>
              </div>
            </motion.div>

            <div className="mt-6">
              <button
                onClick={ onReturnHome }
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-xl border border-white/20 transition-all duration-300 hover:scale-105"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className={ `mb-8 transition-all duration-1000 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}` }>
            <button
              onClick={ onBack }
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full transition-all duration-300 hover:bg-white/20 border border-white/20 mb-6"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Back</span>
            </button>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-cyan-400" />
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                  Your Recommendations
                </h1>
              </div>
              <p className="text-white/80 text-lg">
                Perfect events curated just for you
              </p>
            </div>
          </div>

          { heroEvent && (
            <motion.div
              className="mb-10"
              initial={ { opacity: 0, y: 20 } }
              animate={ { opacity: 1, y: 0 } }
              transition={ { duration: 0.5 } }
            >
              <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl">
                <div className="absolute inset-0 opacity-60 bg-gradient-to-r from-purple-900/40 via-transparent to-cyan-900/40" />
                <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-8">
                  <div className="relative rounded-2xl overflow-hidden border border-white/20 lg:max-w-[1170px] aspect-[1170/504]">
                    <img
                      src={ heroEvent.image }
                      alt={ heroEvent.title }
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:max-w-[1170px] aspect-[1170/504]" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/90 text-xs font-semibold text-gray-800 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        Top Pick
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    <div>
                      <p className="text-sm uppercase tracking-wider text-white/70 mb-2 flex items-center gap-2">
                        <Compass className="w-4 h-4 text-cyan-300" />
                        Spotlight Experience
                      </p>
                      <h2 className="text-3xl font-bold text-white leading-tight mb-3">
                        { heroEvent.title }
                      </h2>
                      <p className="text-white/80">
                        Dive deeper into this { heroEvent.category?.toLowerCase() || "curated" } moment. We have matched it with your vibe for a { vibeLabel.toLowerCase() } night out.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 border border-white/10">
                        <Gauge className="w-5 h-5 text-cyan-300" />
                        <div>
                          <p className="text-xs uppercase tracking-widest text-white/70">Match Score</p>
                          <p className="text-white text-lg font-semibold">{ curatedScore } / 100 • { vibeLabel }</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 border border-white/10">
                        <Flame className="w-5 h-5 text-orange-300" />
                        <div>
                          <p className="text-xs uppercase tracking-widest text-white/70">Energy</p>
                          <p className="text-white text-lg font-semibold">{ heroEvent.location || "Vibrant venue" }</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      { heroEvent.category && (
                        <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-white/80 border border-white/20">
                          { heroEvent.category }
                        </span>
                      ) }
                      { heroEvent.price && (
                        <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-white/80 border border-white/20">
                          { heroEvent.price }
                        </span>
                      ) }
                      <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-semibold text-white/80 border border-white/20">
                        { heroEvent.datetime }
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={ () => setSelectedEvent(heroEvent) }
                        className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg"
                      >
                        Dive Into Details
                      </button>
                      <button
                        onClick={ () => handleEventClick(heroEvent.url) }
                        className="px-6 py-4 rounded-xl border border-white/30 text-white/80 hover:text-white hover:border-white/60 transition-all duration-300"
                      >
                        Get Tickets
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) }

          <div className="grid gap-4 sm:grid-cols-3 mb-10">
            { highlightStats.map((stat) => (
              <motion.div
                key={ stat.label }
                className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-lg p-4"
                initial={ { opacity: 0, y: 10 } }
                animate={ { opacity: 1, y: 0 } }
                transition={ { duration: 0.4 } }
              >
                <p className="text-xs uppercase tracking-widest text-white/60 mb-1">{ stat.label }</p>
                <p className="text-2xl font-semibold text-white">{ stat.value }</p>
              </motion.div>
            )) }
          </div>

          <div className="space-y-6">
            { secondaryEvents.map((event, index) => (
              <motion.button
                key={ event.id }
                onClick={ () => setSelectedEvent(event) }
                className="w-full group"
                initial={ { opacity: 0, y: 20 } }
                animate={ { opacity: 1, y: 0 } }
                transition={ { delay: index * 0.1 } }
                whileHover={ { scale: 1.02 } }
                whileTap={ { scale: 0.98 } }
              >
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20 transition-all duration-300 group-hover:shadow-2xl">
                  <div className="relative w-full lg:max-w-[1170px] aspect-[1170/504] object-cover">
                    <img
                      src={ event.image }
                      alt={ event.title }
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{ (heroEvent ? index + 2 : index + 1) }</span>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/80 to-orange-500/80 text-white text-xs font-semibold">
                        { event.category || "Curated" }
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 text-left">
                    <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-2 group-hover:text-purple-700 transition-colors duration-200">
                      { event.title }
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        { event.location && (
                          <span className="text-sm">{ event.location }</span>
                        ) }
                      </div>

                      <div className="flex items-center gap-2 text-cyan-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">{ event.datetime }</span>
                      </div>

                      { event.price && (
                        <div className="flex items-center gap-2 text-green-600">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm font-semibold">{ event.price }</span>
                        </div>
                      ) }
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      { event.isFree && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                          Free Entry
                        </span>
                      ) }
                    </div>
                  </div>
                </div>
              </motion.button>
            )) }
            { hasMore && (
              <div ref={ loadMoreRef } className="flex items-center justify-center py-6">
                { loadingMore ? (
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-cyan-400"></div>
                    Loading more events...
                  </div>
                ) : (
                  <span className="text-white/70 text-sm">You have seen all the events</span>
                ) }
              </div>
            ) }
          </div>

          <motion.div
            className="mt-8"
            initial={ { opacity: 0 } }
            animate={ { opacity: 1 } }
            transition={ { delay: events.length * 0.1 + 0.3 } }
          >
            <button
              onClick={ onReturnHome }
              className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-xl border border-white/20 transition-all duration-300 hover:scale-105"
            >
              Start Over
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsScreen;
