"use client";

import React, { ComponentType } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

const LoadingScreen: ComponentType = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-white text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.5 }}
          className="mb-8"
        >
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
            <motion.div
              className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"
            />
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
        </motion.div>

        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Finding Amazing Events...
        </motion.h2>

        <motion.p
          className="text-white/80 text-lg sm:text-lg leading-relaxed max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          We’re searching for the best events in your area
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingScreen;
