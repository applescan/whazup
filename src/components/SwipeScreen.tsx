"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";
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

const SwipeScreen: React.FC<SwipeScreenProps> = ({
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
      liked ? onLike(current.category) : null;

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

  if (apiError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 text-center bg-white">
        <p className="text-red-600 text-lg font-medium mb-4">
          Error: {apiError}
        </p>
        <button onClick={onBack} className="text-blue-600 underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                x: swipeDirection === "left" ? -200 : 200,
                opacity: 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white rounded-3xl shadow-lg p-6 text-center"
            >
              <img
                src="/placeholder-category.jpg"
                alt={currentQuestion.category.name}
                className="w-28 h-28 mx-auto rounded-full object-cover mb-4 border-4 border-gray-200"
              />
              <p className="text-xl font-bold text-gray-800 mb-6">
                {currentQuestion.text}
              </p>
              <div className="flex justify-center gap-10">
                <button
                  onClick={() => handleSwipe(false)}
                  className="p-3 bg-red-100 rounded-full hover:bg-red-200 transition"
                  aria-label="Dislike"
                >
                  <X className="w-6 h-6 text-red-500" />
                </button>
                <button
                  onClick={() => handleSwipe(true)}
                  className="p-3 bg-green-100 rounded-full hover:bg-green-200 transition"
                  aria-label="Like"
                >
                  <Heart className="w-6 h-6 text-green-500" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SwipeScreen;
