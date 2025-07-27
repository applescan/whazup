"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { useLocations } from "@/hooks/useLocations";
import { Region } from "@/types/Event";

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

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  const { locations, loading, error } = useLocations();
  const [selectedLocation, setSelectedLocation] =
    useState<GroupedLocation | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [grouped, setGrouped] = useState<Record<string, GroupedLocation[]>>({});

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black mb-4 tracking-wider">
          <span className="inline-block transform -rotate-2 text-blue-200">
            W
          </span>
          <span className="inline-block transform rotate-1 text-blue-300">
            H
          </span>
          <span className="inline-block transform -rotate-1 text-blue-200">
            A
          </span>
          <span className="inline-block transform rotate-2 text-blue-300">
            Z
          </span>
          <span className="inline-block transform -rotate-1 text-blue-200">
            U
          </span>
          <span className="inline-block transform rotate-1 text-blue-300">
            P
          </span>
        </h1>
        <p className="text-pink-200 text-lg font-medium tracking-widest">
          F I N D &nbsp;&nbsp; Y O U R &nbsp;&nbsp; E V E N T
        </p>
      </div>

      <div className="w-full max-w-sm space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">
            Choose a location to continue
          </h2>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-4 rounded-xl flex items-center justify-between shadow-lg hover:bg-white/95 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="font-medium">
                  {selectedLocation?.name || "Select location"}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-10 max-h-96 overflow-y-auto">
                {loading && (
                  <div className="px-4 py-3 text-gray-500 font-medium">
                    Loading...
                  </div>
                )}
                {error && (
                  <div className="px-4 py-3 text-red-500 font-medium">
                    Error: {error}
                  </div>
                )}
                {!loading &&
                  Object.entries(grouped).map(([region, locs]) => (
                    <div key={region}>
                      <div className="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-100">
                        {region}
                      </div>
                      {locs.map((location) => (
                        <button
                          key={location.slug}
                          onClick={() => {
                            setSelectedLocation(location);
                            setShowDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-150"
                        >
                          {location.name} ({location.count})
                        </button>
                      ))}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedLocation}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
        >
          Let&apos;s go!
        </button>
      </div>

      <div className="flex gap-6 mt-16 text-sm text-white/70">
        <button className="hover:text-white transition-colors">
          Terms of use
        </button>
        <button className="hover:text-white transition-colors">
          Privacy Policy
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
