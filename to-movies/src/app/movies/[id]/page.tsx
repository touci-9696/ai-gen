"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Plus, Check, Crown, Clock, Calendar, Star, ThumbsUp, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Movie {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  stream_url_720p: string | null;
  stream_url_1080p: string | null;
  rating: number;
  release_year: number | null;
  genre: string;
  is_premium_only: boolean;
  is_featured: boolean;
  view_count: number;
}

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user, profile } = useAuth();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<"720p" | "1080p">("720p");

  const isPremium = profile?.subscription_tier === "premium";
  const canWatch = !movie?.is_premium_only || isPremium;

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const { data, error } = await supabase
          .from("movies")
          .select("*")
          .eq("id", resolvedParams.id)
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          router.push("/");
          return;
        }
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie:", error);
        toast.error("Failed to load movie");
      } finally {
        setLoading(false);
      }
    };

    const checkWatchlist = async () => {
      if (!user || !resolvedParams.id) return;

      const { data } = await supabase
        .from("watchlists")
        .select("id")
        .eq("user_id", user.id)
        .eq("movie_id", resolvedParams.id)
        .maybeSingle();

      setInWatchlist(!!data);
    };

    fetchMovie();
    checkWatchlist();
  }, [resolvedParams.id, user, router]);

  const handlePlay = () => {
    if (!user) {
      toast.error("Please sign in to watch movies");
      router.push("/auth/signin");
      return;
    }

    if (!canWatch) {
      toast.error("Upgrade to Premium to watch this movie");
      router.push("/pricing");
      return;
    }

    setShowPlayer(true);

    // Increment view count
    if (movie) {
      supabase
        .from("movies")
        .update({ view_count: movie.view_count + 1 })
        .eq("id", movie.id);
    }
  };

  const handleWatchlistToggle = async () => {
    if (!user) {
      toast.error("Please sign in to manage your watchlist");
      return;
    }

    setWatchlistLoading(true);
    try {
      if (inWatchlist) {
        await supabase
          .from("watchlists")
          .delete()
          .eq("user_id", user.id)
          .eq("movie_id", movie?.id);
        setInWatchlist(false);
        toast.success("Removed from your list");
      } else {
        await supabase.from("watchlists").insert({
          user_id: user.id,
          movie_id: movie?.id,
        });
        setInWatchlist(true);
        toast.success("Added to your list");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setWatchlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Movie not found</div>
      </div>
    );
  }

  const streamUrl = selectedQuality === "1080p" && movie.stream_url_1080p
    ? movie.stream_url_1080p
    : movie.stream_url_720p;

  const backdropUrl = movie.backdrop_url || movie.poster_url || "";

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {showPlayer ? (
        <div className="pt-16">
          {/* Video Player */}
          <div className="relative bg-black aspect-video max-w-6xl mx-auto">
            {streamUrl ? (
              <video
                key={streamUrl}
                controls
                autoPlay
                className="w-full h-full"
                src={streamUrl}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <p>Video not available</p>
              </div>
            )}
          </div>

          {/* Quality Selector */}
          {movie.stream_url_1080p && isPremium && (
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
              <span className="text-white text-sm">Quality:</span>
              <div className="flex gap-2">
                <Button
                  variant={selectedQuality === "720p" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedQuality("720p")}
                  className={selectedQuality === "720p" ? "bg-red-600" : ""}
                >
                  720p
                </Button>
                <Button
                  variant={selectedQuality === "1080p" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedQuality("1080p")}
                  className={selectedQuality === "1080p" ? "bg-red-600" : ""}
                >
                  1080p HD
                </Button>
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="max-w-6xl mx-auto px-4 pb-8">
            <Button variant="ghost" onClick={() => setShowPlayer(false)} className="text-white">
              Back to Movie Details
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <div
            className="relative h-[60vh] min-h-[400px]"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.3), rgba(15,23,42,1)), url(${backdropUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative -mt-64 z-10 px-4 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Poster */}
                <div className="flex-shrink-0">
                  <img
                    src={movie.poster_url || "/placeholder-movie.jpg"}
                    alt={movie.title}
                    className="w-64 rounded-lg shadow-2xl hidden md:block"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {movie.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-yellow-500">
                        {movie.rating.toFixed(1)}
                      </span>
                    </div>
                    {movie.release_year && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{movie.release_year}</span>
                      </div>
                    )}
                    <Badge variant="outline" className="border-slate-500 text-slate-300">
                      {movie.genre}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{movie.view_count.toLocaleString()} views</span>
                    </div>
                  </div>

                  {/* Premium Badge */}
                  {movie.is_premium_only && (
                    <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 px-3 py-1.5 rounded-full text-sm font-medium mb-6">
                      <Crown className="h-4 w-4" />
                      {isPremium ? "Premium Exclusive" : "Premium Only - Upgrade to Watch"}
                    </div>
                  )}

                  <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl">
                    {movie.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <Button
                      onClick={handlePlay}
                      className="bg-white text-black hover:bg-gray-200 gap-2 text-lg px-8"
                      size="lg"
                    >
                      <Play className="h-5 w-5 fill-current" />
                      {canWatch ? "Watch Now" : "Upgrade to Watch"}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleWatchlistToggle}
                      disabled={watchlistLoading}
                      className="border-slate-600 text-white hover:bg-slate-800 gap-2"
                      size="lg"
                    >
                      {inWatchlist ? (
                        <>
                          <Check className="h-5 w-5" />
                          In My List
                        </>
                      ) : (
                        <>
                          <Plus className="h-5 w-5" />
                          Add to List
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Premium Upgrade Prompt */}
                  {!isPremium && movie.is_premium_only && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-yellow-500/10 to-red-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Crown className="h-6 w-6 text-yellow-500" />
                        <h3 className="text-xl font-semibold text-white">
                          Unlock Premium Content
                        </h3>
                      </div>
                      <p className="text-gray-300 mb-4">
                        Upgrade to Premium to watch this movie in stunning 1080p HD quality with no ads.
                      </p>
                      <Link href="/pricing">
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black gap-2">
                          <Crown className="h-4 w-4" />
                          Upgrade to Premium
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Free User Info */}
                  {!isPremium && !movie.is_premium_only && (
                    <div className="mt-8 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-gray-300">
                            You are watching in 720p quality.{" "}
                            <Link href="/pricing" className="text-yellow-500 hover:underline">
                              Upgrade to Premium
                            </Link>{" "}
                            for 1080p HD and ad-free experience.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
