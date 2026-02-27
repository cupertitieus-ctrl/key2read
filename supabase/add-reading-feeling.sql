-- Add reading_feeling and likes_reading columns to student_surveys
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)

ALTER TABLE student_surveys
ADD COLUMN IF NOT EXISTS reading_feeling TEXT DEFAULT '';

ALTER TABLE student_surveys
ADD COLUMN IF NOT EXISTS likes_reading TEXT DEFAULT '';
