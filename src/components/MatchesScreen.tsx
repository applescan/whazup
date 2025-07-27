"use client";

import React from "react";

interface MatchesScreenProps {
  onCheckRecommendations: () => void;
  onKeepSwiping: () => void;
}

const MatchesScreen: React.FC<MatchesScreenProps> = ({
  onCheckRecommendations,
  onKeepSwiping,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center max-w-sm mx-auto">
        <div className="mb-8 flex justify-center items-center">
          <div className="relative">
            <div className="w-16 h-20 bg-amber-200 rounded-b-xl relative mr-4">
              <div className="w-12 h-16 bg-amber-800 mx-auto mt-2 rounded-sm"></div>
              <div className="absolute -right-2 top-4 w-6 h-8 border-4 border-amber-200 rounded-full"></div>
              <div className="absolute top-6 left-3 w-1 h-1 bg-white rounded-sm"></div>
              <div className="absolute top-8 left-3 w-1 h-1 bg-white rounded-sm"></div>
              <div className="absolute top-10 left-3 w-1 h-1 bg-white rounded-sm"></div>
              <div className="absolute top-6 left-5 w-1 h-1 bg-white rounded-sm"></div>
              <div className="absolute top-8 left-5 w-1 h-1 bg-white rounded-sm"></div>
            </div>

            <div className="w-16 h-20 bg-amber-200 rounded-b-xl relative">
              <div className="w-12 h-16 bg-amber-800 mx-auto mt-2 rounded-sm"></div>
              <div className="absolute -left-2 top-4 w-6 h-8 border-4 border-amber-200 rounded-full"></div>
              <div className="absolute top-6 right-3 w-1 h-1 bg-white rounded-sm"></div>
              <div className="absolute top-8 right-3 w-1 h-1 bg-white rounded-sm"></div>
              <div className="absolute top-10 right-3 w-1 h-1 bg-white rounded-sm"></div>
              <div className="absolute top-6 right-5 w-1 h-1 bg-white rounded-sm"></div>
              <div className="absolute top-8 right-5 w-1 h-1 bg-white rounded-sm"></div>
            </div>

            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Heart className="w-8 h-8 text-pink-400 fill-current" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-blue-100">
          We found matches!
        </h1>
        <p className="text-white/80 text-lg mb-12 leading-relaxed">
          Based on your choice we have some recommendations for you
        </p>

        <div className="space-y-4">
          <button
            onClick={onCheckRecommendations}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Check recommendations
          </button>

          <button
            onClick={onKeepSwiping}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-6 rounded-xl backdrop-blur-sm transition-all duration-200"
          >
            Keep swiping
          </button>
        </div>
      </div>
    </div>
  );
};

// Heart component for the icon
const Heart: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default MatchesScreen;
