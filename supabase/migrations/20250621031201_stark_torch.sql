/*
  # Add RLS policies for avatar storage

  1. Storage Policies
    - Enable RLS on storage.objects table for avatars bucket
    - Add policy for authenticated users to upload avatars
    - Add policy for authenticated users to view avatars
    - Add policy for authenticated users to update their own avatars
    - Add policy for authenticated users to delete their own avatars

  2. Security
    - Users can only upload/update/delete avatars with filenames that start with their user ID
    - All authenticated users can view avatars (for profile pictures in UI)
*/

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for uploading avatars (INSERT)
CREATE POLICY "Users can upload their own avatars"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = split_part(name, '-', 1)
  );

-- Policy for viewing avatars (SELECT)
CREATE POLICY "Anyone can view avatars"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'avatars');

-- Policy for updating avatars (UPDATE)
CREATE POLICY "Users can update their own avatars"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = split_part(name, '-', 1)
  )
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = split_part(name, '-', 1)
  );

-- Policy for deleting avatars (DELETE)
CREATE POLICY "Users can delete their own avatars"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = split_part(name, '-', 1)
  );

-- Create the avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;