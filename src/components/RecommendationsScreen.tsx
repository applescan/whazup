"use client";

import React, { useState, ComponentType, useEffect, useRef } from "react";
import { ArrowLeft, ExternalLink, Calendar, MapPin, DollarSign, Sparkles, Star } from "lucide-react";
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

          <div className="space-y-6">
            { events.map((event, index) => (
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

                    <div className="absolute top-3 left-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{ index + 1 }</span>
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
                  <span className="text-white/70 text-sm">Scroll to load more events</span>
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
