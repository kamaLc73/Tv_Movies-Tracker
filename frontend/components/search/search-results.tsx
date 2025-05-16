"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { searchSeries } from "@/lib/api"
import type { Series } from "@/lib/types"
import { Star } from "lucide-react"

interface SearchResultsProps {
  query: string
}

export function SearchResults({ query }: SearchResultsProps) {
  const [results, setResults] = useState<Series[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      try {
        const data = await searchSeries(query)
        setResults(data)
      } catch (error) {
        console.error("Failed to search series:", error)
      } finally {
        setLoading(false)
      }
    }

    if (query) {
      fetchResults()
    } else {
      setResults([])
      setLoading(false)
    }
  }, [query])

  if (loading) {
    return <LoadingSpinner />
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">No results found</h3>
        <p className="text-muted-foreground mb-4">No series matching "{query}" were found.</p>
        <Button asChild>
          <Link href="/series/add">Add New Series</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Found {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
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
              <Badge
                variant={
                  item.status === "Watched" ? "success" : item.status === "Half-watched" ? "warning" : "secondary"
                }
                className="mt-2"
              >
                {item.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <Button asChild size="sm">
                <Link href={`/series/${item.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
