import { Suspense } from "react"
import SeriesList from "@/components/series/series-list"
import { SeriesFilters } from "@/components/series/series-filters"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function SeriesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Series</h1>
      <SeriesFilters />
      <Suspense fallback={<LoadingSpinner />}>
        <SeriesList />
      </Suspense>
    </main>
  )
}
