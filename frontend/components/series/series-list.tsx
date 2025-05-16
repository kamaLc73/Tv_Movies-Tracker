"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { getAllSeries, getSeriesByStatus, getSeriesByRatingRange } from "@/lib/api"
import type { Series } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { Star } from "lucide-react"
import { SeriesActions } from "./series-actions"

export default function SeriesList() {
  const [series, setSeries] = useState<Series[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  const status = searchParams.get("status")
  const minRating = searchParams.get("minRating")
  const maxRating = searchParams.get("maxRating")
  const sortBy = searchParams.get("sortBy") || "title"
  const sortOrder = searchParams.get("sortOrder") || "asc"

  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true)
      try {
        let data: Series[]

        if (status) {
          data = await getSeriesByStatus(status)
        } else if (minRating && maxRating) {
          data = await getSeriesByRatingRange(Number.parseFloat(minRating), Number.parseFloat(maxRating))
        } else {
          data = await getAllSeries()
        }

        // Sort the data
        data.sort((a, b) => {
          if (sortBy === "title") {
            return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
          } else if (sortBy === "rating") {
            const ratingA = a.rating || 0
            const ratingB = b.rating || 0
            return sortOrder === "asc" ? ratingA - ratingB : ratingB - ratingA
          } else if (sortBy === "last_watched_date") {
            const dateA = a.last_watched_date ? new Date(a.last_watched_date).getTime() : 0
            const dateB = b.last_watched_date ? new Date(b.last_watched_date).getTime() : 0
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA
          }
          return 0
        })

        setSeries(data)
      } catch (error) {
        console.error("Failed to fetch series:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSeries()
  }, [status, minRating, maxRating, sortBy, sortOrder])

  if (loading) {
    return <LoadingSpinner />
  }

  if (series.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No series found</h3>
        <p className="text-muted-foreground mb-4">Try adjusting your filters or add a new series.</p>
        <Button asChild>
          <Link href="/series/add">Add Series</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {series.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg truncate" title={item.title}>
                <Link href={`/series/${item.id}`} className="hover:underline">
                  {item.title}
                </Link>
              </CardTitle>
              {item.rating && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  {item.rating.toFixed(1)}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={
                  item.status === "Watched" ? "success" : item.status === "Half-watched" ? "warning" : "secondary"
                }
              >
                {item.status}
              </Badge>
              {item.rewatch_count > 0 && <Badge variant="outline">{item.rewatch_count}x rewatched</Badge>}
            </div>
          </CardHeader>
          <CardContent className="text-sm">
            {item.seasons && (
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Seasons:</span>
                <span>{item.seasons}</span>
              </div>
            )}
            {item.episodes && (
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Episodes:</span>
                <span>{item.episodes}</span>
              </div>
            )}
            {item.current_season && (
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Current Season:</span>
                <span>{item.current_season}</span>
              </div>
            )}
            {item.current_episode && (
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Current Episode:</span>
                <span>{item.current_episode}</span>
              </div>
            )}
            {item.last_watched_date && (
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Last watched:</span>
                <span>{formatDate(item.last_watched_date)}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-1">
            <SeriesActions
              series={item}
              onUpdate={() => {
                // Refresh the list after an action
                getAllSeries().then(setSeries)
              }}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
