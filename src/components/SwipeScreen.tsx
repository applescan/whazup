"use client";

import React, { useState, ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ArrowLeft, Sparkles, Star } from "lucide-react";
import { Category } from "@/hooks/useCategories";

interface Question {
  id: number;
  text: string;
  category: Category;
}

interface SwipeScreenProps {
  questions: Question[];
  onLike: (category: Category) => void;
  onBack: () => void;
  onMatchesFound: () => void;
  apiError?: string | null;
}

const SwipeScreen: ComponentType<SwipeScreenProps> = ({
  questions,
  onLike,
  onBack,
  onMatchesFound,
  apiError,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );

  const handleSwipe = (liked: boolean) => {
    setSwipeDirection(liked ? "right" : "left");

    setTimeout(() => {
      const current = questions[currentIndex];
      if (liked) onLike(current.category);

      const nextIndex = currentIndex + 1;
      if (nextIndex < questions.length) {
        setCurrentIndex(nextIndex);
        setSwipeDirection(null);
      } else {
        onMatchesFound();
      }
    }, 300);
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  if (apiError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Oops!</h2>
            <p className="text-white/80 mb-6">
              { apiError }
            </p>
            <button
              onClick={ onBack }
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      <div className="relative z-10 flex flex-col min-h-full">
        <div className="flex-shrink-0 p-4 sm:p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={ onBack }
              className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-white/10 backdrop-blur-sm rounded-full transition-all duration-300 hover:bg-white/20 border border-white/20"
            >
              <ArrowLeft size={ 18 } className="text-white sm:w-5 sm:h-5" />
              <span className="text-white text-xs sm:text-sm font-medium">Back</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 sm:gap-2 text-white/80 text-xs sm:text-sm">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{ currentIndex + 1 } of { questions.length }</span>
              </div>
              <div className="w-16 sm:w-24 h-1.5 sm:h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                  initial={ { width: 0 } }
                  animate={ { width: `${progress}%` } }
                  transition={ { duration: 0.5, ease: "easeOut" } }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-start justify-center px-6 sm:px-6 pt-4 pb-6">
          <div className="w-full max-w-sm relative">
            <AnimatePresence mode="wait">
              { currentQuestion && (
                <motion.div
                  key={ currentQuestion.id }
                  initial={ { opacity: 0, scale: 0.8, y: 30 } }
                  animate={ { opacity: 1, scale: 1, y: 0 } }
                  exit={ {
                    x: swipeDirection === "left" ? -300 : 300,
                    opacity: 0,
                    scale: 0.8,
                    rotate: swipeDirection === "left" ? -15 : 15,
                  } }
                  transition={ { duration: 0.4, ease: "easeInOut" } }
                  drag="x"
                  dragConstraints={ { left: 0, right: 0 } }
                  dragElastic={ 0.5 }
                  onDragEnd={ (event, info) => {
                    if (info.offset.x > 100) {
                      handleSwipe(true);
                    } else if (info.offset.x < -100) {
                      handleSwipe(false);
                    }
                  } }
                  className="relative cursor-grab active:cursor-grabbing"
                >
                  { currentIndex === 0 && (
                    <motion.div
                      initial={ { opacity: 0, y: 10 } }
                      animate={ { opacity: 1, y: 0 } }
                      exit={ { opacity: 0, y: -10 } }
                      className="mb-4 flex justify-center"
                    >
                      <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20">
                        <span className="text-white/80 text-xs sm:text-sm">Swipe or tap below</span>
                      </div>
                    </motion.div>
                  ) }

                  <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20 transform transition-all duration-300 hover:scale-105">
                    <div className="relative">
                      <img
                        src={
                          currentQuestion.category.imageUrl ??
                          "/placeholder-category.jpg"
                        }
                        alt={ currentQuestion.category.name }
                        className="w-full h-48 sm:h-64 md:h-72 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 sm:px-3 rounded-full">
                          <span className="text-xs font-semibold text-gray-800">
                            { currentQuestion.category.name }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current" />
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                          What do you think?
                        </h2>
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        { currentQuestion.text }
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) }
            </AnimatePresence>
          </div>
        </div>

        <div className="flex-shrink-0 relative z-10 flex justify-center gap-6 sm:gap-8 px-4 sm:px-6 pb-6 sm:pb-8">
          <motion.button
            onClick={ () => handleSwipe(false) }
            className="flex flex-col items-center group"
            whileTap={ { scale: 0.9 } }
            whileHover={ { scale: 1.05 } }
          >
            <div className="p-3 sm:p-4 md:p-5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:bg-white border border-white/20">
              <X className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
            </div>
            <span className="text-xs sm:text-sm text-white/80 mt-2 sm:mt-3 font-medium group-hover:text-white transition-colors duration-200">
              Not for me
            </span>
          </motion.button>

          <motion.button
            onClick={ () => handleSwipe(true) }
            className="flex flex-col items-center group"
            whileTap={ { scale: 0.9 } }
            whileHover={ { scale: 1.05 } }
          >
            <div className="p-3 sm:p-4 md:p-5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:from-pink-600 group-hover:to-rose-600 border border-pink-400/30">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-current" />
            </div>
            <span className="text-xs sm:text-sm text-pink-300 mt-2 sm:mt-3 font-semibold group-hover:text-pink-200 transition-colors duration-200">
              Love it!
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SwipeScreen;
