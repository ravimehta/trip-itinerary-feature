import itineraryData from "@/data/itinerary.json"
import { ItineraryPage } from "@/components/itinerary-page"
import type { Itinerary } from "@/lib/types"

export default function Page() {
  const itinerary = (itineraryData as { itinerary: Itinerary }).itinerary
  return <ItineraryPage itinerary={itinerary} />
}
