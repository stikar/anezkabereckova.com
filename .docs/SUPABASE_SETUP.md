# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to **https://supabase.com** and sign up/sign in
2. Click **New Project** button
3. Fill in:
   - **Name**: Your project name (e.g., "anezkabereckova-gallery")
   - **Database Password**: Choose a strong password (save it somewhere safe)
   - **Region**: Choose the closest region to your users
4. Click **Create new project**
5. Wait 1-2 minutes for the project to be fully initialized

**Direct link to create project:** https://app.supabase.com/new

## 2. Create Database Table

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
   - Direct link: `https://app.supabase.com/project/YOUR_PROJECT_ID/sql/new`
2. Click **New query** button
3. Copy and paste the SQL below
4. Click **Run** (or press Cmd/Ctrl + Enter)

**SQL to run:**

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

1. In your Supabase dashboard, click **Storage** in the left sidebar
   - Direct link: `https://app.supabase.com/project/YOUR_PROJECT_ID/storage/buckets`
2. Click **New bucket** button
3. Fill in:
   - **Name**: `gallery-images` (must be exactly this name)
   - **Public bucket**: Toggle this **ON** (images need to be publicly accessible)
4. Click **Create bucket**
5. Click on the newly created `gallery-images` bucket
6. Click the **Settings** tab (if available) to enable **Image Transformation**

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

### Step 1: Copy the environment template

```bash
cp .env.local.example .env.local
```

### Step 2: Get your Supabase credentials

1. Go to your Supabase project dashboard: **https://app.supabase.com**
2. Select your project
3. In the left sidebar, click **Project Settings** (gear icon at the bottom)
4. Click **API** in the settings menu

### Step 3: Copy the values

On the API settings page, you'll find:

**Project URL**
- Look for the section labeled "Project URL"
- Copy the URL (format: `https://xxxxxxxxxxxxx.supabase.co`)
- This is your `NEXT_PUBLIC_SUPABASE_URL`

**API Keys**
- Look for the section labeled "Project API keys"
- Find the **anon public** key (it will be a long string starting with `eyJ...`)
- Copy this key
- This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Update .env.local

Open `.env.local` and replace the placeholder values:

```bash
# Replace these with your actual values from https://app.supabase.com/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:**
- Never commit `.env.local` to git (it's already in `.gitignore`)
- The `anon` key is safe to use in client-side code
- Do **NOT** use the `service_role` key in your `.env.local` file

## 5. Create Admin User

1. In your Supabase dashboard, click **Authentication** in the left sidebar
   - Direct link: `https://app.supabase.com/project/YOUR_PROJECT_ID/auth/users`
2. Click **Add user** button (green button in top right)
3. Select **Create new user**
4. Fill in:
   - **Email**: Your admin email (e.g., `admin@anezkabereckova.com`)
   - **Password**: Choose a strong password
   - **Auto Confirm User**: Toggle this **ON** (so you don't need to verify email)
5. Click **Create user**
6. Save these credentials - you'll use them to log in to `/admin`

## 6. Enable Email Authentication

Email authentication should be enabled by default, but verify:

1. In your Supabase dashboard, go to **Authentication > Providers**
   - Direct link: `https://app.supabase.com/project/YOUR_PROJECT_ID/auth/providers`
2. Find **Email** in the list of providers
3. Make sure it's **Enabled** (toggle should be green)
4. Click **Email** to configure settings if needed:
   - **Confirm email**: Can be disabled for development
   - **Secure email change**: Recommended to keep enabled

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
