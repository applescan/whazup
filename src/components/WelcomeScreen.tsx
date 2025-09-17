"use client";

import React, { useState, useEffect, ComponentType } from "react";
import { ChevronDown, MapPin, ArrowRight, Sparkles } from "lucide-react";
import { useLocations } from "@/hooks/useLocations";
import { Region } from "@/types/Event";
import ErrorScreen from "./ErrorScreen";

interface WelcomeScreenProps {
  onContinue: (locationSlug: string) => void;
}

interface GroupedLocation {
  name: string;
  slug: string;
  count: number;
  region: string;
}

function mapToRegion(summary: string): Region {
  const s = summary.toLowerCase();

  if (s.includes("northland")) return Region.Northland;
  if (s.includes("auckland")) return Region.Auckland;
  if (s.includes("waikato")) return Region.Waikato;
  if (s.includes("bay of plenty")) return Region.BayOfPlenty;
  if (s.includes("hawke")) return Region.HawkesBay;
  if (s.includes("wellington")) return Region.Wellington;
  if (s.includes("otago")) return Region.Otago;
  if (s.includes("canterbury")) return Region.Canterbury;
  if (s.includes("southland")) return Region.Southland;

  return Region.Other;
}

const WelcomeScreen: ComponentType<WelcomeScreenProps> = ({ onContinue }) => {
  const { locations, loading, error, refetch } = useLocations();
  const [selectedLocation, setSelectedLocation] =
    useState<GroupedLocation | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [grouped, setGrouped] = useState<Record<string, GroupedLocation[]>>({});
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsAnimated(true), 100);

    if (!loading && locations.length > 0) {
      const clean: GroupedLocation[] = locations
        .filter((loc) => !loc.is_venue && loc.name && loc.url_slug)
        .map((loc) => ({
          name: loc.name,
          slug: loc.url_slug,
          count: loc.count_current_events || 0,
          region: mapToRegion(loc.summary || ""),
        }));

      const groupedMap: Record<string, GroupedLocation[]> = {};

      for (const loc of clean) {
        if (!groupedMap[loc.region]) {
          groupedMap[loc.region] = [];
        }
        groupedMap[loc.region].push(loc);
      }

      Object.values(groupedMap).forEach((group) =>
        group.sort((a, b) => a.name.localeCompare(b.name))
      );

      setGrouped(groupedMap);

      const all = clean;
      const auckland = all.find((l) =>
        l.name.toLowerCase().includes("auckland")
      );
      setSelectedLocation(auckland || all[0] || null);
    }
  }, [locations, loading]);

  const handleContinue = () => {
    if (selectedLocation) {
      onContinue(selectedLocation.slug);
    }
  };

  if (error) {
    return (
      <ErrorScreen
        error="We couldn't load locations right now. Please try again."
        onRetry={ refetch }
        onBack={ () => (window.location.href = "/") }
      />
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 pt-16 pb-28 text-white">
        <div className={ `text-center mb-12 transition-all duration-1000 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}` }>
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <img
              src="/logo.png"
              alt="Logo"
              className="h-32 mx-auto drop-shadow-2xl relative z-10 transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="mt-8">
            <p className="text-lg text-white/80 max-w-md mx-auto leading-relaxed">
              Find epic experiences and must-see events happening nearby.
            </p>
          </div>
        </div>

        <div className={ `w-full max-w-md transition-all duration-1000 delay-300 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}` }>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">
                  Choose Your Location
                </h2>
              </div>
              <p className="text-white/70 text-sm">
                Select your preferred location to explore local events
              </p>
            </div>

            <div className="relative mb-8">
              <button
                onClick={ () => setShowDropdown(!showDropdown) }
                className="w-full bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-4 rounded-xl flex items-center justify-between shadow-lg hover:bg-white transition-all duration-300 hover:shadow-xl group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">
                      { selectedLocation?.name || "Select location" }
                    </div>
                    { selectedLocation && (
                      <div className="text-xs text-gray-500">
                        { selectedLocation.count } events available
                      </div>
                    ) }
                  </div>
                </div>
                <ChevronDown
                  className={ `w-5 h-5 text-gray-500 transition-all duration-300 group-hover:text-gray-700 ${showDropdown ? "rotate-180" : ""
                    }` }
                />
              </button>

              { showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 z-20 max-h-48 overflow-hidden">
                  <div className="overflow-y-auto max-h-48 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    { loading && (
                      <div className="px-6 py-4 text-gray-500 font-medium flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-purple-500"></div>
                        Loading locations...
                      </div>
                    ) }
                    { !loading &&
                      Object.entries(grouped).map(([region, locs]) => (
                        <div key={ region }>
                          <div className="px-6 py-3 text-xs font-bold text-gray-600 bg-gradient-to-r from-gray-50 to-purple-50 border-b border-gray-100">
                            { region }
                          </div>
                          { locs.map((location) => (
                            <button
                              key={ location.slug }
                              onClick={ () => {
                                setSelectedLocation(location);
                                setShowDropdown(false);
                              } }
                              className="w-full px-6 py-4 text-left hover:bg-gradient-to-r hover:from-purple-50 hover:to-cyan-50 text-gray-800 transition-all duration-200 border-b border-gray-50 last:border-b-0 group"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium group-hover:text-purple-700">
                                    { location.name }
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    { location.count } events
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                              </div>
                            </button>
                          )) }
                        </div>
                      )) }
                  </div>
                </div>
              ) }
            </div>

            <button
              onClick={ handleContinue }
              disabled={ !selectedLocation }
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center justify-center gap-2">
                <span>Let's Explore</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
