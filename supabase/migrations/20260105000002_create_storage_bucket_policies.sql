-- Create storage bucket for gallery images
insert into storage.buckets (id, name, public)
values ('gallery-images', 'gallery-images', true)
on conflict (id) do nothing;

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
