# Anežka Berecková - Portfolio Website

A minimalist portfolio website for fashion designer Anežka Berecková, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Clean, elegant design optimized for showcasing fashion design work
- Dark/Light theme toggle with system preference support
- Fully responsive layout for all device sizes
- Photo gallery with lightbox (swipe gestures, keyboard navigation)
- **Supabase-powered gallery management** with admin interface
- Automatic image optimization and thumbnail generation
- Contact page

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Database + Storage)
- shadcn/ui components
- next-themes for theme switching

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

Follow the detailed setup guide in **[.docs/SUPABASE_SETUP.md](./.docs/SUPABASE_SETUP.md)** to:

1. Create a Supabase project
2. Set up database tables and storage
3. Configure authentication
4. Get your API credentials

### 3. Environment Variables

Copy `.env.local.example` to `.env.local` and add your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your values from Supabase dashboard.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Admin Panel

Access the admin interface at `/admin` to manage gallery images:

- **Upload images** - Drag and drop or select files
- **Reorder images** - Move images up/down to change gallery order
- **Delete images** - Remove images from gallery
- **Auto-optimization** - Images are automatically converted to WebP and thumbnails are generated

**Default admin access:**
Create an admin user in Supabase Authentication dashboard, then use those credentials to log in.

## Building for Production

Build and export static site:

```bash
npm run build
```

The static files will be generated in the `out` directory.

## Deployment

This site is configured to deploy automatically to GitHub Pages when pushing to the `production` branch.

### Setup GitHub Pages

1. Go to your repository Settings > Pages
2. Under "Build and deployment", select "GitHub Actions" as the source
3. Push to the `production` branch to trigger deployment

## Project Structure

```
.
├── .docs/               # Documentation
│   └── SUPABASE_SETUP.md
├── app/                 # Next.js app directory
│   ├── admin/          # Admin interface
│   ├── contact/        # Contact page
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── divider.tsx
│   ├── footer.tsx
│   ├── portfolio.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/               # Utility functions
│   └── supabase/     # Supabase client & helpers
├── public/           # Static assets
│   └── gallery/     # Gallery images
└── next.config.js   # Next.js configuration
```

## Documentation

Detailed documentation is available in the [`.docs`](./.docs) folder:

- **[Supabase Setup Guide](./.docs/SUPABASE_SETUP.md)** - Complete guide for setting up Supabase database, storage, and authentication

## License

©2026 Anežka Berecková
