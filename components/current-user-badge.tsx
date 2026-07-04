/**
 * CurrentUserBadge
 *
 * A small floating pill fixed to the top-right corner of the screen.
 * It shows the logged-in traveler's avatar and full name so the user
 * always knows which account they are viewing the itinerary as.
 */

"use client"

import type { Traveler } from "@/lib/types"

interface CurrentUserBadgeProps {
  /** The traveler object representing the currently logged-in user. */
  user: Traveler
}

export function CurrentUserBadge({ user }: CurrentUserBadgeProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 bg-background/90 backdrop-blur-sm border border-border rounded-full pl-1 pr-3 py-1 shadow-sm">
      {/* Avatar */}
      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-border">
        <img
          src={user.avatar.url}
          alt={user.firstName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name */}
      <span className="text-sm font-medium text-foreground leading-none">
        {user.firstName} {user.lastName}
      </span>
    </div>
  )
}
