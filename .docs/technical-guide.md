# Technical Guide

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

Follow the detailed setup guide in **[supabase-setup.md](./supabase-setup.md)** to:

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
