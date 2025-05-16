import { Suspense } from "react"
import { SeriesDetail } from "@/components/series/series-detail"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function SeriesDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <SeriesDetail id={Number.parseInt(params.id)} />
      </Suspense>
    </main>
  )
}
