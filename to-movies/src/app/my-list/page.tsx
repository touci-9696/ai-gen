"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Crown, Heart } from "lucide-react";
import Link from "next/link";

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

export default function MyListPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user) return;

      try {
        const { data: watchlistData, error } = await supabase
          .from("watchlists")
          .select("movie_id")
          .eq("user_id", user.id);

        if (error) throw error;

        const movieIds = watchlistData?.map((w) => w.movie_id) || [];

        if (movieIds.length === 0) {
          setMovies([]);
          setLoading(false);
          return;
        }

        const { data: moviesData, error: moviesError } = await supabase
          .from("movies")
          .select("*")
          .in("id", movieIds);

        if (moviesError) throw moviesError;
        setMovies(moviesData || []);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWatchlist();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const isPremium = profile?.subscription_tier === "premium";

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="pt-24 px-4 md:px-8 lg:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">My List</h1>
              <p className="text-slate-400 mt-2">
                {movies.length} {movies.length === 1 ? "movie" : "movies"} in your list
              </p>
            </div>

            {!isPremium && (
              <Link href="/pricing">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-black gap-2">
                  <Crown className="h-4 w-4" />
                  Upgrade to Premium
                </Button>
              </Link>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[2/3] bg-slate-800 rounded-lg mb-2" />
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Your list is empty</h2>
              <p className="text-slate-400 mb-6">
                Start adding movies to your list by clicking the + button on movie cards.
              </p>
              <Link href="/">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Browse Movies
                </Button>
              </Link>
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
