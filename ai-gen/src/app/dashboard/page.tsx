'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Images,
  Download,
  Share2,
  Crown,
  Zap,
  Clock,
  TrendingUp,
  ArrowRight,
  Loader2,
  Wand2,
  Heart,
  Copy,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface GeneratedImage {
  id: string;
  prompt: string;
  image_url: string;
  thumbnail_url: string | null;
  width: number;
  height: number;
  style: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading, refreshProfile } = useAuth();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [totalImages, setTotalImages] = useState(0);

  const DAILY_LIMIT = profile?.role === 'PREMIUM' ? Infinity : 5;
  const dailyUsage = profile?.daily_usage || 0;
  const usagePercentage = DAILY_LIMIT === Infinity ? 100 : Math.min((dailyUsage / DAILY_LIMIT) * 100, 100);
  const remainingGenerations = DAILY_LIMIT === Infinity ? 'Unlimited' : Math.max(DAILY_LIMIT - dailyUsage, 0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchImages();
    }
  }, [user]);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_images')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setImages(data || []);
      setTotalImages(data?.length || 0);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setImagesLoading(false);
    }
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const isPremium = profile.role === 'PREMIUM';
  const stats = [
    {
      label: 'Total Images',
      value: totalImages,
      icon: Images,
      color: 'from-[#FFD700]/20 to-[#FFD700]/5',
    },
    {
      label: 'Daily Usage',
      value: `${dailyUsage}/${DAILY_LIMIT === Infinity ? '∞' : DAILY_LIMIT}`,
      icon: Clock,
      color: 'from-[#FFD700]/20 to-[#FFD700]/5',
    },
    {
      label: 'Remaining',
      value: remainingGenerations,
      icon: Zap,
      color: 'from-green-500/20 to-green-500/5',
    },
  ];

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
              {isPremium ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FFD700]/20 to-[#B8960F]/20 border border-[#FFD700]/30">
                  <Crown className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-sm font-medium text-[#FFD700]">Premium</span>
                </div>
              ) : (
                <Link
                  href="/pricing"
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10 transition-all"
                >
                  <Crown className="w-4 h-4" />
                  <span className="text-sm font-medium">Upgrade</span>
                </Link>
              )}
              <button
                onClick={() => {
                  supabase.auth.signOut();
                  router.push('/');
                }}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{profile.name || 'Creator'}</span>
          </h1>
          <p className="text-gray-400">Ready to create something amazing today?</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Link
            href="/generator"
            className="group relative inline-flex items-center gap-3 px-6 py-4 rounded-xl overflow-hidden"
          >
            <div className="absolute inset-0 gradient-btn" />
            <div className="absolute inset-[2px] rounded-xl bg-[#0a0a0a] group-hover:bg-[#111111] transition-colors" />
            <Wand2 className="relative w-6 h-6 text-[#FFD700]" />
            <span className="relative text-white font-semibold">Create New Image</span>
            <ArrowRight className="relative w-5 h-5 text-[#FFD700] group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} border border-[#FFD700]/10 glass`}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-6 h-6 text-[#FFD700]" />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Usage Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl glass mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-[#FFD700]" />
              <span className="font-medium">Daily Usage</span>
            </div>
            {isPremium ? (
              <span className="text-sm text-[#FFD700]">Unlimited Access</span>
            ) : (
              <span className="text-sm text-gray-400">{remainingGenerations} remaining</span>
            )}
          </div>
          <div className="relative h-3 rounded-full bg-[#1a1a1a] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#FFD700] to-[#B8960F]"
            />
          </div>
          {dailyUsage >= DAILY_LIMIT && !isPremium && (
            <div className="mt-4 p-4 rounded-lg bg-[#FFD700]/10 border border-[#FFD700]/20">
              <p className="text-sm text-[#FFD700]">
                You've reached your daily limit.{' '}
                <Link href="/pricing" className="underline hover:text-[#FFE44D]">
                  Upgrade to Premium
                </Link>{' '}
                for unlimited generations.
              </p>
            </div>
          )}
        </motion.div>

        {/* Recent Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Images</h2>
            <Link href="/gallery" className="text-sm text-[#FFD700] hover:text-[#FFE44D] transition-colors flex items-center gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {imagesLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20 rounded-2xl glass">
              <Images className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-semibold mb-2">No images yet</h3>
              <p className="text-gray-400 mb-6">Start creating to see your images here</p>
              <Link
                href="/generator"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-btn text-black font-semibold hover:opacity-90 transition-opacity"
              >
                <Wand2 className="w-5 h-5" />
                Create Your First Image
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, i) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="group relative aspect-square rounded-xl overflow-hidden glass cursor-pointer"
                >
                  <img
                    src={image.image_url}
                    alt={image.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm text-white/80 line-clamp-2 mb-3">{image.prompt}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open(image.image_url, '_blank')}
                        className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => handleCopyPrompt(image.prompt)}
                        className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                      >
                        <Copy className="w-4 h-4 text-white" />
                      </button>
                      <button className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                        <Share2 className="w-4 h-4 text-white" />
                      </button>
                      <button className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                        <Heart className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
