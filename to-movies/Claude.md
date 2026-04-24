# To-Movies Streaming Platform

## Overview
A Netflix-inspired movie streaming web application with user authentication, subscription tiers (Free/Premium), movie browsing, search, watchlist, and admin dashboard features.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL via nubase)
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS v4
- **Authentication**: Supabase Auth with JWT
- **State Management**: React Context + Hooks
- **Video Player**: Native HTML5 video element

## Directory Structure
```
src/
├── app/
│   ├── page.tsx              # Homepage with movie carousels
│   ├── layout.tsx           # Root layout with providers
│   ├── globals.css          # Global styles (Netflix dark theme)
│   ├── auth/
│   │   ├── signin/         # Sign In page
│   │   └── signup/         # Sign Up page
│   ├── movies/
│   │   ├── page.tsx        # Browse all movies
│   │   └── [id]/           # Movie detail page
│   ├── search/             # Search and filter page
│   ├── my-list/            # User watchlist page
│   ├── dashboard/          # User account dashboard
│   ├── admin/              # Admin movie management
│   └── pricing/            # Subscription plans page
├── components/
│   ├── Navbar.tsx          # Navigation bar
│   ├── MovieCard.tsx       # Movie card component
│   └── MovieRow.tsx         # Horizontal movie carousel
├── hooks/
│   ├── useAuth.tsx         # Authentication context
│   └── use-toast.ts        # Toast notifications
└── integrations/
    └── supabase/           # Supabase client configuration
```

## Database Schema

### Tables
- **users**: id, email, password_hash, name, avatar_url, role, subscription_tier
- **movies**: id, title, description, genre, release_year, rating, poster_url, backdrop_url, stream_url_720p, stream_url_1080p, is_premium_only, is_featured, view_count
- **watchlists**: id, user_id, movie_id (unique constraint)
- **subscriptions**: id, user_id, tier, start_date, end_date, status
- **payments**: id, user_id, amount, currency, payment_method, payment_status, transaction_id

## Core Systems

### Authentication
- **Status**: Implemented
- **Location**: `src/hooks/useAuth.tsx`
- **Features**: Sign Up, Sign In, Sign Out, Profile Management, JWT-based sessions

### Movie Browsing
- **Status**: Implemented
- **Location**: `src/app/page.tsx`, `src/app/movies/page.tsx`
- **Features**: Homepage with carousels, genre categories, featured movie hero

### Movie Details & Streaming
- **Status**: Implemented
- **Location**: `src/app/movies/[id]/page.tsx`
- **Features**: Movie info, video player, quality selection (720p/1080p), subscription-based access

### Search & Filter
- **Status**: Implemented
- **Location**: `src/app/search/page.tsx`
- **Features**: Search by title, filter by genre, year, sort by popularity/rating/title

### Watchlist
- **Status**: Implemented
- **Location**: `src/app/my-list/page.tsx`
- **Features**: Add/remove movies, view saved list

### User Dashboard
- **Status**: Implemented
- **Location**: `src/app/dashboard/page.tsx`
- **Features**: Account settings, subscription status, preferences

### Admin Dashboard
- **Status**: Implemented
- **Location**: `src/app/admin/page.tsx`
- **Features**: Add/edit/delete movies, upload images and streaming links, view stats

### Subscription Tiers
- **Status**: Implemented
- **Location**: `src/app/pricing/page.tsx`
- **Free Tier**: 720p quality, limited library
- **Premium Tier**: 1080p HD, full library, no ads

## Current State
- [x] User authentication (Sign Up/Sign In)
- [x] Homepage with movie carousels
- [x] Movie detail pages with streaming
- [x] Search and filter functionality
- [x] User watchlist feature
- [x] User dashboard with subscription management
- [x] Admin dashboard for movie management
- [x] Subscription tiers (Free/Premium)
- [x] Netflix-style dark theme

## Maintenance Log
- 2026-04-24: Initial project setup with Next.js 15, shadcn/ui, Tailwind CSS
- 2026-04-24: Database schema created with users, movies, watchlists, subscriptions, payments tables
- 2026-04-24: Authentication system implemented with Supabase Auth
- 2026-04-24: Movie browsing and streaming features completed
- 2026-04-24: Search, filter, watchlist, and admin dashboard implemented
- 2026-04-24: Subscription tiers and pricing page created
- 2026-04-24: Netflix-style dark theme applied
