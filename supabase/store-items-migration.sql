-- ============================================================
-- key2read — Store Items Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- Adds: store_items table, reward_gallery table, store-images storage bucket
-- ============================================================

-- ─── STORE ITEMS TABLE ───
CREATE TABLE IF NOT EXISTS store_items (
  id BIGSERIAL PRIMARY KEY,
  class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 25,
  stock INTEGER NOT NULL DEFAULT 10,
  icon TEXT DEFAULT '🎁',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by class
CREATE INDEX IF NOT EXISTS idx_store_items_class_id ON store_items(class_id);

-- ─── REWARD GALLERY (admin-uploaded images teachers can choose from) ───
CREATE TABLE IF NOT EXISTS reward_gallery (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SUPABASE STORAGE BUCKET FOR STORE IMAGES ───
INSERT INTO storage.buckets (id, name, public)
VALUES ('store-images', 'store-images', true)
ON CONFLICT DO NOTHING;

-- Allow anyone to read store images (students need to see them)
DO $$ BEGIN
  CREATE POLICY "Anyone can read store images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'store-images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Allow authenticated uploads (teachers uploading via anon key)
DO $$ BEGIN
  CREATE POLICY "Anyone can upload store images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'store-images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Allow deletion of store images
DO $$ BEGIN
  CREATE POLICY "Anyone can delete store images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'store-images');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
