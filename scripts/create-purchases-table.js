#!/usr/bin/env node
// Create store_purchases table for tracking purchase history
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
  console.log('Checking store_purchases table...');
  const { data, error } = await supabase.from('store_purchases').select('id').limit(1);

  if (error && error.message.includes('does not exist')) {
    console.log('Table does not exist. Please run this SQL in Supabase SQL Editor:\n');
    console.log(`
CREATE TABLE IF NOT EXISTS store_purchases (
  id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_store_purchases_class_id ON store_purchases(class_id);
CREATE INDEX IF NOT EXISTS idx_store_purchases_student_id ON store_purchases(student_id);

-- Enable RLS
ALTER TABLE store_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for anon" ON store_purchases FOR ALL TO anon USING (true) WITH CHECK (true);
    `);
    console.log('\nDirect link: https://supabase.com/dashboard/project/iujqyifmvmxpizwsoksc/sql/new');
  } else if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('✅ store_purchases table already exists!');
  }
}

run().catch(console.error);
