"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Star, Clock, ListChecks } from "lucide-react"
import { getAverageRating, getCountByStatus } from "@/lib/api"
import { RecentlyWatchedList } from "@/components/series/recently-watched"
import { TopRatedList } from "@/components/series/top-rated"

export default function Dashboard() {
  const [stats, setStats] = useState({
    averageRating: 0,
    statusCounts: { Watched: 0, "Half-watched": 0, Upcoming: 0 },
    totalSeries: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [avgRating, countByStatus] = await Promise.all([getAverageRating(), getCountByStatus()])

        const total = Object.values(countByStatus).reduce((sum, count) => sum + count, 0)

        setStats({
          averageRating: avgRating.average_rating || 0,
          statusCounts: countByStatus,
          totalSeries: total,
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}/10</div>
            <Progress value={stats.averageRating * 10} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Series</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSeries}</div>
            <p className="text-xs text-muted-foreground mt-2">In your collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Watched Series</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.statusCounts.Watched || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {(((stats.statusCounts.Watched || 0) / stats.totalSeries) * 100).toFixed(0)}% of your collection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Series</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.statusCounts.Upcoming || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">On your watchlist</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="recent">Recently Watched</TabsTrigger>
            <TabsTrigger value="top">Top Rated</TabsTrigger>
          </TabsList>
          <Button asChild variant="outline" size="sm">
            <Link href="/series">View All Series</Link>
          </Button>
        </div>

        <TabsContent value="recent" className="mt-0">
          <RecentlyWatchedList />
        </TabsContent>

        <TabsContent value="top" className="mt-0">
          <TopRatedList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
