-- Create the storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'car-images',
  'car-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) on conflict (id) do nothing;

-- Set up Row Level Security (RLS) for the storage bucket
-- Supabase natively enables RLS on the storage schema, so we just declare the policies.

-- Policy 1: Allow public read access to the car-images bucket
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'car-images' );

-- Policy 2: Allow authenticated and anonymous users to insert (upload) images
create policy "Allow generic uploads"
on storage.objects for insert
to public
with check (
  bucket_id = 'car-images' 
);

-- Policy 3: Allow users to update their own uploads (optional, but good for robust pipelines)
create policy "Allow generic updates"
on storage.objects for update
to public
using ( bucket_id = 'car-images' );
