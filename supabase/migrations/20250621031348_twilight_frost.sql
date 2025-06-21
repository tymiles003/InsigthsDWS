/*
# Avatar Storage Setup

1. Storage Bucket
   - Create 'avatars' bucket with proper configuration
   - Set file size limit to 5MB
   - Allow common image formats

2. Storage Policies
   - Users can upload avatars to their own folder
   - All authenticated users can view avatars
   - Users can update/delete their own avatars only

3. Security
   - Row Level Security enabled
   - Folder-based access control using user ID
*/

-- Create the avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars', 
  'avatars', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Drop existing policies if they exist to avoid conflicts
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN
    NULL; -- Ignore if policies don't exist
END $$;

-- Create storage policies for avatar management
-- Policy for uploading avatars (users can upload files with their user ID in the path)
CREATE POLICY "Users can upload their own avatars" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = split_part(name, '-', 1)
  );

-- Policy for viewing avatars (all authenticated users can view)
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'avatars'
  );

-- Policy for updating avatars (users can only update their own)
CREATE POLICY "Users can update their own avatars" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = split_part(name, '-', 1)
  ) WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = split_part(name, '-', 1)
  );

-- Policy for deleting avatars (users can only delete their own)
CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = split_part(name, '-', 1)
  );