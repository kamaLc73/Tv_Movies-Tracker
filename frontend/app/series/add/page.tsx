import { SeriesForm } from "@/components/series/series-form"

export default function AddSeriesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Series</h1>
      <SeriesForm />
    </main>
  )
}
