"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import type { Series } from "@/lib/types"
import { deleteSeries, markAsWatched, incrementRewatch } from "@/lib/api"
import { Edit, Eye, MoreHorizontal, RefreshCw, Trash } from "lucide-react"

interface SeriesActionsProps {
  series: Series
  onUpdate?: () => void
}

export function SeriesActions({ series, onUpdate }: SeriesActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleMarkAsWatched = async () => {
    setIsLoading(true)
    try {
      await markAsWatched(series.id)
      toast({
        title: "Series marked as watched",
        description: `${series.title} has been marked as watched.`,
      })
      if (onUpdate) onUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark series as watched.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRewatch = async () => {
    setIsLoading(true)
    try {
      await incrementRewatch(series.id)
      toast({
        title: "Rewatch count updated",
        description: `Rewatch count for ${series.title} has been incremented.`,
      })
      if (onUpdate) onUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update rewatch count.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteSeries(series.id)
      toast({
        title: "Series deleted",
        description: `${series.title} has been deleted.`,
      })
      if (onUpdate) onUpdate()
      else router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete series.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <div className="flex justify-between w-full">
        <Button asChild variant="outline" size="sm">
          <Link href={`/series/${series.id}`}>View</Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/series/edit/${series.id}`} className="flex items-center">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleMarkAsWatched} disabled={isLoading || series.status === "Watched"}>
              <Eye className="mr-2 h-4 w-4" />
              Mark as Watched
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleRewatch} disabled={isLoading || series.status !== "Watched"}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Add Rewatch
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => setDeleteDialogOpen(true)}
              className="text-destructive focus:text-destructive"
              disabled={isLoading}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {series.title} from your collection. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
