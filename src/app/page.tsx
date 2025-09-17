"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useEvents } from "@/hooks/useEvents";
import WelcomeScreen from "@/components/WelcomeScreen";
import LoadingScreen from "@/components/LoadingScreen";
import SwipeScreen from "@/components/SwipeScreen";
import MatchesScreen from "@/components/MatchesScreen";
import RecommendationsScreen from "@/components/RecommendationsScreen";
import { Category, useCategories } from "@/hooks/useCategories";
import { AppState, shuffleArray } from "@/utils/helpers";
import { questions } from "@/data/Questions";

export default function Home() {
  const [currentState, setCurrentState] = useState<AppState>(AppState.Welcome);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [likedCategories, setLikedCategories] = useState<Category[]>([]);
  const { categories, loading: categoriesLoading } = useCategories();
  const categoryIds = likedCategories.map((c) => c.id).join(",");
  const {
    events: recommendedEvents,
    loading: eventsLoading,
    error,
  } = useEvents(selectedLocation, categoryIds);

  const questionList = useMemo(() => {
    const seen = new Set<number>();
    return shuffleArray(questions(categories)).filter((q) => {
      if (q.category && !seen.has(q.category.id)) {
        seen.add(q.category.id);
        return true;
      }
      return false;
    });
  }, [categories]);

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setCurrentState(AppState.Loading);
  };

  const handleCategoryLiked = (category: Category) => {
    setLikedCategories((prev) =>
      prev.find((c) => c.id === category.id) ? prev : [...prev, category]
    );
  };

  const handleCategoriesLoaded = () => {
    if (categories.length > 0) {
      setCurrentState(AppState.SwipingCategories);
    } else {
      setCurrentState(AppState.Matches);
    }
  };

  const handleMatchesFound = () => {
    setCurrentState(AppState.Matches);
  };

  const handleCheckRecommendations = () => {
    setCurrentState(AppState.Recommendations);
  };

  const handleKeepSwiping = () => {
    setCurrentState(AppState.SwipingCategories);
  };

  const handleReturnHome = () => {
    setCurrentState(AppState.Welcome);
    setSelectedLocation("");
    setLikedCategories([]);
  };

  const handleBackToSwiping = () => {
    setCurrentState(AppState.SwipingCategories);
  };

  useEffect(() => {
    if (currentState === AppState.Loading && !categoriesLoading) {
      handleCategoriesLoaded();
    }
  }, [currentState, categoriesLoading, categories]);

  switch (currentState) {
    case AppState.Welcome:
      return <WelcomeScreen onContinue={ handleLocationSelect } />;

    case AppState.Loading:
      return <LoadingScreen />;

    case AppState.SwipingCategories:
      return (
        <SwipeScreen
          questions={ questionList }
          onLike={ handleCategoryLiked }
          onBack={ () => setCurrentState(AppState.Welcome) }
          onMatchesFound={ handleMatchesFound }
          apiError={ error }
        />
      );

    case AppState.Matches:
      return (
        <MatchesScreen
          onCheckRecommendations={ handleCheckRecommendations }
          onKeepSwiping={ handleKeepSwiping }
        />
      );

    case AppState.Recommendations:
      return (
        <RecommendationsScreen
          events={ recommendedEvents }
          loading={ eventsLoading }
          error={ error }
          onBack={ handleBackToSwiping }
          onReturnHome={ handleReturnHome }
        />
      );

    default:
      return <WelcomeScreen onContinue={ handleLocationSelect } />;
  }
}
