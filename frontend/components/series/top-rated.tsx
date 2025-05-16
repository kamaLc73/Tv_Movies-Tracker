"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { getAllSeries } from "@/lib/api"
import type { Series } from "@/lib/types"
import { Star } from "lucide-react"

export function TopRatedList() {
  const [series, setSeries] = useState<Series[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const data = await getAllSeries()
        // Filter series with ratings
        const ratedSeries = data.filter((s) => s.rating !== null)
        // Sort by rating (highest first)
        ratedSeries.sort((a, b) => {
          const ratingA = a.rating || 0
          const ratingB = b.rating || 0
          return ratingB - ratingA
        })
        // Take the first 5
        setSeries(ratedSeries.slice(0, 5))
      } catch (error) {
        console.error("Failed to fetch top rated series:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSeries()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  if (series.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No rated series found.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {series.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg truncate" title={item.title}>
                <Link href={`/series/${item.id}`} className="hover:underline">
                  {item.title}
                </Link>
              </CardTitle>
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                {item.rating?.toFixed(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Status: {item.status}
              {item.rewatch_count > 0 && ` • Rewatched ${item.rewatch_count}x`}
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href={`/series/${item.id}`}>View Details</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
