"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { getSeries } from "@/lib/api"
import type { Series } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Edit, Star } from "lucide-react"
import { SeriesActions } from "./series-actions"

interface SeriesDetailProps {
  id: number
}

export function SeriesDetail({ id }: SeriesDetailProps) {
  const router = useRouter()
  const [series, setSeries] = useState<Series | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const data = await getSeries(id)
        setSeries(data)
      } catch (error) {
        console.error("Failed to fetch series:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSeries()
  }, [id])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!series) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Series not found</h3>
        <p className="text-muted-foreground mb-4">The series you're looking for doesn't exist or has been deleted.</p>
        <Button asChild>
          <Link href="/series">Back to Series List</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/series/edit/${series.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">{series.title}</CardTitle>
            {series.rating && (
              <Badge variant="outline" className="flex items-center gap-1 text-lg px-3 py-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                {series.rating.toFixed(1)}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant={
                series.status === "Watched" ? "success" : series.status === "Half-watched" ? "warning" : "secondary"
              }
              className="px-3 py-1"
            >
              {series.status}
            </Badge>
            {series.rewatch_count > 0 && (
              <Badge variant="outline" className="px-3 py-1">
                {series.rewatch_count}x rewatched
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {series.seasons !== null && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Seasons</h4>
                <p className="text-lg">{series.seasons}</p>
              </div>
            )}

            {series.episodes !== null && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Episodes</h4>
                <p className="text-lg">{series.episodes}</p>
              </div>
            )}

            {series.current_season !== null && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Current Season</h4>
                <p className="text-lg">{series.current_season}</p>
              </div>
            )}

            {series.current_episode !== null && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Current Episode</h4>
                <p className="text-lg">{series.current_episode}</p>
              </div>
            )}
          </div>

          {series.last_watched_date && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Watched</h4>
              <p>{formatDate(series.last_watched_date, true)}</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <SeriesActions
              series={series}
              onUpdate={() => {
                // Refresh the data
                getSeries(id).then(setSeries)
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
