import { Suspense } from "react"
import { SeriesForm } from "@/components/series/series-form"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function EditSeriesPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Series</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <SeriesForm id={Number.parseInt(params.id)} />
      </Suspense>
    </main>
  )
}
