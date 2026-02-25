-- ============================================================
-- key2read — Auth Migration: Add password_hash to users
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Add password_hash column for teacher/parent local auth
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
