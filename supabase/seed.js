// ============================================================
// key2read — Seed Real Books Only (no fake users/students)
// ============================================================
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Charlie Picasso book series
const books = [
  { title: 'And The Magic Pencil', author: 'Charlie Picasso', lexile_level: 500, grade_level: 'K-2', genre: 'Fiction', chapter_count: 10, description: 'Charlie discovers a magic pencil that brings his drawings to life.', cover_url: 'https://m.media-amazon.com/images/I/51zfQzUxd7L._SY445_SX342_FMwebp_.jpg' },
  { title: "Don't Draw Robots", author: 'Charlie Picasso', lexile_level: 520, grade_level: 'K-2', genre: 'Fiction', chapter_count: 10, description: 'Charlie learns the hard way why some things are better left undrawn.', cover_url: 'https://m.media-amazon.com/images/I/41l1chUpgPL._SY300_.jpg' },
  { title: 'Practice Makes Progress', author: 'Charlie Picasso', lexile_level: 510, grade_level: 'K-2', genre: 'Fiction', chapter_count: 10, description: 'Charlie discovers that getting better at art takes patience and practice.', cover_url: 'https://m.media-amazon.com/images/I/41CKhAo07kL._SY300_.jpg' },
  { title: 'Turtle Trouble', author: 'Charlie Picasso', lexile_level: 490, grade_level: 'K-2', genre: 'Fiction', chapter_count: 10, description: 'Charlie accidentally draws a turtle that causes all kinds of trouble.', cover_url: 'https://m.media-amazon.com/images/I/41lDTfcis+L._SY300_.jpg' },
  { title: 'Hamster Chaos', author: 'Charlie Picasso', lexile_level: 500, grade_level: 'K-2', genre: 'Fiction', chapter_count: 10, description: 'Charlie draws a hamster that creates hilarious chaos everywhere it goes.', cover_url: 'https://m.media-amazon.com/images/I/41ulXTwzlrL._SY300_.jpg' }
];

async function seed() {
  console.log('🔑 key2read — Seeding Book Library\n');

  // Clear existing data
  const { data: existing } = await supabase.from('books').select('id').limit(1);
  if (existing && existing.length > 0) {
    console.log('⚠️  Books already exist. Clearing and re-seeding...');
    await supabase.from('quiz_questions').delete().neq('id', 0);
    await supabase.from('chapters').delete().neq('id', 0);
    await supabase.from('books').delete().neq('id', 0);
  }

  // Insert books
  const { data: insertedBooks, error } = await supabase.from('books').insert(books).select();
  if (error) { console.error('❌ Failed to insert books:', error.message); process.exit(1); }
  console.log(`✅ Inserted ${insertedBooks.length} books\n`);

  console.log('📚 Books seeded:');
  insertedBooks.forEach(b => console.log(`   ${b.title} — ${b.author}`));
  console.log('\n✅ Done! No fake data — real users come from real signups.');
  console.log('   Flow: Teacher signs up → gets class code → shares with students → students join\n');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
