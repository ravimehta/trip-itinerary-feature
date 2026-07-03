"use client"

import { useState, useRef } from "react"
import { format, parseISO } from "date-fns"
import {
  Clock,
  Star,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  Bed,
  Utensils,
  Camera,
  Landmark,
  Coffee,
  Waves,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ItineraryItem, Note, Traveler } from "@/lib/types"

interface ItineraryCardProps {
  item: ItineraryItem
  currentUser: Traveler
  travelers: Traveler[]
}

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  accommodation: { label: "Hotel", icon: Bed, color: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  restaurant: { label: "Restaurant", icon: Utensils, color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  dining: { label: "Dining", icon: Utensils, color: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  museum: { label: "Museum", icon: Landmark, color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  activity: { label: "Activity", icon: Waves, color: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300" },
  landmark: { label: "Landmark", icon: Camera, color: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
  breakfast: { label: "Breakfast", icon: Coffee, color: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
}

function formatTimestamp(ts: string) {
  return format(parseISO(ts), "MMM d, h:mm a")
}

function getTravelerAvatar(travelers: Traveler[], authorId: string) {
  return travelers.find((t) => t.id === authorId)
}

export function ItineraryCard({ item, currentUser, travelers }: ItineraryCardProps) {
  const [notes, setNotes] = useState<Note[]>(item.notes ?? [])
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const typeConfig = TYPE_CONFIG[item.type] ?? {
    label: item.type,
    icon: Camera,
    color: "bg-muted text-muted-foreground",
  }
  const TypeIcon = typeConfig.icon

  function handleSubmit() {
    const trimmed = inputValue.trim()
    if (!trimmed) return

    const newNote: Note = {
      author: currentUser.id,
      authorName: currentUser.firstName,
      timestamp: new Date().toISOString(),
      message: trimmed,
    }
    setNotes((prev) => [...prev, newNote])
    setInputValue("")
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && !(e.keyCode === 229)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Card image */}
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        <img
          src={item.photo.url}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Type badge over image */}
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

      {/* Card body */}
      <div className="p-4 space-y-3">
        {/* Name & time */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-card-foreground leading-snug text-pretty">
            {item.name}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground shrink-0 pt-0.5">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs tabular-nums">{item.startTime}</span>
            {item.duration !== "overnight" && (
              <span className="text-xs text-muted-foreground/70">· {item.duration}</span>
            )}
            {item.duration === "overnight" && (
              <span className="text-xs text-muted-foreground/70">· overnight</span>
            )}
          </div>
        </div>

        {/* Rating */}
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

        {/* Comments toggle */}
        <div className="pt-1 border-t border-border">
          <button
            onClick={() => setCommentsOpen((prev) => !prev)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 py-1"
            aria-expanded={commentsOpen}
            aria-controls={`comments-${item.id}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>
              {notes.length === 0
                ? "No comments yet"
                : `${notes.length} comment${notes.length !== 1 ? "s" : ""}`}
            </span>
            {commentsOpen ? (
              <ChevronUp className="w-3.5 h-3.5 ml-auto" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 ml-auto" />
            )}
          </button>

          {/* Comments section */}
          {commentsOpen && (
            <div id={`comments-${item.id}`} className="mt-3 space-y-3">
              {/* Existing comments */}
              {notes.length > 0 && (
                <div className="space-y-3">
                  {notes.map((note, i) => {
                    const traveler = getTravelerAvatar(travelers, note.author)
                    const isCurrentUserComment = note.author === currentUser.id

                    return (
                      <div key={i} className="flex gap-2.5">
                        {/* Avatar */}
                        <div className="shrink-0 w-7 h-7 rounded-full overflow-hidden border border-border">
                          {traveler ? (
                            <img
                              src={traveler.avatar.url}
                              alt={traveler.firstName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center text-xs font-medium">
                              {note.authorName.charAt(0)}
                            </div>
                          )}
                        </div>

                        {/* Bubble */}
                        <div className="flex-1 min-w-0">
                          <div
                            className={cn(
                              "rounded-xl px-3 py-2 text-sm",
                              isCurrentUserComment
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            )}
                          >
                            <p className="font-medium text-xs mb-0.5 opacity-70">
                              {note.authorName}
                            </p>
                            <p className="leading-relaxed break-words">{note.message}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 px-1">
                            {formatTimestamp(note.timestamp)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {notes.length === 0 && (
                <p className="text-xs text-muted-foreground italic text-center py-2">
                  Be the first to comment!
                </p>
              )}

              {/* New comment input */}
              <div className="flex gap-2 items-end pt-1">
                <div className="shrink-0 w-7 h-7 rounded-full overflow-hidden border border-border">
                  <img
                    src={currentUser.avatar.url}
                    alt={currentUser.firstName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex gap-2 items-end">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a comment..."
                    rows={1}
                    className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[36px] max-h-28 leading-relaxed"
                    style={{ fieldSizing: "content" } as React.CSSProperties}
                    aria-label="Add a comment"
                  />
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!inputValue.trim()}
                    className="shrink-0 h-9 w-9 p-0"
                    aria-label="Submit comment"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
