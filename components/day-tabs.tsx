/**
 * DayTabs
 *
 * Renders the sticky tab bar (one tab per day) and the content panel
 * for the currently selected day. Each day panel shows a heading with
 * the date and stop count, followed by a grid of ItineraryCard components.
 *
 * This component owns the tab-switching state via the shadcn <Tabs>
 * primitive, which handles keyboard navigation and ARIA roles for us.
 */

"use client"

import { format, parseISO } from "date-fns"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ItineraryCard } from "@/components/itinerary-card"
import type { Day, Traveler } from "@/lib/types"

interface DayTabsProps {
  /** All days in the itinerary, in order. */
  days: Day[]
  /** The traveler who is currently logged in. Used for comment authorship. */
  currentUser: Traveler
  /** Every traveler on the trip. Used to resolve comment author avatars. */
  travelers: Traveler[]
}

export function DayTabs({ days, currentUser, travelers }: DayTabsProps) {
  // The first day's date string is the default selected tab value.
  const firstDayDate = days[0].date

  return (
    <Tabs defaultValue={firstDayDate}>
      {/* ------------------------------------------------------------------ */}
      {/* Sticky tab bar                                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-background/95 backdrop-blur-sm border-b border-border mb-6">
        <TabsList className="flex h-auto gap-1 bg-transparent p-0 w-full sm:w-auto">
          {days.map((day, index) => {
            // Format the date for screen-reader-friendly labels and display.
            const dateLabel = format(parseISO(day.date), "EEE, MMM d")

            return (
              <TabsTrigger
                key={day.date}
                value={day.date}
                className="flex-1 sm:flex-none flex flex-col items-start sm:items-center gap-0.5 px-4 py-2.5 rounded-lg text-left sm:text-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                {/* "Day 1", "Day 2", … */}
                <span className="text-xs font-medium">Day {index + 1}</span>

                {/* Full date on wider screens */}
                <span className="text-xs opacity-80 hidden sm:block">{dateLabel}</span>

                {/* Day title on narrow screens (where the date is hidden) */}
                <span className="text-xs opacity-70 line-clamp-1 sm:hidden">
                  {day.title}
                </span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* One content panel per day                                           */}
      {/* ------------------------------------------------------------------ */}
      {days.map((day) => (
        <TabsContent
          key={day.date}
          value={day.date}
          className="mt-0 focus-visible:outline-none"
        >
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

          {/* Grid of cards — 1 column on mobile, 2 on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {day.items.map((item) => (
              <ItineraryCard
                key={item.id}
                item={item}
                currentUser={currentUser}
                travelers={travelers}
              />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
