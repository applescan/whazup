"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useEvents } from "@/hooks/useEvents";
import WelcomeScreen from "@/components/WelcomeScreen";
import LoadingScreen from "@/components/LoadingScreen";
import SwipeScreen from "@/components/SwipeScreen";
import MatchesScreen from "@/components/MatchesScreen";
import RecommendationsScreen from "@/components/RecommendationsScreen";
import ChatScreen from "@/components/ChatScreen";
import { Category, useCategories } from "@/hooks/useCategories";
import { EventDateFilter } from "@/types/Event";
import { AppState, shuffleArray } from "@/utils/helpers";
import { questions } from "@/data/Questions";

export default function Home() {
  const [currentState, setCurrentState] = useState<AppState>(AppState.Welcome);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedDateFilter, setSelectedDateFilter] =
    useState<EventDateFilter>("future");
  const [likedCategories, setLikedCategories] = useState<Category[]>([]);
  const {
    categories,
    loading: categoriesLoading,
    reloadCategories,
    loadedLocation,
  } = useCategories(selectedLocation, selectedDateFilter);
  const categoryIds = likedCategories.map((c) => c.id).join(",");
  const {
    events: recommendedEvents,
    loading: eventsLoading,
    error,
    loadMore,
    hasMore,
    loadingMore,
  } = useEvents(
    selectedLocation,
    categoryIds,
    selectedDateFilter,
    likedCategories.length > 0
  );

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

  const handleLocationSelect = (location: string, dateFilter: EventDateFilter) => {
    setSelectedLocation(location);
    setSelectedDateFilter(dateFilter);
    setCurrentState(AppState.Loading);
  };

  const handleOpenChat = (location: string, dateFilter: EventDateFilter) => {
    setSelectedLocation(location);
    setSelectedDateFilter(dateFilter);
    setCurrentState(AppState.Chat);
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
    reloadCategories();
    setLikedCategories([]);
    setCurrentState(AppState.SwipingCategories);
  };

  const handleReturnHome = () => {
    reloadCategories();
    setCurrentState(AppState.Welcome);
    setSelectedLocation("");
    setSelectedDateFilter("future");
    setLikedCategories([]);
  };

  const handleBackToSwiping = () => {
    reloadCategories();
    setLikedCategories([]);
    setCurrentState(AppState.SwipingCategories);
  };

  useEffect(() => {
    const readyForSelectedLocation =
      !categoriesLoading && loadedLocation === selectedLocation;

    if (currentState === AppState.Loading && readyForSelectedLocation) {
      handleCategoriesLoaded();
    }
  }, [
    currentState,
    categoriesLoading,
    categories,
    loadedLocation,
    selectedLocation,
  ]);

  switch (currentState) {
    case AppState.Welcome:
      return <WelcomeScreen onContinue={ handleLocationSelect } onOpenChat={ handleOpenChat } />;

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
          likedCount={ likedCategories.length }
        />
      );

    case AppState.Recommendations:
      return (
        <RecommendationsScreen
          events={ recommendedEvents }
          loading={ eventsLoading }
          error={ error }
          likedCount={ likedCategories.length }
          onBack={ handleBackToSwiping }
          onReturnHome={ handleReturnHome }
          onLoadMore={ loadMore }
          hasMore={ hasMore }
          loadingMore={ loadingMore }
        />
      );

    case AppState.Chat:
      return (
        <ChatScreen
          location={ selectedLocation }
          dateFilter={ selectedDateFilter }
          onBack={ handleReturnHome }
        />
      );

    default:
      return (
        <WelcomeScreen
          onContinue={ handleLocationSelect }
          onOpenChat={ handleOpenChat }
        />
      );
  }
}
