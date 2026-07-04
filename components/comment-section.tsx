/**
 * CommentSection
 *
 * Renders a collapsible list of comments (called "notes" in the data model)
 * and a text input that lets the current user post a new comment.
 *
 * State is managed locally: the comment list starts from the notes that come
 * in via props, and new comments are appended in memory (no server call yet).
 *
 * Key UX details:
 * - Press Enter to submit (Shift+Enter adds a new line instead).
 * - The input is skipped when the CJK IME composition is active (isComposing).
 * - The input auto-grows with the text content via `fieldSizing: "content"`.
 */

"use client"

import { useState, useRef } from "react"
import { MessageSquare, ChevronDown, ChevronUp, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatTimestamp, findTravelerById } from "@/lib/itinerary-helpers"
import type { Note, Traveler } from "@/lib/types"

interface CommentSectionProps {
  /** Unique ID of the parent itinerary item — used for the aria-controls attribute. */
  itemId: string
  /** The notes (comments) that already exist for this item. */
  initialNotes: Note[]
  /** The traveler who is currently logged in. Their comments are styled differently. */
  currentUser: Traveler
  /** All travelers — used to look up avatar images for comment authors. */
  travelers: Traveler[]
}

export function CommentSection({
  itemId,
  initialNotes,
  currentUser,
  travelers,
}: CommentSectionProps) {
  // The full list of comments for this item (starts with existing ones).
  const [notes, setNotes] = useState<Note[]>(initialNotes)

  // Whether the comment panel is expanded or collapsed.
  const [isOpen, setIsOpen] = useState(false)

  // The text the user is currently typing.
  const [inputValue, setInputValue] = useState("")

  // A ref so we can return focus to the textarea after submitting.
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // -------------------------------------------------------------------------
  // Submit a new comment
  // -------------------------------------------------------------------------

  function handleSubmit() {
    const trimmed = inputValue.trim()
    // Do nothing if the input is blank.
    if (!trimmed) return

    // Build the new comment object using the current user's info and a
    // fresh timestamp.
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

  // Submit on Enter, but allow Shift+Enter for new lines.
  // Also skip submission while the CJK IME is composing characters.
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing &&
      !(e.keyCode === 229)
    ) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const commentCount = notes.length
  const toggleLabel =
    commentCount === 0
      ? "No comments yet"
      : `${commentCount} comment${commentCount !== 1 ? "s" : ""}`

  return (
    <div className="pt-1 border-t border-border">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 py-1 w-full"
        aria-expanded={isOpen}
        aria-controls={`comments-${itemId}`}
      >
        <MessageSquare className="w-4 h-4 shrink-0" />
        <span>{toggleLabel}</span>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 ml-auto" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 ml-auto" />
        )}
      </button>

      {/* Expandable comment list + input */}
      {isOpen && (
        <div id={`comments-${itemId}`} className="mt-3 space-y-3">
          {/* Existing comments */}
          {notes.length > 0 ? (
            <div className="space-y-3">
              {notes.map((note, i) => {
                const traveler = findTravelerById(travelers, note.author)
                const isCurrentUser = note.author === currentUser.id

                return (
                  <div key={i} className="flex gap-2.5">
                    {/* Author avatar */}
                    <div className="shrink-0 w-7 h-7 rounded-full overflow-hidden border border-border">
                      {traveler ? (
                        <img
                          src={traveler.avatar.url}
                          alt={traveler.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        // Fallback: show the first letter of the author's name.
                        <div className="w-full h-full bg-muted flex items-center justify-center text-xs font-medium">
                          {note.authorName.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Comment bubble */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={cn(
                          "rounded-xl px-3 py-2 text-sm",
                          // The current user's comments use the primary colour
                          // so they stand out from other travelers' comments.
                          isCurrentUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        )}
                      >
                        <p className="font-medium text-xs mb-0.5 opacity-70">
                          {note.authorName}
                        </p>
                        <p className="leading-relaxed break-words">{note.message}</p>
                      </div>
                      {/* Timestamp below the bubble */}
                      <p className="text-xs text-muted-foreground mt-1 px-1">
                        {formatTimestamp(note.timestamp)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic text-center py-2">
              Be the first to comment!
            </p>
          )}

          {/* New comment input row */}
          <div className="flex gap-2 items-end pt-1">
            {/* Current user's avatar */}
            <div className="shrink-0 w-7 h-7 rounded-full overflow-hidden border border-border">
              <img
                src={currentUser.avatar.url}
                alt={currentUser.firstName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Textarea + send button */}
            <div className="flex-1 flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a comment…"
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
  )
}
