-- ============================================================
-- key2read — Add page_start/page_end to chapters table
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Add columns (safe to run multiple times - IF NOT EXISTS)
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS page_start INTEGER DEFAULT NULL;
ALTER TABLE chapters ADD COLUMN IF NOT EXISTS page_end INTEGER DEFAULT NULL;

-- Done! Now run: node scripts/update-chapter-pages.js
