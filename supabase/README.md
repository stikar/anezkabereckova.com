# Supabase Migrations

This folder contains database migrations for the Anežka Berecková portfolio website.

## Migrations

Migrations are SQL files that set up your database schema and policies. They run in order based on their timestamp.

### Available Migrations

1. **20260105000001_create_gallery_images_table.sql**
   - Creates the `gallery_images` table
   - Sets up Row Level Security policies
   - Creates indexes for performance

2. **20260105000002_create_storage_bucket_policies.sql**
   - Creates the `gallery-images` storage bucket
   - Sets up storage policies for public access
   - Allows authenticated users to upload/delete

## Running Migrations

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor**
3. Copy the contents of each migration file (in order)
4. Paste and run each migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Push migrations to your project
supabase db push
```

**Install Supabase CLI:**
```bash
npm install -g supabase
```

### Option 3: Local Development

To run Supabase locally:

```bash
# Start local Supabase (requires Docker)
supabase start

# Apply migrations
supabase db reset
```

## Creating New Migrations

To create a new migration:

```bash
supabase migration new your_migration_name
```

Or manually create a file in `supabase/migrations/` with format:
```
YYYYMMDDHHMMSS_your_migration_name.sql
```

## More Information

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Database Migrations Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)
