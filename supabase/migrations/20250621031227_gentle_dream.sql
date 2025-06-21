/*
  # Avatar Storage Setup

  1. Storage Bucket
    - Create 'avatars' bucket for user profile pictures
    - Set as public bucket for easy access

  2. Security Policies
    - Users can upload avatars with their user ID in filename
    - All authenticated users can view avatars
    - Users can update/delete only their own avatars

  3. RLS Configuration
    - Enable row level security on storage objects
    - Apply policies using Supabase storage policy functions
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

-- Create storage policies using Supabase's policy functions
-- Policy for uploading avatars (users can upload files that start with their user ID)
CREATE POLICY "Users can upload their own avatars" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
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
    (storage.foldername(name))[1] = auth.uid()::text
  ) WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy for deleting avatars (users can only delete their own)
CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );