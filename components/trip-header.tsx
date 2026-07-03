"use client"

import { format, parseISO } from "date-fns"
import { MapPin, Calendar } from "lucide-react"
import type { Itinerary, Traveler } from "@/lib/types"

interface TripHeaderProps {
  itinerary: Itinerary
  onTravelerClick: (traveler: Traveler) => void
}

export function TripHeader({ itinerary, onTravelerClick }: TripHeaderProps) {
  const { name, destination, coverPhoto, dateRange, travelers } = itinerary
  const start = format(parseISO(dateRange.startDate), "MMM d")
  const end = format(parseISO(dateRange.endDate), "MMM d, yyyy")

  return (
    <header className="relative w-full">
      {/* Cover photo */}
      <div className="relative w-full" style={{ aspectRatio: "16/7" }}>
        <img
          src={coverPhoto.url}
          alt={coverPhoto.description}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 md:px-10 md:pb-8">
          <div className="flex flex-col gap-3">
            {/* Destination */}
            <div className="flex items-center gap-1.5 text-white/80">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="text-sm font-medium tracking-wide uppercase">
                {destination}
              </span>
            </div>

            {/* Trip name */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white text-balance leading-tight">
              {name}
            </h1>

            {/* Date range & travelers row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mt-1">
              <div className="flex items-center gap-1.5 text-white/80">
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="text-sm">
                  {start} – {end}
                </span>
              </div>

              {/* Traveler avatars */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2.5">
                  {travelers.map((traveler) => (
                    <button
                      key={traveler.id}
                      onClick={() => onTravelerClick(traveler)}
                      className="relative w-9 h-9 rounded-full border-2 border-white/80 overflow-hidden hover:z-10 hover:scale-110 hover:border-white transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1"
                      aria-label={`View ${traveler.firstName} ${traveler.lastName}'s profile`}
                    >
                      <img
                        src={traveler.avatar.url}
                        alt={`${traveler.firstName} ${traveler.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm text-white/70">
                  {travelers.length} travelers
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
