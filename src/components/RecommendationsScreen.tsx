"use client";

import React, { useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Event } from "@/types/Event";

interface RecommendationsScreenProps {
  events: Event[];
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onReturnHome: () => void;
}

const RecommendationsScreen: React.FC<RecommendationsScreenProps> = ({
  events,
  loading,
  error,
  onBack,
  onReturnHome,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleEventClick = (url?: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <p className="text-white text-lg font-medium">
          Loading recommendations...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-6 text-center">
        <p className="text-white text-lg font-medium mb-4">{error}</p>
        <button
          onClick={onReturnHome}
          className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl backdrop-blur-sm transition-all duration-200"
        >
          Return Home
        </button>
      </div>
    );
  }

  if (selectedEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-6">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-white hover:text-white/80 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
          </div>

          <h1 className="text-2xl font-bold text-white mb-8">
            Recommendations
          </h1>

          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl mb-8">
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedEvent.title}
              </h2>
              <div className="text-sm text-gray-600 mb-4">
                <p className="font-medium">{selectedEvent.venue}</p>
                <p className="text-blue-600 font-medium">
                  {selectedEvent.datetime}
                </p>
                {selectedEvent.price && (
                  <p className="font-semibold text-green-600 mt-1">
                    {selectedEvent.price}
                  </p>
                )}
              </div>

              <h3 className="font-bold text-gray-800 mb-3">
                {selectedEvent.description.split(".")[0]}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {selectedEvent.fullDescription || selectedEvent.description}
              </p>

              <button
                onClick={() => handleEventClick(selectedEvent.url)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View on Eventfinda
              </button>
            </div>
          </div>

          <button
            onClick={onReturnHome}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-6 rounded-xl backdrop-blur-sm transition-all duration-200"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-6">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="text-white hover:text-white/80 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        <h1 className="text-2xl font-bold text-white mb-8">Recommendations</h1>

        <div className="space-y-4 mb-8">
          {events.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="w-full bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              <div className="flex gap-4">
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-gray-800 mb-1">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {event.venue}, {event.location}
                  </p>
                  <p className="text-sm text-blue-600 font-medium">
                    {event.datetime}
                  </p>
                  {event.price && (
                    <p className="text-sm font-semibold text-green-600 mt-1">
                      {event.price}
                    </p>
                  )}
                </div>
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onReturnHome}
          className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-6 rounded-xl backdrop-blur-sm transition-all duration-200"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default RecommendationsScreen;
