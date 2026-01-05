# Supabase Setup Guide

## 1. Supabase Project Setup

### If you already have a Supabase project:

You can use your existing Supabase project for this application. Simply select your project from the dashboard and proceed to **Step 2** to configure the environment variables.

**Access your projects:** https://app.supabase.com

### If you need to create a new project:

1. Go to **https://supabase.com** and sign up/sign in
2. Click **New Project** button
3. Fill in:
   - **Name**: Your project name (e.g., "anezkabereckova-gallery")
   - **Database Password**: Choose a strong password (save it somewhere safe)
   - **Region**: Choose the closest region to your users
4. Click **Create new project**
5. Wait 1-2 minutes for the project to be fully initialized

**Direct link to create project:** https://app.supabase.com/new

## 2. Configure Environment Variables

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
- Find the **anon / Publishable key** (it will be a long string starting with `eyJ...`)
- Click the copy icon to copy this key
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
- The Publishable key (anon key) is safe to use in client-side code
- Do **NOT** use the `service_role` / Secret key in your `.env.local` file

## 3. Run Database Migrations

Database migrations are located in the `supabase/migrations/` folder.

### Option A: Using Supabase Dashboard (Easiest)

1. In your Supabase dashboard, click **SQL Editor** in the left sidebar
   - Direct link: `https://app.supabase.com/project/YOUR_PROJECT_ID/sql/new`

2. Run **Migration 1** - Create gallery_images table:
   - Open `supabase/migrations/20260105000001_create_gallery_images_table.sql`
   - Copy the entire contents
   - Paste into SQL Editor
   - Click **Run** (or press Cmd/Ctrl + Enter)

3. Run **Migration 2** - Create storage bucket and policies:
   - Open `supabase/migrations/20260105000002_create_storage_bucket_policies.sql`
   - Copy the entire contents
   - Paste into SQL Editor
   - Click **Run**

### Option B: Using Supabase CLI (Advanced)

If you have the [Supabase CLI](https://supabase.com/docs/guides/cli) installed:

```bash
# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Push all migrations
supabase db push
```

**Verify migrations ran successfully:**

- Go to **Table Editor** and you should see the `gallery_images` table
- Go to **Storage** and you should see the `gallery-images` bucket

## 4. Verify Storage Bucket

The storage bucket should have been created automatically by Migration 2.

**Verify:**

1. Go to **Storage** in your Supabase dashboard
   - Direct link: `https://app.supabase.com/project/YOUR_PROJECT_ID/storage/buckets`
2. You should see the `gallery-images` bucket listed
3. Click on it to verify it's configured as **Public**

**Enable Image Transformation (Optional but recommended):**

1. Click on the `gallery-images` bucket
2. If there's a **Settings** or **Configuration** option, enable **Image Transformation**
3. This allows Supabase to automatically optimize and resize images

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
