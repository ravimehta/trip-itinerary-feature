export interface Note {
  author: string
  authorName: string
  timestamp: string
  message: string
}

export interface ItineraryItem {
  id: string
  name: string
  type: string
  startTime: string
  duration: string
  rating: number
  reviewCount: number
  tags: string[]
  photo: { url: string }
  description: string
  notes?: Note[]
}

export interface Day {
  date: string
  title: string
  items: ItineraryItem[]
}

export interface Traveler {
  id: string
  firstName: string
  lastName: string
  avatar: { url: string }
  travelStyle: string
}

export interface Itinerary {
  id: string
  name: string
  destination: string
  coverPhoto: { url: string; description: string }
  dateRange: { startDate: string; endDate: string }
  travelers: Traveler[]
  days: Day[]
  totalItems: number
  createdAt: string
  lastModified: string
}
