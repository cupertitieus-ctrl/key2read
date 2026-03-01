// Add followed_instructions and animals_selected_count columns to student_surveys
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function addColumns() {
  // Add columns via SQL
  const { error: err1 } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE student_surveys ADD COLUMN IF NOT EXISTS followed_instructions BOOLEAN DEFAULT NULL;`
  });

  const { error: err2 } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE student_surveys ADD COLUMN IF NOT EXISTS animals_selected_count INTEGER DEFAULT 0;`
  });

  // If RPC doesn't exist, try direct SQL
  if (err1 || err2) {
    console.log('RPC not available, trying direct approach...');
    // Just try to insert with the new fields - Supabase will error if columns don't exist
    // The columns need to be added via Supabase Dashboard SQL Editor
    console.log('Please run this SQL in Supabase Dashboard SQL Editor:');
    console.log('');
    console.log('ALTER TABLE student_surveys ADD COLUMN IF NOT EXISTS followed_instructions BOOLEAN DEFAULT NULL;');
    console.log('ALTER TABLE student_surveys ADD COLUMN IF NOT EXISTS animals_selected_count INTEGER DEFAULT 0;');
    console.log('');
    console.log('The code will still work without these columns - it will just silently skip saving them.');
  } else {
    console.log('Columns added successfully!');
  }
}

addColumns().catch(console.error);
