/**
 * ItineraryPage
 *
 * The root client component for the trip itinerary view.
 * It acts as the "glue" layer: it receives the full itinerary data,
 * tracks which traveler's profile modal is open, and renders the three
 * major UI sections:
 *
 *   1. CurrentUserBadge — fixed pill in the top-right corner.
 *   2. TripHeader       — hero image, trip name, dates, and traveler avatars.
 *   3. DayTabs          — sticky tab bar + day content panels.
 *   4. TravelerModal    — dialog that slides in when an avatar is clicked.
 *
 * Keeping this file small and focused (just wiring things together) makes
 * it easy to follow the data flow at a glance.
 */

"use client"

import { useState } from "react"
import { TripHeader } from "@/components/trip-header"
import { CurrentUserBadge } from "@/components/current-user-badge"
import { DayTabs } from "@/components/day-tabs"
import { TravelerModal } from "@/components/traveler-modal"
import type { Itinerary, Traveler } from "@/lib/types"

// The ID of the traveler who is currently "logged in".
// In a real app this would come from your auth system.
const CURRENT_USER_ID = "traveler-1"

interface ItineraryPageProps {
  /** The full itinerary loaded from data/itinerary.json. */
  itinerary: Itinerary
}

export function ItineraryPage({ itinerary }: ItineraryPageProps) {
  // Which traveler's profile modal is open (null = closed).
  const [selectedTraveler, setSelectedTraveler] = useState<Traveler | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Find the logged-in traveler record (used by badge + comment sections).
  const currentUser = itinerary.travelers.find((t) => t.id === CURRENT_USER_ID)!

  // Called when an avatar is clicked in the header.
  function handleTravelerClick(traveler: Traveler) {
    setSelectedTraveler(traveler)
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Floating "logged-in as" badge in the top-right corner */}
      <CurrentUserBadge user={currentUser} />

      {/* 2. Hero header with cover photo, trip name, dates, and avatars */}
      <TripHeader
        itinerary={itinerary}
        onTravelerClick={handleTravelerClick}
      />

      {/* 3. Sticky day tabs and the grid of itinerary cards */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <DayTabs
          days={itinerary.days}
          currentUser={currentUser}
          travelers={itinerary.travelers}
        />
      </main>

      {/* 4. Modal that shows a traveler's profile when their avatar is clicked */}
      <TravelerModal
        traveler={selectedTraveler}
        currentUserId={CURRENT_USER_ID}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  )
}
