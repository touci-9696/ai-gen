"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Plus, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MovieCardProps {
  movie: {
    id: string;
    title: string;
    poster_url: string | null;
    backdrop_url: string | null;
    rating: number;
    release_year: number | null;
    genre: string;
    is_premium_only: boolean;
    view_count?: number;
  };
  showDetails?: boolean;
  compact?: boolean;
}

export function MovieCard({ movie, showDetails = false, compact = false }: MovieCardProps) {
  const { user, profile } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [addingToList, setAddingToList] = useState(false);

  const imageUrl = movie.poster_url || "/placeholder-movie.jpg";

  const handleAddToList = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please sign in to add movies to your list");
      return;
    }

    setAddingToList(true);
    try {
      const { error } = await supabase.from("watchlists").insert({
        user_id: user.id,
        movie_id: movie.id,
      });

      if (error) {
        if (error.code === "23505") {
          toast.info("Already in your list");
        } else {
          toast.error("Failed to add to list");
        }
      } else {
        toast.success(`Added "${movie.title}" to your list`);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setAddingToList(false);
    }
  };

  return (
    <Link href={`/movies/${movie.id}`}>
      <div
        className={`relative group cursor-pointer transition-all duration-300 ${
          compact ? "w-[140px] flex-shrink-0" : "w-full"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-slate-800">
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {/* Premium Badge */}
          {movie.is_premium_only && (
            <div className="absolute top-2 left-2 bg-yellow-500/90 text-black text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <Crown className="h-3 w-3" />
              PREMIUM
            </div>
          )}

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-white font-semibold text-sm truncate">{movie.title}</h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-300">
                <span className="text-yellow-500 font-medium">{movie.rating.toFixed(1)}</span>
                <span>|</span>
                <span>{movie.genre}</span>
                {movie.release_year && (
                  <>
                    <span>|</span>
                    <span>{movie.release_year}</span>
                  </>
                )}
              </div>
            </div>

            {/* Play Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Button
                size="icon"
                className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <Play className="h-5 w-5 fill-white text-white" />
              </Button>
            </div>

            {/* Add to List Button */}
            {user && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={handleAddToList}
                disabled={addingToList}
              >
                <Plus className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>
        </div>

        {/* Quick Info (shown below on hover) */}
        {showDetails && (
          <div
            className={`mt-2 transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <h3 className="text-white font-medium truncate">{movie.title}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <span className="text-yellow-500">{movie.rating.toFixed(1)}</span>
              <span>{movie.genre}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
