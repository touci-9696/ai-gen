"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { MovieRow } from "@/components/MovieRow";
import { Button } from "@/components/ui/button";
import { Play, Info, Crown } from "lucide-react";
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
  is_featured: boolean;
  view_count: number;
}

export default function HomePage() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [actionMovies, setActionMovies] = useState<Movie[]>([]);
  const [scifiMovies, setScifiMovies] = useState<Movie[]>([]);
  const [horrorMovies, setHorrorMovies] = useState<Movie[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);
  const [dramaMovies, setDramaMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data: allMovies, error } = await supabase
          .from("movies")
          .select("*")
          .order("view_count", { ascending: false });

        if (error) throw error;

        const featured = allMovies?.find((m) => m.is_featured) || allMovies?.[0];
        setFeaturedMovie(featured || null);

        setTrendingMovies(allMovies?.slice(0, 10) || []);

        const popular = [...(allMovies || [])].sort((a, b) => b.rating - a.rating);
        setPopularMovies(popular.slice(0, 10));

        setActionMovies(allMovies?.filter((m) => m.genre === "Action").slice(0, 10) || []);
        setScifiMovies(allMovies?.filter((m) => m.genre === "Sci-Fi").slice(0, 10) || []);
        setHorrorMovies(allMovies?.filter((m) => m.genre === "Horror").slice(0, 10) || []);
        setComedyMovies(allMovies?.filter((m) => m.genre === "Comedy").slice(0, 10) || []);
        setDramaMovies(allMovies?.filter((m) => m.genre === "Drama").slice(0, 10) || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const backdropUrl = featuredMovie?.backdrop_url || featuredMovie?.poster_url || "";

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      {featuredMovie && (
        <section className="relative h-[70vh] min-h-[500px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(15,23,42,1)), url(${backdropUrl})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />

          <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-8 lg:px-16">
            <div className="max-w-2xl">
              {featuredMovie.is_premium_only && (
                <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <Crown className="h-4 w-4" />
                  Premium Exclusive
                </div>
              )}
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {featuredMovie.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                <span className="text-yellow-500 font-semibold text-lg">
                  {featuredMovie.rating.toFixed(1)} Rating
                </span>
                <span>{featuredMovie.release_year}</span>
                <span className="border border-gray-400 px-1.5 py-0.5 text-xs">
                  {featuredMovie.genre}
                </span>
              </div>
              <p className="text-gray-300 text-base md:text-lg mb-6 line-clamp-3">
                {featuredMovie.description}
              </p>
              <div className="flex gap-4">
                <Link href={`/movies/${featuredMovie.id}`}>
                  <Button className="bg-white text-black hover:bg-gray-200 gap-2">
                    <Play className="h-5 w-5 fill-current" />
                    Play
                  </Button>
                </Link>
                <Link href={`/movies/${featuredMovie.id}`}>
                  <Button
                    variant="secondary"
                    className="bg-slate-600/70 hover:bg-slate-500/70 text-white gap-2"
                  >
                    <Info className="h-5 w-5" />
                    More Info
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Movie Rows */}
      <main className="relative z-10 px-4 md:px-8 lg:px-16 -mt-32 pb-16 space-y-12">
        {loading ? (
          <div className="space-y-8 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <div className="h-6 w-32 bg-slate-800 rounded mb-4" />
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <div key={j} className="w-[160px] h-[240px] bg-slate-800 rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <MovieRow title="Trending Now" movies={trendingMovies} />
            <MovieRow title="Popular on To-Movies" movies={popularMovies} />
            <MovieRow title="Action Movies" movies={actionMovies} />
            <MovieRow title="Sci-Fi Adventures" movies={scifiMovies} />
            <MovieRow title="Horror Movies" movies={horrorMovies} />
            <MovieRow title="Comedy Movies" movies={comedyMovies} />
            <MovieRow title="Drama Movies" movies={dramaMovies} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 px-4 md:px-8 lg:px-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Browse</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/movies" className="hover:text-white transition">All Movies</Link></li>
                <li><Link href="/search?genre=Action" className="hover:text-white transition">Action</Link></li>
                <li><Link href="/search?genre=Comedy" className="hover:text-white transition">Comedy</Link></li>
                <li><Link href="/search?genre=Horror" className="hover:text-white transition">Horror</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Help</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">To-Movies</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-slate-500 text-sm">
            <p>2025 To-Movies. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
