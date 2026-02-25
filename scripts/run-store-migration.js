#!/usr/bin/env node
// Run the store-items migration against Supabase
// Uses the Supabase REST API (pg_query) or falls back to individual table creation
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function runMigration() {
  console.log('🔧 Running store-items migration...\n');

  // Step 1: Create store_items table via raw SQL using the Supabase REST endpoint
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  // Try using the /rest/v1/rpc endpoint — won't work for DDL
  // Instead, test if the tables already exist by trying to query them

  // Check if store_items table exists
  console.log('1️⃣  Checking store_items table...');
  const { data: storeData, error: storeErr } = await supabase
    .from('store_items')
    .select('id')
    .limit(1);

  if (storeErr && storeErr.message.includes('does not exist')) {
    console.log('   ❌ store_items table does not exist.');
    console.log('   ⚠️  The anon key cannot create tables via the REST API.');
    console.log('   📋 You need to run the SQL migration manually in the Supabase SQL Editor.\n');
    console.log('   Steps:');
    console.log('   1. Go to https://supabase.com/dashboard/project/iujqyifmvmxpizwsoksc/sql');
    console.log('   2. Copy and paste the contents of supabase/store-items-migration.sql');
    console.log('   3. Click "Run"\n');

    // Try the Management API approach
    console.log('   Attempting via Supabase Management API...\n');

    const fs = require('fs');
    const sql = fs.readFileSync(require('path').join(__dirname, '..', 'supabase', 'store-items-migration.sql'), 'utf8');

    // Try using the pg_query function via RPC
    const { data: rpcData, error: rpcErr } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (rpcErr) {
      console.log('   RPC approach not available (expected - need service role key or custom function).');
      console.log('\n   🔗 Direct link to SQL Editor:');
      console.log('   https://supabase.com/dashboard/project/iujqyifmvmxpizwsoksc/sql/new\n');

      // As an alternative, let's try to access the database directly via fetch
      const sqlStatements = [
        // Create store_items
        `CREATE TABLE IF NOT EXISTS store_items (
          id BIGSERIAL PRIMARY KEY,
          class_id BIGINT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          price INTEGER NOT NULL DEFAULT 25,
          stock INTEGER NOT NULL DEFAULT 10,
          icon TEXT DEFAULT '🎁',
          image_url TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )`,
        // Create index
        `CREATE INDEX IF NOT EXISTS idx_store_items_class_id ON store_items(class_id)`,
        // Create reward_gallery
        `CREATE TABLE IF NOT EXISTS reward_gallery (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          image_url TEXT NOT NULL,
          category TEXT DEFAULT 'general',
          created_at TIMESTAMPTZ DEFAULT NOW()
        )`
      ];

      // Try via the Supabase SQL API (requires service role)
      for (const stmt of sqlStatements) {
        try {
          const resp = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: stmt })
          });
        } catch (e) {
          // expected to fail
        }
      }

      // Final check
      const { data: check, error: checkErr } = await supabase
        .from('store_items')
        .select('id')
        .limit(1);

      if (checkErr && checkErr.message.includes('does not exist')) {
        console.log('   ❌ Could not create tables automatically.');
        console.log('   Please run the migration SQL manually in the Supabase dashboard.\n');
        process.exit(1);
      } else {
        console.log('   ✅ store_items table created!\n');
      }
    } else {
      console.log('   ✅ Migration applied via RPC!\n');
    }
  } else if (storeErr) {
    console.log(`   ⚠️  Error: ${storeErr.message}`);
  } else {
    console.log('   ✅ store_items table already exists!');
  }

  // Check if reward_gallery table exists
  console.log('2️⃣  Checking reward_gallery table...');
  const { data: galleryData, error: galleryErr } = await supabase
    .from('reward_gallery')
    .select('id')
    .limit(1);

  if (galleryErr && galleryErr.message.includes('does not exist')) {
    console.log('   ❌ reward_gallery table does not exist.');
    console.log('   Please run the migration SQL in Supabase SQL Editor.');
  } else if (galleryErr) {
    console.log(`   ⚠️  Error: ${galleryErr.message}`);
  } else {
    console.log('   ✅ reward_gallery table already exists!');
  }

  // Check storage bucket
  console.log('3️⃣  Checking store-images storage bucket...');
  const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();

  if (bucketsErr) {
    console.log(`   ⚠️  Could not list buckets: ${bucketsErr.message}`);
  } else {
    const storeImagesBucket = buckets?.find(b => b.id === 'store-images');
    if (storeImagesBucket) {
      console.log('   ✅ store-images bucket already exists!');
    } else {
      console.log('   Creating store-images bucket...');
      const { data: newBucket, error: createErr } = await supabase.storage.createBucket('store-images', {
        public: true
      });
      if (createErr) {
        console.log(`   ⚠️  Could not create bucket: ${createErr.message}`);
        console.log('   Include the bucket creation SQL when running the migration.');
      } else {
        console.log('   ✅ store-images bucket created!');
      }
    }
  }

  console.log('\n✨ Migration check complete!');
}

runMigration().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
