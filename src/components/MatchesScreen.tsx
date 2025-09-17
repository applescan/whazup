"use client";

import React, { ComponentType, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, ArrowRight, RefreshCw } from "lucide-react";

interface MatchesScreenProps {
  onCheckRecommendations: () => void;
  onKeepSwiping: () => void;
}

const MatchesScreen: ComponentType<MatchesScreenProps> = ({
  onCheckRecommendations,
  onKeepSwiping,
}) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsAnimated(true), 300);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>

        <div className="absolute top-20 left-10 animate-bounce delay-1000">
          <Heart className="w-6 h-6 text-pink-400/30 fill-current" />
        </div>
        <div className="absolute top-32 right-20 animate-bounce delay-2000">
          <Heart className="w-4 h-4 text-purple-400/30 fill-current" />
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce delay-500">
          <Heart className="w-5 h-5 text-cyan-400/30 fill-current" />
        </div>
      </div>

      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-full p-6 text-white">
        <div className="text-center max-w-md mx-auto">
          <motion.div
            className="mb-8 flex justify-center items-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.5 }}
          >
            <div className="relative">
              <div className="relative">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(251, 191, 36, 0.5)",
                      "0 0 40px rgba(251, 191, 36, 0.8)",
                      "0 0 20px rgba(251, 191, 36, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-12 h-12 text-white fill-current" />
                </motion.div>

                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-300 fill-current" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-2 -left-2"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-purple-300 fill-current" />
                </motion.div>

                <motion.div
                  className="absolute -top-1 -left-3"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-3 h-3 text-cyan-300 fill-current" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent">
              Perfect Match! 🎉
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-12"
          >
            <p className="text-white/80 text-lg sm:text-xl leading-relaxed">
              We've found some amazing events that match your interests perfectly!
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 text-cyan-300">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Personalized just for you</span>
            </div>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <motion.button
              onClick={onCheckRecommendations}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 group flex items-center justify-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
              <span>Show My Recommendations</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>

            <motion.button
              onClick={onKeepSwiping}
              className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-xl border border-white/20 transition-all duration-300 hover:scale-105 group flex items-center justify-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Keep Exploring</span>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-8"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Matches found successfully</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MatchesScreen;
