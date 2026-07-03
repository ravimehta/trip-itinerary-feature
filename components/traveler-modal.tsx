"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Traveler } from "@/lib/types"

interface TravelerModalProps {
  traveler: Traveler | null
  currentUserId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TravelerModal({
  traveler,
  currentUserId,
  open,
  onOpenChange,
}: TravelerModalProps) {
  if (!traveler) return null

  const isCurrentUser = traveler.id === currentUserId

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden">
        {/* Profile banner */}
        <div className="relative h-28 bg-muted">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-100 dark:from-stone-800 dark:to-stone-700" />
        </div>

        {/* Avatar */}
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex items-end justify-between mb-4">
            <div className="relative w-20 h-20 rounded-full border-4 border-background overflow-hidden shrink-0 shadow-sm">
              <img
                src={traveler.avatar.url}
                alt={`${traveler.firstName} ${traveler.lastName}`}
                className="w-full h-full object-cover"
              />
            </div>
            {isCurrentUser && (
              <Badge variant="secondary" className="mb-1 text-xs">
                You
              </Badge>
            )}
          </div>

          <DialogHeader className="text-left space-y-1 mb-4">
            <DialogTitle className="text-xl font-semibold">
              {traveler.firstName} {traveler.lastName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                Travel Style
              </p>
              <Badge variant="outline" className="text-sm font-normal">
                {traveler.travelStyle}
              </Badge>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                Traveler ID
              </p>
              <p className="text-sm text-muted-foreground font-mono">
                {traveler.id}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
