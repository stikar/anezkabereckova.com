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
