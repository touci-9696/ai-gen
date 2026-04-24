# Aurora AI - Premium AI Image Generation SaaS Platform

Full-stack AI-powered SaaS platform for AI image generation with premium black & gold futuristic design.

## Tech Stack

- **Package Manager**: PNPM
- **Frontend**: React 18 + Next.js 15 + TypeScript + TailwindCSS 4
- **Backend**: Next.js server-side routing (App Router)
- **UI Components**: Radix UI + TailwindCSS 4 + Lucide React
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with JWT tokens

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with AuthProvider
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles with glassmorphism effects
│   ├── login/page.tsx      # Login page
│   ├── register/page.tsx   # Registration page
│   ├── dashboard/page.tsx  # User dashboard with stats
│   ├── generator/page.tsx  # AI image generator
│   ├── gallery/page.tsx    # User's image gallery
│   └── pricing/page.tsx    # Pricing & subscription page
├── hooks/
│   └── useAuth.tsx         # Authentication context & hook
└── integrations/
    └── supabase/
        ├── client.ts       # Client-side Supabase client
        ├── server.ts       # Server-side Supabase client
        └── types.ts        # TypeScript definitions
```

## Database Schema

### Tables

1. **users** - User accounts with subscription info
   - id (UUID), email, password_hash, name, avatar_url
   - role (FREE/PREMIUM/ADMIN), subscription_status
   - daily_usage, last_usage_date

2. **generated_images** - User's generated images
   - id, user_id, prompt, negative_prompt
   - image_url, thumbnail_url, width, height, style, status

3. **favorites** - User's favorite images
   - id, user_id, image_id

4. **prompt_history** - User's prompt history
   - id, user_id, original_prompt, enhanced_prompt, is_enhanced

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- RLS policies configured for all tables

## Key Features

### Authentication
- Email/password registration and login
- Google OAuth integration
- JWT-based session management
- Protected routes

### User Roles
- **Free User**: 5 image generations per day, basic quality
- **Premium User**: Unlimited generations, 4K quality, priority processing

### AI Image Generation
- Text-to-image generation
- Style presets (Realistic, Anime, Digital Art, etc.)
- Aspect ratio selection (1:1, 16:9, 9:16, 4:3)
- Advanced options (negative prompts)
- Real-time generation progress with neural loading animation

### Gallery
- Grid and list view modes
- Search by prompt
- Favorites system
- Download, share, copy prompt actions
- Full-screen image modal

### Subscription System
- Premium upgrade with mock Stripe integration
- Usage tracking with daily limits
- Feature comparison table

## UI Design System

### Color Palette
- **Background**: #0a0a0a (Deep Black)
- **Accent**: #FFD700 (Metallic Gold)
- **Gold Dark**: #B8960F
- **Gold Light**: #FFE44D

### Effects
- Glassmorphism (backdrop-blur, semi-transparent backgrounds)
- Gold glow shadows on hover
- Animated gradient buttons
- Neural network loading animation
- Floating particles background
- Smooth Framer Motion transitions

### Typography
- Inter font family
- Gradient text for headings
- Responsive font sizing

## Pages

1. **Landing Page** - Hero, features, how it works, pricing preview, gallery
2. **Login** - Email/password + Google OAuth
3. **Register** - Account creation with validation
4. **Dashboard** - Stats, usage progress, recent images
5. **Generator** - AI image creation interface
6. **Gallery** - User's image collection
7. **Pricing** - Plan comparison, FAQ, upgrade CTA

## Maintenance Log

- 2026-04-21: Initial implementation - Full AI image generation SaaS platform with authentication, user roles, subscription system, futuristic black & gold UI design
