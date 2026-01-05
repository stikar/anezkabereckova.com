-- Add soft delete column to gallery_images
alter table public.gallery_images
add column deleted_at timestamp with time zone;

-- Add index for faster queries on non-deleted images
create index gallery_images_deleted_at_idx on public.gallery_images(deleted_at)
where deleted_at is null;

-- Add comment explaining the soft delete
comment on column public.gallery_images.deleted_at is 'Timestamp when image was soft-deleted. NULL means image is active.';
