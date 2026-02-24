#!/usr/bin/env node
// Add analytics columns to students table
// This needs to be run via Supabase SQL Editor since anon key can't ALTER TABLE
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkAndReport() {
  const cols = [
    'is_teacher_demo', 'comprehension_label', 'comprehension_pct',
    'reasoning_label', 'reasoning_pct', 'vocab_words_learned',
    'independence_label', 'persistence_label', 'score_trend', 'analytics_updated_at'
  ];

  const missing = [];
  const existing = [];

  for (const col of cols) {
    const { error } = await supabase.from('students').select(col).limit(1);
    if (error) {
      missing.push(col);
    } else {
      existing.push(col);
    }
  }

  if (existing.length > 0) console.log('Existing columns:', existing.join(', '));

  if (missing.length === 0) {
    console.log('All analytics columns exist! No migration needed.');
    return;
  }

  console.log('\nMissing columns:', missing.join(', '));
  console.log('\n=== Run this SQL in Supabase SQL Editor ===\n');

  const sqlMap = {
    'is_teacher_demo': "ALTER TABLE students ADD COLUMN IF NOT EXISTS is_teacher_demo BOOLEAN DEFAULT FALSE;",
    'comprehension_label': "ALTER TABLE students ADD COLUMN IF NOT EXISTS comprehension_label TEXT DEFAULT NULL;",
    'comprehension_pct': "ALTER TABLE students ADD COLUMN IF NOT EXISTS comprehension_pct INTEGER DEFAULT NULL;",
    'reasoning_label': "ALTER TABLE students ADD COLUMN IF NOT EXISTS reasoning_label TEXT DEFAULT NULL;",
    'reasoning_pct': "ALTER TABLE students ADD COLUMN IF NOT EXISTS reasoning_pct INTEGER DEFAULT NULL;",
    'vocab_words_learned': "ALTER TABLE students ADD COLUMN IF NOT EXISTS vocab_words_learned INTEGER DEFAULT 0;",
    'independence_label': "ALTER TABLE students ADD COLUMN IF NOT EXISTS independence_label TEXT DEFAULT NULL;",
    'persistence_label': "ALTER TABLE students ADD COLUMN IF NOT EXISTS persistence_label TEXT DEFAULT NULL;",
    'score_trend': "ALTER TABLE students ADD COLUMN IF NOT EXISTS score_trend TEXT DEFAULT 'stable';",
    'analytics_updated_at': "ALTER TABLE students ADD COLUMN IF NOT EXISTS analytics_updated_at TIMESTAMPTZ DEFAULT NULL;"
  };

  for (const col of missing) {
    console.log(sqlMap[col]);
  }

  console.log('\nDashboard URL: https://supabase.com/dashboard/project/iujqyifmvmxpizwsoksc/sql');
}

checkAndReport();
