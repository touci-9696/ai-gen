"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface Movie {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  rating: number;
  release_year: number | null;
  genre: string;
  is_premium_only: boolean;
  view_count: number;
}

const GENRES = ["All", "Action", "Comedy", "Drama", "Horror", "Sci-Fi"];

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let query = supabase.from("movies").select("*").order("title", { ascending: true });

        if (selectedGenre !== "All") {
          query = query.eq("genre", selectedGenre);
        }

        const { data, error } = await query;
        if (error) throw error;
        setMovies(data || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenre]);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="pt-24 px-4 md:px-8 lg:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Browse Movies</h1>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {GENRES.map((genre) => (
                    <SelectItem key={genre} value={genre} className="text-white">
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-slate-400 mb-8">
            {movies.length} {movies.length === 1 ? "movie" : "movies"}
            {selectedGenre !== "All" && ` in ${selectedGenre}`}
          </p>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-slate-800 rounded-lg mb-2" />
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold text-white mb-2">No movies found</h2>
              <p className="text-slate-400">Try selecting a different genre.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} showDetails />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
