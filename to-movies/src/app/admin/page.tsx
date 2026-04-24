"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Crown, Star, Eye, Film, Users, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface Movie {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  stream_url_720p: string | null;
  stream_url_1080p: string | null;
  genre: string;
  release_year: number | null;
  rating: number;
  is_premium_only: boolean;
  is_featured: boolean;
  view_count: number;
}

interface Stats {
  totalMovies: number;
  totalViews: number;
  premiumMovies: number;
  featuredMovies: number;
}

export default function AdminPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [stats, setStats] = useState<Stats>({ totalMovies: 0, totalViews: 0, premiumMovies: 0, featuredMovies: 0 });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "Action",
    release_year: 2024,
    rating: 7.0,
    poster_url: "",
    backdrop_url: "",
    stream_url_720p: "",
    stream_url_1080p: "",
    is_premium_only: false,
    is_featured: false,
  });

  useEffect(() => {
    if (!authLoading && (!user || profile?.role !== "admin")) {
      router.push("/");
    }
  }, [user, profile, authLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: moviesData } = await supabase
          .from("movies")
          .select("*")
          .order("created_at", { ascending: false });

        setMovies(moviesData || []);

        setStats({
          totalMovies: moviesData?.length || 0,
          totalViews: moviesData?.reduce((sum, m) => sum + m.view_count, 0) || 0,
          premiumMovies: moviesData?.filter((m) => m.is_premium_only).length || 0,
          featuredMovies: moviesData?.filter((m) => m.is_featured).length || 0,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && profile?.role === "admin") {
      fetchData();
    }
  }, [user, profile]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      genre: "Action",
      release_year: 2024,
      rating: 7.0,
      poster_url: "",
      backdrop_url: "",
      stream_url_720p: "",
      stream_url_1080p: "",
      is_premium_only: false,
      is_featured: false,
    });
    setEditingMovie(null);
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description || "",
      genre: movie.genre,
      release_year: movie.release_year || 2024,
      rating: movie.rating,
      poster_url: movie.poster_url || "",
      backdrop_url: movie.backdrop_url || "",
      stream_url_720p: movie.stream_url_720p || "",
      stream_url_1080p: movie.stream_url_1080p || "",
      is_premium_only: movie.is_premium_only,
      is_featured: movie.is_featured,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingMovie) {
        // Update existing movie
        const { error } = await supabase
          .from("movies")
          .update(formData)
          .eq("id", editingMovie.id);

        if (error) throw error;
        toast.success("Movie updated successfully");
      } else {
        // Create new movie
        const { error } = await supabase.from("movies").insert(formData);
        if (error) throw error;
        toast.success("Movie created successfully");
      }

      // Refresh data
      const { data: moviesData } = await supabase
        .from("movies")
        .select("*")
        .order("created_at", { ascending: false });
      setMovies(moviesData || []);

      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving movie:", error);
      toast.error("Failed to save movie");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;

    try {
      const { error } = await supabase.from("movies").delete().eq("id", id);
      if (error) throw error;

      setMovies(movies.filter((m) => m.id !== id));
      toast.success("Movie deleted successfully");
    } catch (error) {
      console.error("Error deleting movie:", error);
      toast.error("Failed to delete movie");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user || profile?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="pt-24 px-4 md:px-8 lg:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700" onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Movie
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingMovie ? "Edit Movie" : "Add New Movie"}
                  </DialogTitle>
                  <DialogDescription className="text-slate-400">
                    {editingMovie ? "Update movie details" : "Fill in the details for the new movie"}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="col-span-2 space-y-2">
                    <Label className="text-slate-200">Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder="Movie title"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label className="text-slate-200">Description</Label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder="Movie description"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Genre</Label>
                    <Select value={formData.genre} onValueChange={(v) => setFormData({ ...formData, genre: v })}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {["Action", "Comedy", "Drama", "Horror", "Sci-Fi"].map((g) => (
                          <SelectItem key={g} value={g} className="text-white">{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Release Year</Label>
                    <Input
                      type="number"
                      value={formData.release_year}
                      onChange={(e) => setFormData({ ...formData, release_year: parseInt(e.target.value) })}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Rating (0-10)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Poster URL</Label>
                    <Input
                      value={formData.poster_url}
                      onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label className="text-slate-200">Backdrop URL</Label>
                    <Input
                      value={formData.backdrop_url}
                      onChange={(e) => setFormData({ ...formData, backdrop_url: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label className="text-slate-200">Stream URL (720p)</Label>
                    <Input
                      value={formData.stream_url_720p}
                      onChange={(e) => setFormData({ ...formData, stream_url_720p: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label className="text-slate-200">Stream URL (1080p)</Label>
                    <Input
                      value={formData.stream_url_1080p}
                      onChange={(e) => setFormData({ ...formData, stream_url_1080p: e.target.value })}
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="premium"
                      checked={formData.is_premium_only}
                      onCheckedChange={(v) => setFormData({ ...formData, is_premium_only: v })}
                    />
                    <Label htmlFor="premium" className="text-slate-200">Premium Only</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.is_featured}
                      onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })}
                    />
                    <Label htmlFor="featured" className="text-slate-200">Featured</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-slate-700">
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700">
                    {editingMovie ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-600/20 rounded-lg">
                    <Film className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Total Movies</p>
                    <p className="text-2xl font-bold text-white">{stats.totalMovies}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600/20 rounded-lg">
                    <Eye className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Total Views</p>
                    <p className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Crown className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Premium</p>
                    <p className="text-2xl font-bold text-white">{stats.premiumMovies}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-600/20 rounded-lg">
                    <Star className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Featured</p>
                    <p className="text-2xl font-bold text-white">{stats.featuredMovies}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Movies Table */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Manage Movies</CardTitle>
              <CardDescription className="text-slate-400">
                Add, edit, or remove movies from your catalog
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-slate-400">Loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800">
                      <TableHead className="text-slate-400">Title</TableHead>
                      <TableHead className="text-slate-400">Genre</TableHead>
                      <TableHead className="text-slate-400">Year</TableHead>
                      <TableHead className="text-slate-400">Rating</TableHead>
                      <TableHead className="text-slate-400">Views</TableHead>
                      <TableHead className="text-slate-400">Type</TableHead>
                      <TableHead className="text-slate-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movies.map((movie) => (
                      <TableRow key={movie.id} className="border-slate-800">
                        <TableCell className="text-white font-medium">{movie.title}</TableCell>
                        <TableCell className="text-slate-400">{movie.genre}</TableCell>
                        <TableCell className="text-slate-400">{movie.release_year}</TableCell>
                        <TableCell className="text-slate-400">{movie.rating.toFixed(1)}</TableCell>
                        <TableCell className="text-slate-400">{movie.view_count.toLocaleString()}</TableCell>
                        <TableCell>
                          {movie.is_premium_only ? (
                            <span className="inline-flex items-center gap-1 text-yellow-500 text-xs">
                              <Crown className="h-3 w-3" />
                              Premium
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">Free</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(movie)}
                              className="text-slate-400 hover:text-white"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(movie.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
