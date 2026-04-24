'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Images,
  Download,
  Share2,
  Copy,
  Heart,
  Loader2,
  Grid3X3,
  List,
  Search,
  Filter,
  Trash2,
  Wand2,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface GeneratedImage {
  id: string;
  prompt: string;
  negative_prompt: string | null;
  image_url: string;
  thumbnail_url: string | null;
  width: number;
  height: number;
  style: string | null;
  status: string;
  created_at: string;
}

export default function GalleryPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchImages();
      fetchFavorites();
    }
  }, [user]);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setImagesLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data } = await supabase
        .from('favorites')
        .select('image_id')
        .eq('user_id', user?.id);

      if (data) {
        setFavorites(new Set(data.map((f: { image_id: string }) => f.image_id)));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (imageId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(imageId)) {
      newFavorites.delete(imageId);
      await supabase.from('favorites').delete().eq('user_id', user?.id).eq('image_id', imageId);
    } else {
      newFavorites.add(imageId);
      await supabase.from('favorites').insert({ user_id: user?.id, image_id: imageId });
    }
    setFavorites(newFavorites);
  };

  const deleteImage = async (imageId: string) => {
    try {
      await supabase.from('generated_images').delete().eq('id', imageId).eq('user_id', user?.id);
      setImages(images.filter((img) => img.id !== imageId));
      if (selectedImage?.id === imageId) {
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
  };

  const filteredImages = images.filter((image) => {
    const matchesSearch = image.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'favorites' && favorites.has(image.id));
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-[#FFD700]/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#B8960F] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold gradient-text">Aurora AI</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/generator" className="px-4 py-2 rounded-lg bg-[#FFD700] text-black font-medium hover:bg-[#FFE44D] transition-colors">
                Create New
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Your <span className="gradient-text">Gallery</span>
            </h1>
            <p className="text-gray-400">{images.length} images created</p>
          </div>

          <Link
            href="/generator"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-btn text-black font-semibold hover:opacity-90 transition-opacity"
          >
            <Wand2 className="w-5 h-5" />
            Create New Image
          </Link>
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by prompt..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#FFD700]/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FFD700]/50 transition-all"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-[#FFD700] text-black font-medium'
                  : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#FFD700]/20'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('favorites')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'favorites'
                  ? 'bg-[#FFD700] text-black font-medium'
                  : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-[#FFD700]/20'
              }`}
            >
              <Heart className="w-4 h-4 inline mr-1" />
              Favorites
            </button>
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#1a1a1a] border border-[#FFD700]/20">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'grid' ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'list' ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Gallery */}
        {imagesLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20 rounded-2xl glass">
            <Images className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">No images found</h3>
            <p className="text-gray-400 mb-6">
              {filter === 'favorites' ? "You haven't favorited any images yet" : 'Start creating to see your images here'}
            </p>
            <Link
              href="/generator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-btn text-black font-semibold hover:opacity-90 transition-opacity"
            >
              <Wand2 className="w-5 h-5" />
              Create Your First Image
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredImages.map((image, i) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative aspect-square rounded-xl overflow-hidden glass cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.image_url}
                  alt={image.prompt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(image.id);
                      }}
                      className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                        favorites.has(image.id) ? 'bg-red-500/80 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.has(image.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm text-white/80 line-clamp-2 mb-3">{image.prompt}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(image.image_url, '_blank');
                        }}
                        className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyPrompt(image.prompt);
                        }}
                        className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                      >
                        <Copy className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.share?.({ url: image.image_url });
                        }}
                        className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                      >
                        <Share2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredImages.map((image, i) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 p-4 rounded-xl glass cursor-pointer hover:bg-[#FFD700]/5 transition-colors"
                onClick={() => setSelectedImage(image)}
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={image.image_url} alt={image.prompt} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white line-clamp-2 mb-2">{image.prompt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{formatDate(image.created_at)}</span>
                    {image.style && (
                      <span className="px-2 py-1 rounded-full bg-[#FFD700]/10 text-[#FFD700]">
                        {image.style}
                      </span>
                    )}
                    <span>{image.width} x {image.height}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(image.id);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      favorites.has(image.id) ? 'bg-red-500/20 text-red-400' : 'bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${favorites.has(image.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteImage(image.id);
                    }}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full glass-strong rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedImage.image_url}
                alt={selectedImage.prompt}
                className="w-full max-h-[70vh] object-contain bg-black"
              />
              <div className="p-6">
                <p className="text-white mb-4">{selectedImage.prompt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{formatDate(selectedImage.created_at)}</span>
                    {selectedImage.style && (
                      <span className="px-2 py-1 rounded-full bg-[#FFD700]/10 text-[#FFD700]">
                        {selectedImage.style}
                      </span>
                    )}
                    <span>{selectedImage.width} x {selectedImage.height}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(selectedImage.image_url, '_blank')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD700] text-black font-medium hover:bg-[#FFE44D] transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => toggleFavorite(selectedImage.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        favorites.has(selectedImage.id) ? 'bg-red-500/20 text-red-400' : 'bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${favorites.has(selectedImage.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleCopyPrompt(selectedImage.prompt)}
                      className="p-2 rounded-lg bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigator.share?.({ url: selectedImage.image_url })}
                      className="p-2 rounded-lg bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
