'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Crown, Download, Share2, Copy, Wand2, Layers, Clock, Shield, Star, ArrowRight, Play } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function LandingPage() {
  const { user, profile } = useAuth();
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    { icon: Sparkles, title: 'AI-Powered Generation', desc: 'Create stunning images with advanced AI models' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Generate images in seconds with optimized processing' },
    { icon: Crown, title: 'Premium Quality', desc: 'High-resolution outputs for professional use' },
    { icon: Layers, title: 'Multiple Styles', desc: 'Choose from various artistic styles and presets' },
    { icon: Clock, title: 'Daily Limits', desc: 'Free tier with 5 generations per day' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your data and creations are always protected' },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: ['5 generations per day', 'Basic quality', 'Standard speed', 'Community support'],
      cta: 'Get Started',
      highlight: false,
    },
    {
      name: 'Premium',
      price: '$19',
      period: '/month',
      features: ['Unlimited generations', 'Premium quality (4K)', 'Faster processing', 'Advanced styles', 'Priority support', 'No watermarks'],
      cta: 'Upgrade Now',
      highlight: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FFD700]/[0.02] rounded-full blur-[150px]" />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FFD700]/40 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              opacity: 0,
            }}
            animate={{
              y: [null, '-100vh'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-[#FFD700]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#B8960F] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold gradient-text">Aurora AI</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                Pricing
              </Link>
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg bg-[#FFD700] text-black font-medium hover:bg-[#FFE44D] transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-lg bg-[#FFD700] text-black font-medium hover:bg-[#FFE44D] transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
                <Star className="w-4 h-4 text-[#FFD700]" />
                <span className="text-sm text-gray-300">Next-Generation AI Image Generation</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Create <span className="gradient-text">Stunning</span> AI
                <br />
                Images in Seconds
              </h1>

              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Transform your imagination into breathtaking visuals with our cutting-edge AI technology.
                No design skills required.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={user ? '/generator' : '/register'}
                  className="group relative px-8 py-4 rounded-xl overflow-hidden"
                >
                  <div className="absolute inset-0 gradient-btn" />
                  <div className="absolute inset-[2px] rounded-xl bg-[#0a0a0a] group-hover:bg-[#111111] transition-colors" />
                  <span className="relative flex items-center gap-2 text-white font-semibold">
                    Start Creating Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>

                <button
                  onClick={() => setShowDemo(true)}
                  className="flex items-center gap-2 px-6 py-4 rounded-xl border border-[#FFD700]/30 text-gray-300 hover:text-white hover:border-[#FFD700]/50 transition-all"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </motion.div>

            {/* Hero Image Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-20 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
              <div className="glass rounded-2xl p-2 gold-glow">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                  {showDemo ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="relative w-24 h-24 mx-auto mb-6">
                          <div className="absolute inset-0 border-4 border-[#FFD700]/20 rounded-full" />
                          <div className="absolute inset-0 border-4 border-transparent border-t-[#FFD700] rounded-full animate-rotate" />
                          <div className="absolute inset-2 border-4 border-transparent border-b-[#FFD700]/50 rounded-full animate-rotate-reverse" />
                          <div className="absolute inset-4 flex items-center justify-center">
                            <Wand2 className="w-8 h-8 text-[#FFD700]" />
                          </div>
                        </div>
                        <p className="text-gray-400">AI is creating your image...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-4 p-8 max-w-lg">
                        {[
                          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
                          'https://images.unsplash.com/photo-1633186710895-309db2eca9e4?w=400&h=400&fit=crop',
                          'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=400&h=400&fit=crop',
                          'https://images.unsplash.com/photo-1634017839464-5c339bbe3c35?w=400&h=400&fit=crop',
                        ].map((src, i) => (
                          <motion.div
                            key={i}
                            className="relative aspect-square rounded-lg overflow-hidden"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                          >
                            <img src={src} alt="Demo" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Powerful Features for <span className="gradient-text">Creative Minds</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to bring your vision to life
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-2xl glass card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5 flex items-center justify-center mb-4 group-hover:gold-glow transition-all">
                  <feature.icon className="w-7 h-7 text-[#FFD700]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-gray-400 text-lg">Create stunning images in three simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Enter Your Prompt', desc: 'Describe the image you want to create in detail' },
              { step: '02', title: 'AI Generation', desc: 'Our AI processes your request and creates your image' },
              { step: '03', title: 'Download & Share', desc: 'Get your high-quality image and share it with the world' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative text-center"
              >
                <div className="text-8xl font-bold text-[#FFD700]/10 mb-4">{item.step}</div>
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-16 right-0 translate-x-1/2">
                    <ArrowRight className="w-8 h-8 text-[#FFD700]/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Simple <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-gray-400 text-lg">Choose the plan that fits your creative needs</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className={`relative p-8 rounded-2xl ${plan.highlight ? 'glass-strong gold-glow' : 'glass'}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FFD700] text-black text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold gradient-text">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#FFD700]" />
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={user ? '/pricing' : '/register'}
                  className={`block w-full py-4 rounded-xl font-semibold text-center transition-all ${
                    plan.highlight
                      ? 'gradient-btn text-black hover:opacity-90'
                      : 'border border-[#FFD700]/30 text-white hover:bg-[#FFD700]/10'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Created with <span className="gradient-text">Aurora AI</span>
            </h2>
            <p className="text-gray-400 text-lg">Join thousands of creators bringing their imagination to life</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1633186710895-309db2eca9e4?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1614850715649-1d0106293bd1?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1634017839464-5c339bbe3c35?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400&h=400&fit=crop',
            ].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
              >
                <img src={src} alt="Gallery" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                    <Download className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
                    <Share2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-12 rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-radial" />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Create <span className="gradient-text">Amazing</span> Images?
              </h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Join thousands of creators who trust Aurora AI for their visual content needs
              </p>
              <Link
                href={user ? '/generator' : '/register'}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gradient-btn text-black font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                <Wand2 className="w-6 h-6" />
                Start Creating Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#FFD700]/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFD700] to-[#B8960F] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold gradient-text">Aurora AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
              <Link href="/register" className="hover:text-white transition-colors">Register</Link>
            </div>
            <p className="text-sm text-gray-500">
              Powered by Advanced AI Technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
