"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { createSeries, getSeries, updateSeries } from "@/lib/api"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.string().min(1, "Status is required"),
  rating: z.number().min(0).max(10).nullable(),
  seasons: z.number().int().nonnegative().nullable(),
  episodes: z.number().int().nonnegative().nullable(),
  current_season: z.number().int().nonnegative().nullable(),
  current_episode: z.number().int().nonnegative().nullable(),
  rewatch_count: z.number().int().nonnegative(),
})

interface SeriesFormProps {
  id?: number
}

export function SeriesForm({ id }: SeriesFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(id ? true : false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      status: "Upcoming",
      rating: null,
      seasons: null,
      episodes: null,
      current_season: null,
      current_episode: null,
      rewatch_count: 0,
    },
  })

  useEffect(() => {
    if (id) {
      const fetchSeries = async () => {
        try {
          const data = await getSeries(id)
          form.reset({
            title: data.title,
            status: data.status,
            rating: data.rating,
            seasons: data.seasons,
            episodes: data.episodes,
            current_season: data.current_season,
            current_episode: data.current_episode,
            rewatch_count: data.rewatch_count,
          })
        } catch (error) {
          console.error("Failed to fetch series:", error)
          toast({
            title: "Error",
            description: "Failed to load series data.",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }

      fetchSeries()
    }
  }, [id, form, toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (id) {
        await updateSeries(id, values)
        toast({
          title: "Series updated",
          description: "The series has been updated successfully.",
        })
      } else {
        await createSeries(values)
        toast({
          title: "Series added",
          description: "The series has been added to your collection.",
        })
      }
      router.push("/series")
    } catch (error) {
      toast({
        title: "Error",
        description: id ? "Failed to update series." : "Failed to add series.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter series title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Watched">Watched</SelectItem>
                  <SelectItem value="Half-watched">Half-watched</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating (0-10)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="Enter rating"
                    {...field}
                    value={field.value === null ? "" : field.value}
                    onChange={(e) => {
                      const value = e.target.value === "" ? null : Number.parseFloat(e.target.value)
                      field.onChange(value)
                    }}
                  />
                </FormControl>
                <FormDescription>Leave empty if not rated yet</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rewatch_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rewatch Count</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Enter rewatch count"
                    {...field}
                    value={field.value}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="seasons"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Seasons</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Enter total seasons"
                    {...field}
                    value={field.value === null ? "" : field.value}
                    onChange={(e) => {
                      const value = e.target.value === "" ? null : Number.parseInt(e.target.value)
                      field.onChange(value)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="episodes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Episodes</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Enter total episodes"
                    {...field}
                    value={field.value === null ? "" : field.value}
                    onChange={(e) => {
                      const value = e.target.value === "" ? null : Number.parseInt(e.target.value)
                      field.onChange(value)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="current_season"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Season</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Enter current season"
                    {...field}
                    value={field.value === null ? "" : field.value}
                    onChange={(e) => {
                      const value = e.target.value === "" ? null : Number.parseInt(e.target.value)
                      field.onChange(value)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="current_episode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Episode</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Enter current episode"
                    {...field}
                    value={field.value === null ? "" : field.value}
                    onChange={(e) => {
                      const value = e.target.value === "" ? null : Number.parseInt(e.target.value)
                      field.onChange(value)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">{id ? "Update Series" : "Add Series"}</Button>
        </div>
      </form>
    </Form>
  )
}
