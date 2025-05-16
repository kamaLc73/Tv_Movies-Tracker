export interface Series {
  id: number
  title: string
  status: string
  rating: number | null
  seasons: number | null
  episodes: number | null
  current_season: number | null
  current_episode: number | null
  rewatch_count: number
  last_watched_date: string | null
}
