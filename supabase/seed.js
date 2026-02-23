// ============================================================
// key2read — Seed Real Books Only (no fake users/students)
// ============================================================
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Charlie Picasso book series by Diane Alber
// Purple Space Chickens book series by Ryan Thomas & Diane Alber
const books = [
  { title: 'Charlie Picasso: And The Magic Pencil', author: 'Diane Alber', lexile_level: 500, grade_level: 'Ages 6-10', genre: 'Fiction', chapter_count: 10, description: 'Charlie discovers a magic pencil that brings his drawings to life.', cover_url: 'https://m.media-amazon.com/images/I/51zfQzUxd7L._SY445_SX342_FMwebp_.jpg' },
  { title: "Charlie Picasso: Don't Draw Robots", author: 'Diane Alber', lexile_level: 520, grade_level: 'Ages 6-10', genre: 'Fiction', chapter_count: 10, description: 'Charlie learns the hard way why some things are better left undrawn.', cover_url: 'https://m.media-amazon.com/images/I/41l1chUpgPL._SY300_.jpg' },
  { title: 'Charlie Picasso: Practice Makes Progress', author: 'Diane Alber', lexile_level: 510, grade_level: 'Ages 6-10', genre: 'Fiction', chapter_count: 10, description: 'Charlie discovers that getting better at art takes patience and practice.', cover_url: 'https://m.media-amazon.com/images/I/41CKhAo07kL._SY300_.jpg' },
  { title: 'Charlie Picasso: Turtle Trouble', author: 'Diane Alber', lexile_level: 490, grade_level: 'Ages 6-10', genre: 'Fiction', chapter_count: 10, description: 'Charlie accidentally draws a turtle that causes all kinds of trouble.', cover_url: 'https://m.media-amazon.com/images/I/41lDTfcis+L._SY300_.jpg' },
  { title: 'Charlie Picasso: Hamster Chaos', author: 'Diane Alber', lexile_level: 500, grade_level: 'Ages 6-10', genre: 'Fiction', chapter_count: 10, description: 'Charlie draws a hamster that creates hilarious chaos everywhere it goes.', cover_url: 'https://m.media-amazon.com/images/I/41ulXTwzlrL._SY300_.jpg' },
  { title: 'Purple Space Chickens', author: 'Ryan Thomas & Diane Alber', lexile_level: 510, grade_level: 'Ages 6-10', genre: 'Fiction', chapter_count: 9, description: 'Bear finds a tiny purple space chicken named Nugget in his garden — and discovers she can teleport him through bathrooms!', cover_url: 'https://m.media-amazon.com/images/I/514-TmU++4L._SY300_.jpg' },
  { title: 'Purple Space Chickens: Toy Mode', author: 'Ryan Thomas & Diane Alber', lexile_level: 520, grade_level: 'Ages 6-10', genre: 'Fiction', chapter_count: 10, description: 'The purple space chickens discover toy mode and things get wild.', cover_url: 'https://m.media-amazon.com/images/I/41VG8trdygL._SY300_.jpg' },
  { title: 'Purple Space Chickens: Mysterious Bracelet', author: 'Ryan Thomas & Diane Alber', lexile_level: 510, grade_level: 'Ages 6-10', genre: 'Fiction', chapter_count: 10, description: 'A mysterious bracelet leads the purple space chickens on a new adventure.', cover_url: 'https://m.media-amazon.com/images/I/41ZbVL0i5EL._SY300_.jpg' },
  { title: 'Purple Space Chickens: Level Up', author: 'Ryan Thomas & Diane Alber', lexile_level: 530, grade_level: 'Ages 6-10', genre: 'Fiction', chapter_count: 10, description: 'The purple space chickens level up and face bigger challenges.', cover_url: 'https://m.media-amazon.com/images/I/51AuwcUZWwL._SY300_.jpg' },
  { title: 'Purple Space Chickens: Double Trouble', author: 'Ryan Thomas & Diane Alber', lexile_level: 520, grade_level: 'Ages 6-10', genre: 'Fiction', chapter_count: 10, description: 'Double the chickens means double the trouble in this hilarious adventure.', cover_url: 'https://m.media-amazon.com/images/I/51ho91Vl7oL._SY300_.jpg' }
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
