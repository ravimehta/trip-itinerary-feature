"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { TripHeader } from "@/components/trip-header"
import { TravelerModal } from "@/components/traveler-modal"
import { ItineraryCard } from "@/components/itinerary-card"
import type { Itinerary, Traveler } from "@/lib/types"

const CURRENT_USER_ID = "traveler-1"

interface ItineraryPageProps {
  itinerary: Itinerary
}

export function ItineraryPage({ itinerary }: ItineraryPageProps) {
  const [selectedTraveler, setSelectedTraveler] = useState<Traveler | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const currentUser = itinerary.travelers.find((t) => t.id === CURRENT_USER_ID)!

  function handleTravelerClick(traveler: Traveler) {
    setSelectedTraveler(traveler)
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Logged-in user indicator */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 bg-background/90 backdrop-blur-sm border border-border rounded-full pl-1 pr-3 py-1 shadow-sm">
        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-border">
          <img
            src={currentUser.avatar.url}
            alt={currentUser.firstName}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-sm font-medium text-foreground leading-none">
          {currentUser.firstName} {currentUser.lastName}
        </span>
      </div>

      {/* Trip header */}
      <TripHeader
        itinerary={itinerary}
        onTravelerClick={handleTravelerClick}
      />

      {/* Day tabs & itinerary */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Tabs defaultValue={itinerary.days[0].date}>
          {/* Tab bar */}
          <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-background/95 backdrop-blur-sm border-b border-border mb-6">
            <TabsList className="flex h-auto gap-1 bg-transparent p-0 w-full sm:w-auto">
              {itinerary.days.map((day, index) => {
                const dateLabel = format(parseISO(day.date), "EEE, MMM d")
                return (
                  <TabsTrigger
                    key={day.date}
                    value={day.date}
                    className="flex-1 sm:flex-none flex flex-col items-start sm:items-center gap-0.5 px-4 py-2.5 rounded-lg text-left sm:text-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground hover:text-foreground transition-colors duration-150"
                  >
                    <span className="text-xs font-medium">Day {index + 1}</span>
                    <span className="text-xs opacity-80 hidden sm:block">{dateLabel}</span>
                    <span className="text-xs opacity-70 line-clamp-1 sm:hidden">{day.title}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>

          {/* Tab content */}
          {itinerary.days.map((day) => (
            <TabsContent key={day.date} value={day.date} className="mt-0 focus-visible:outline-none">
              {/* Day heading */}
              <div className="mb-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">
                  {format(parseISO(day.date), "EEEE, MMMM d, yyyy")}
                </p>
                <h2 className="text-2xl font-semibold text-foreground">{day.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {day.items.length} {day.items.length === 1 ? "stop" : "stops"}
                </p>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {day.items.map((item) => (
                  <ItineraryCard
                    key={item.id}
                    item={item}
                    currentUser={currentUser}
                    travelers={itinerary.travelers}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Traveler modal */}
      <TravelerModal
        traveler={selectedTraveler}
        currentUserId={CURRENT_USER_ID}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  )
}
