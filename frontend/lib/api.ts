import type { Series } from "./types"

const API_BASE_URL = "http://localhost:8000"

// Helper function for API requests
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  return response.json()
}

// Series CRUD
export async function getAllSeries(): Promise<Series[]> {
  return fetchAPI<Series[]>("/series/")
}

export async function getSeries(id: number): Promise<Series> {
  return fetchAPI<Series>(`/series/${id}`)
}

export async function createSeries(data: Partial<Series>): Promise<Series> {
  return fetchAPI<Series>("/series/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateSeries(id: number, data: Partial<Series>): Promise<Series> {
  return fetchAPI<Series>(`/series/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteSeries(id: number): Promise<void> {
  return fetchAPI<void>(`/series/${id}`, {
    method: "DELETE",
  })
}

// Filtering and searching
export async function getSeriesByStatus(status: string): Promise<Series[]> {
  return fetchAPI<Series[]>(`/series/status/${status}`)
}

export async function getSeriesByRatingRange(minRating: number, maxRating: number): Promise<Series[]> {
  return fetchAPI<Series[]>(`/series/rating/range?min_rating=${minRating}&max_rating=${maxRating}`)
}

export async function searchSeries(query: string): Promise<Series[]> {
  return fetchAPI<Series[]>(`/series/search?query=${encodeURIComponent(query)}`)
}

export async function getSortedSeries(sortBy = "title", descending = false): Promise<Series[]> {
  return fetchAPI<Series[]>(`/series/sorted?sort_by=${sortBy}&descending=${descending}`)
}

// Special actions
export async function markAsWatched(id: number, rating?: number): Promise<Series> {
  const endpoint = rating !== undefined ? `/series/${id}/watch?rating=${rating}` : `/series/${id}/watch`

  return fetchAPI<Series>(endpoint, {
    method: "PUT",
  })
}

export async function incrementRewatch(id: number): Promise<Series> {
  return fetchAPI<Series>(`/series/${id}/rewatch`, {
    method: "PUT",
  })
}

// Statistics
export async function getAverageRating(): Promise<{ average_rating: number | null }> {
  return fetchAPI<{ average_rating: number | null }>("/stats/average-rating")
}

export async function getCountByStatus(): Promise<Record<string, number>> {
  return fetchAPI<Record<string, number>>("/stats/count-by-status")
}
