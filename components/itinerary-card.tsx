/**
 * ItineraryCard
 *
 * Displays a single stop on the itinerary (hotel, restaurant, landmark, etc.).
 * Each card shows:
 *   - A cover photo with a type badge overlaid in the top-left corner.
 *   - The stop's name, scheduled time, duration, star rating, description,
 *     and any tags.
 *   - A collapsible CommentSection at the bottom where travelers can chat.
 *
 * The card itself is stateless — all interactive state lives inside the
 * child components (CommentSection manages comments on its own).
 */

"use client"

import { Clock, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CommentSection } from "@/components/comment-section"
import { cn } from "@/lib/utils"
import { getItemTypeConfig } from "@/lib/itinerary-helpers"
import type { ItineraryItem, Traveler } from "@/lib/types"

interface ItineraryCardProps {
  /** The itinerary stop to display. */
  item: ItineraryItem
  /** The logged-in traveler — passed down to CommentSection for authorship. */
  currentUser: Traveler
  /** All travelers — passed down to CommentSection for avatar lookup. */
  travelers: Traveler[]
}

export function ItineraryCard({ item, currentUser, travelers }: ItineraryCardProps) {
  // Look up the display config (label, icon, colour) for this item's type.
  const typeConfig = getItemTypeConfig(item.type)
  const TypeIcon = typeConfig.icon

  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* ------------------------------------------------------------------ */}
      {/* Cover photo with type badge overlay                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        <img
          src={item.photo.url}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Type badge (e.g. "Museum", "Restaurant") sits on top of the photo */}
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
              typeConfig.color
            )}
          >
            <TypeIcon className="w-3.5 h-3.5" />
            {typeConfig.label}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Card body                                                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-4 space-y-3">
        {/* Name + scheduled time */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-card-foreground leading-snug text-pretty">
            {item.name}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground shrink-0 pt-0.5">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs tabular-nums">{item.startTime}</span>
            {/* Show a plain "overnight" label, otherwise show the duration string */}
            <span className="text-xs text-muted-foreground/70">
              · {item.duration === "overnight" ? "overnight" : item.duration}
            </span>
          </div>
        </div>

        {/* Star rating */}
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium">{item.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">
            ({item.reviewCount.toLocaleString()} reviews)
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {item.description}
        </p>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Comments — extracted into its own component for clarity */}
        <CommentSection
          itemId={item.id}
          initialNotes={item.notes ?? []}
          currentUser={currentUser}
          travelers={travelers}
        />
      </div>
    </article>
  )
}
