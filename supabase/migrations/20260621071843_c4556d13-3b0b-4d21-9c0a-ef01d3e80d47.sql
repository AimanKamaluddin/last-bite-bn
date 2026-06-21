
CREATE POLICY "Public read uploads" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'uploads');
CREATE POLICY "Users upload to own folder" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users update own files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users delete own files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'uploads' AND (storage.foldername(name))[1] = auth.uid()::text);
