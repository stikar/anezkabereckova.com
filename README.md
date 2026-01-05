# Anežka Berecková - Portfolio Website

A minimalist portfolio website for fashion designer Anežka Berecková, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Clean, elegant design optimized for showcasing fashion design work
- Dark/Light theme toggle with system preference support
- Fully responsive layout for all device sizes
- Static site generation for GitHub Pages deployment
- Portfolio gallery section
- Contact page

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- next-themes for theme switching

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

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
├── app/                  # Next.js app directory
│   ├── contact/         # Contact page
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # React components
│   ├── divider.tsx
│   ├── footer.tsx
│   ├── header.tsx
│   ├── portfolio.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── public/              # Static assets
└── next.config.js       # Next.js configuration
```

## License

©2026 Anežka Berecková
