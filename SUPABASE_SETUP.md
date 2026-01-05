# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized

## 2. Create Database Table

Go to the SQL Editor in your Supabase dashboard and run this SQL:

```sql
-- Create gallery_images table
create table public.gallery_images (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  storage_path text not null,
  alt_text text default 'Portfolio image'::text,
  display_order integer not null,
  width integer,
  height integer
);

-- Enable Row Level Security
alter table public.gallery_images enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access"
  on public.gallery_images
  for select
  using (true);

-- Create policy to allow authenticated users to insert/update/delete
create policy "Allow authenticated users full access"
  on public.gallery_images
  for all
  using (auth.role() = 'authenticated');

-- Create index for ordering
create index gallery_images_display_order_idx on public.gallery_images(display_order);
```

## 3. Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket named: `gallery-images`
3. Make it **public** (so images are accessible without authentication)
4. Enable **Image Transformation** in the bucket settings

### Set Bucket Policies

Run this SQL to set up storage policies:

```sql
-- Allow public read access to gallery-images bucket
create policy "Public Access"
  on storage.objects for select
  using (bucket_id = 'gallery-images');

-- Allow authenticated users to upload
create policy "Authenticated users can upload"
  on storage.objects for insert
  with check (bucket_id = 'gallery-images' and auth.role() = 'authenticated');

-- Allow authenticated users to delete
create policy "Authenticated users can delete"
  on storage.objects for delete
  using (bucket_id = 'gallery-images' and auth.role() = 'authenticated');
```

## 4. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Get your project URL and anon key from: **Settings > API**
3. Update the values in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. Create Admin User

1. Go to **Authentication > Users** in Supabase dashboard
2. Click **Add User**
3. Create a user with email and password
4. Use these credentials to log in to `/admin`

## 6. Enable Email Authentication (Optional)

If you want email/password authentication:

1. Go to **Authentication > Providers**
2. Enable **Email** provider
3. Configure email templates if needed

## 7. Test the Setup

1. Run `npm run dev`
2. Go to `/admin` and log in with your admin credentials
3. Upload test images
4. Check that images appear in the gallery on the home page

## Supabase Image Transformation

Supabase automatically generates optimized thumbnails and transforms images on-the-fly:

- **Thumbnails**: 600x800px WebP format (for gallery grid)
- **Full size**: 2000px width WebP format (for lightbox)
- Automatic format conversion and optimization
- CDN caching for fast loading

No need for manual image processing!
