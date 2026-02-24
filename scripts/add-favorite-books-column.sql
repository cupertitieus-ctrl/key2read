-- Run this in the Supabase SQL Editor to add the favorite_books column
-- Supabase Dashboard → SQL Editor → New query → Paste and run

ALTER TABLE student_surveys
ADD COLUMN IF NOT EXISTS favorite_books JSONB DEFAULT '[]'::jsonb;
