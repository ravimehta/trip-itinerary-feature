/**
 * itinerary-helpers.ts
 *
 * Small, reusable functions used across the itinerary feature.
 * Keeping helpers here means components stay focused on rendering,
 * and these utilities are easy to test in isolation.
 */

import { format, parseISO } from "date-fns"
import { Bed, Utensils, Camera, Landmark, Coffee, Waves } from "lucide-react"
import type { ComponentType } from "react"
import type { Traveler } from "@/lib/types"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Shape of the display config for each itinerary-item type. */
export interface ItemTypeConfig {
  /** Human-readable label shown in the badge (e.g. "Hotel", "Museum"). */
  label: string
  /** Lucide icon component rendered inside the badge. */
  icon: ComponentType<{ className?: string }>
  /** Tailwind colour classes for the badge background and text. */
  color: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Maps each item `type` string to its display label, icon, and colours.
 * Add new types here when the data model is extended.
 */
export const ITEM_TYPE_CONFIG: Record<string, ItemTypeConfig> = {
  accommodation: {
    label: "Hotel",
    icon: Bed,
    color: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  restaurant: {
    label: "Restaurant",
    icon: Utensils,
    color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  dining: {
    label: "Dining",
    icon: Utensils,
    color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  museum: {
    label: "Museum",
    icon: Landmark,
    color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  activity: {
    label: "Activity",
    icon: Waves,
    color: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  },
  landmark: {
    label: "Landmark",
    icon: Camera,
    color: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  },
  breakfast: {
    label: "Breakfast",
    icon: Coffee,
    color: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  },
}

/** Fallback config used when the item type is not in ITEM_TYPE_CONFIG. */
export const FALLBACK_TYPE_CONFIG: ItemTypeConfig = {
  label: "Stop",
  icon: Camera,
  color: "bg-muted text-muted-foreground",
}

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Returns the display config for a given item type string.
 * Falls back to a generic config when the type is unknown.
 *
 * @example
 * const config = getItemTypeConfig("museum")
 * // { label: "Museum", icon: Landmark, color: "..." }
 */
export function getItemTypeConfig(type: string): ItemTypeConfig {
  return ITEM_TYPE_CONFIG[type] ?? { ...FALLBACK_TYPE_CONFIG, label: type }
}

/**
 * Formats an ISO timestamp string into a readable date + time string.
 * Used for displaying when a comment was posted.
 *
 * @example
 * formatTimestamp("2025-04-10T14:30:00Z") // "Apr 10, 2:30 PM"
 */
export function formatTimestamp(isoString: string): string {
  return format(parseISO(isoString), "MMM d, h:mm a")
}

/**
 * Looks up a traveler by their ID from a list of travelers.
 * Returns `undefined` if no match is found.
 *
 * @example
 * const traveler = findTravelerById(travelers, "traveler-2")
 */
export function findTravelerById(
  travelers: Traveler[],
  id: string
): Traveler | undefined {
  return travelers.find((t) => t.id === id)
}
