-- Create storage buckets for document uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('documents', 'documents', false),
  ('profile-photos', 'profile-photos', true),
  ('content', 'content', false),
  ('past-papers', 'past-papers', false),
  ('merchandise', 'merchandise', true);

-- RLS policies for documents bucket (private - requires auth)
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Staff can view all documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' 
  AND public.is_staff(auth.uid())
);

-- RLS policies for profile-photos bucket (public)
CREATE POLICY "Anyone can view profile photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload their own profile photo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile photo"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policies for content bucket
CREATE POLICY "Authenticated users can view content"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'content' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Staff can upload content"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'content' 
  AND public.is_staff(auth.uid())
);

-- RLS policies for past-papers bucket
CREATE POLICY "Authenticated users can view past papers"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'past-papers' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Staff can upload past papers"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'past-papers' 
  AND public.is_staff(auth.uid())
);

-- RLS policies for merchandise bucket (public)
CREATE POLICY "Anyone can view merchandise images"
ON storage.objects FOR SELECT
USING (bucket_id = 'merchandise');

CREATE POLICY "Admin can upload merchandise images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'merchandise' 
  AND public.has_role(auth.uid(), 'admin')
);