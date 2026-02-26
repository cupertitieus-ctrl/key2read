-- Add fulfilled column to store_purchases table
-- This lets teachers mark when they've given a prize to a student
ALTER TABLE store_purchases ADD COLUMN IF NOT EXISTS fulfilled BOOLEAN DEFAULT FALSE;
