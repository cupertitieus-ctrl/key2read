-- Shopify + Klaviyo Integration Migration
-- Adds columns for tracking Shopify orders and webhook idempotency

-- Add Shopify columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS shopify_order_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS shopify_customer_id TEXT;

-- Create table for tracking processed webhooks (idempotency)
CREATE TABLE IF NOT EXISTS shopify_webhooks (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  customer_email TEXT,
  plan TEXT,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for Shopify order dedup
CREATE INDEX IF NOT EXISTS idx_shopify_webhooks_order ON shopify_webhooks(order_id);
