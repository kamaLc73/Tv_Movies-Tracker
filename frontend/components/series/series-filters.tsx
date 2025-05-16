"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ArrowDownAZ, ArrowUpAZ, Star, Calendar } from "lucide-react"

const formSchema = z.object({
  status: z.string().optional(),
  minRating: z.number().min(0).max(10).optional(),
  maxRating: z.number().min(0).max(10).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
})

export function SeriesFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: searchParams.get("status") || "",
      minRating: searchParams.get("minRating") ? Number.parseFloat(searchParams.get("minRating") as string) : 0,
      maxRating: searchParams.get("maxRating") ? Number.parseFloat(searchParams.get("maxRating") as string) : 10,
      sortBy: searchParams.get("sortBy") || "title",
      sortOrder: searchParams.get("sortOrder") || "asc",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams()

    if (values.status) {
      params.set("status", values.status)
    }

    if (values.minRating !== undefined && values.minRating > 0) {
      params.set("minRating", values.minRating.toString())
    }

    if (values.maxRating !== undefined && values.maxRating < 10) {
      params.set("maxRating", values.maxRating.toString())
    }

    if (values.sortBy) {
      params.set("sortBy", values.sortBy)
    }

    if (values.sortOrder) {
      params.set("sortOrder", values.sortOrder)
    }

    router.push(`/series?${params.toString()}`)
  }

  function resetFilters() {
    form.reset({
      status: "",
      minRating: 0,
      maxRating: 10,
      sortBy: "title",
      sortOrder: "asc",
    })
    router.push("/series")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-8">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="Watched">Watched</SelectItem>
                    <SelectItem value="Half-watched">Half-watched</SelectItem>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sortBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort By</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="title" className="flex items-center">
                      <ArrowDownAZ className="mr-2 h-4 w-4" />
                      Title
                    </SelectItem>
                    <SelectItem value="rating" className="flex items-center">
                      <Star className="mr-2 h-4 w-4" />
                      Rating
                    </SelectItem>
                    <SelectItem value="last_watched_date" className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Last Watched
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Order</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort order" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="asc" className="flex items-center">
                      <ArrowUpAZ className="mr-2 h-4 w-4" />
                      Ascending
                    </SelectItem>
                    <SelectItem value="desc" className="flex items-center">
                      <ArrowDownAZ className="mr-2 h-4 w-4" />
                      Descending
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="minRating"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>
                Rating Range: {form.watch("minRating")} - {form.watch("maxRating")}
              </FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={10}
                  step={0.5}
                  value={[form.watch("minRating") as number, form.watch("maxRating") as number]}
                  onValueChange={(values) => {
                    form.setValue("minRating", values[0])
                    form.setValue("maxRating", values[1])
                  }}
                  className="py-4"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
          <Button type="submit">Apply Filters</Button>
        </div>
      </form>
    </Form>
  )
}
