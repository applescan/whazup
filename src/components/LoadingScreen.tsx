"use client";

import React from "react";

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Finding amazing events...</h2>
        <p className="text-white/80 text-lg">
          We're searching for the best events in your area
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
