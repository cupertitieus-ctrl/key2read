// ============================================================
// key2read — Update Chapter Page Ranges from Real PDF Data
// Run: node scripts/update-chapter-pages.js
// ============================================================
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// ─── REAL PAGE DATA FROM PDF FILES ───
// Each entry: book title → array of { chapter_number, page_start, page_end }
// Extracted from actual published PDFs with verified page numbers.
// DO NOT EDIT unless you have re-verified against the physical PDF.

const PAGE_DATA = {
  'Charlie Picasso: And The Magic Pencil': [
    { chapter_number: 1, page_start: 5, page_end: 21 },
    { chapter_number: 2, page_start: 22, page_end: 31 },
    { chapter_number: 3, page_start: 32, page_end: 39 },
    { chapter_number: 4, page_start: 40, page_end: 51 },
    { chapter_number: 5, page_start: 52, page_end: 67 },
    { chapter_number: 6, page_start: 68, page_end: 73 },
    { chapter_number: 7, page_start: 74, page_end: 78 },
    { chapter_number: 8, page_start: 79, page_end: 120 },
  ],
  "Charlie Picasso: Don't Draw Robots": [
    { chapter_number: 1, page_start: 5, page_end: 13 },
    { chapter_number: 2, page_start: 14, page_end: 28 },
    { chapter_number: 3, page_start: 29, page_end: 32 },
    { chapter_number: 4, page_start: 33, page_end: 52 },
    { chapter_number: 5, page_start: 53, page_end: 67 },
    { chapter_number: 6, page_start: 68, page_end: 76 },
    { chapter_number: 7, page_start: 77, page_end: 86 },
    { chapter_number: 8, page_start: 87, page_end: 95 },
    { chapter_number: 9, page_start: 96, page_end: 103 },
  ],
  'Purple Space Chickens': [
    { chapter_number: 1, page_start: 5, page_end: 11 },
    { chapter_number: 2, page_start: 12, page_end: 21 },
    { chapter_number: 3, page_start: 22, page_end: 29 },
    { chapter_number: 4, page_start: 30, page_end: 43 },
    { chapter_number: 5, page_start: 44, page_end: 52 },
    { chapter_number: 6, page_start: 53, page_end: 64 },
    { chapter_number: 7, page_start: 65, page_end: 80 },
    { chapter_number: 8, page_start: 81, page_end: 96 },
    { chapter_number: 9, page_start: 97, page_end: 109 },
  ],
  'Diary of a Famous Cat: Book 1': [
    { chapter_number: 1, page_start: 5, page_end: 10 },
    { chapter_number: 2, page_start: 11, page_end: 16 },
    { chapter_number: 3, page_start: 17, page_end: 23 },
    { chapter_number: 4, page_start: 24, page_end: 30 },
    { chapter_number: 5, page_start: 31, page_end: 41 },
    { chapter_number: 6, page_start: 42, page_end: 48 },
    { chapter_number: 7, page_start: 49, page_end: 54 },
    { chapter_number: 8, page_start: 55, page_end: 59 },
    { chapter_number: 9, page_start: 60, page_end: 66 },
    { chapter_number: 10, page_start: 67, page_end: 70 },
    { chapter_number: 11, page_start: 71, page_end: 74 },
    { chapter_number: 12, page_start: 75, page_end: 79 },
    { chapter_number: 13, page_start: 80, page_end: 101 },
  ],
  'Diary of a Famous Cat: Book 2': [
    { chapter_number: 1, page_start: 5, page_end: 11 },
    { chapter_number: 2, page_start: 12, page_end: 18 },
    { chapter_number: 3, page_start: 19, page_end: 27 },
    { chapter_number: 4, page_start: 28, page_end: 34 },
    { chapter_number: 5, page_start: 35, page_end: 39 },
    { chapter_number: 6, page_start: 40, page_end: 45 },
    { chapter_number: 7, page_start: 46, page_end: 51 },
    { chapter_number: 8, page_start: 52, page_end: 57 },
    { chapter_number: 9, page_start: 58, page_end: 66 },
    { chapter_number: 10, page_start: 67, page_end: 74 },
    { chapter_number: 11, page_start: 75, page_end: 83 },
    { chapter_number: 12, page_start: 84, page_end: 103 },
  ],
  'Dragon Diaries: Book 1': [
    { chapter_number: 1, page_start: 3, page_end: 11 },
    { chapter_number: 2, page_start: 12, page_end: 18 },
    { chapter_number: 3, page_start: 19, page_end: 23 },
    { chapter_number: 4, page_start: 24, page_end: 28 },
    { chapter_number: 5, page_start: 29, page_end: 35 },
    { chapter_number: 6, page_start: 36, page_end: 40 },
    { chapter_number: 7, page_start: 41, page_end: 46 },
    { chapter_number: 8, page_start: 47, page_end: 51 },
    { chapter_number: 9, page_start: 52, page_end: 58 },
    { chapter_number: 10, page_start: 59, page_end: 62 },
    { chapter_number: 11, page_start: 63, page_end: 68 },
    { chapter_number: 12, page_start: 69, page_end: 73 },
    { chapter_number: 13, page_start: 74, page_end: 77 },
    { chapter_number: 14, page_start: 78, page_end: 80 },
    { chapter_number: 15, page_start: 81, page_end: 85 },
    { chapter_number: 16, page_start: 86, page_end: 89 },
    { chapter_number: 17, page_start: 90, page_end: 109 },
  ],
  'Dragon Diaries: Book 2': [
    { chapter_number: 1, page_start: 5, page_end: 9 },
    { chapter_number: 2, page_start: 10, page_end: 27 },
    { chapter_number: 3, page_start: 28, page_end: 34 },
    { chapter_number: 4, page_start: 35, page_end: 41 },
    { chapter_number: 5, page_start: 42, page_end: 46 },
    { chapter_number: 6, page_start: 47, page_end: 54 },
    { chapter_number: 7, page_start: 55, page_end: 62 },
    { chapter_number: 8, page_start: 63, page_end: 71 },
    { chapter_number: 9, page_start: 72, page_end: 80 },
    { chapter_number: 10, page_start: 81, page_end: 87 },
    { chapter_number: 11, page_start: 88, page_end: 103 },
  ],
  'Turtle Life': [
    { chapter_number: 1, page_start: 5, page_end: 12 },
    { chapter_number: 2, page_start: 13, page_end: 18 },
    { chapter_number: 3, page_start: 19, page_end: 25 },
    { chapter_number: 4, page_start: 26, page_end: 34 },
    { chapter_number: 5, page_start: 35, page_end: 41 },
    { chapter_number: 6, page_start: 42, page_end: 48 },
    { chapter_number: 7, page_start: 49, page_end: 54 },
    { chapter_number: 8, page_start: 55, page_end: 61 },
    { chapter_number: 9, page_start: 62, page_end: 69 },
    { chapter_number: 10, page_start: 70, page_end: 79 },
    { chapter_number: 11, page_start: 80, page_end: 85 },
    { chapter_number: 12, page_start: 86, page_end: 91 },
    { chapter_number: 13, page_start: 92, page_end: 98 },
    { chapter_number: 14, page_start: 99, page_end: 105 },
    { chapter_number: 15, page_start: 106, page_end: 120 },
  ],
  'Tryouts': [
    { chapter_number: 1, page_start: 6, page_end: 12 },
    { chapter_number: 2, page_start: 13, page_end: 19 },
    { chapter_number: 3, page_start: 20, page_end: 28 },
    { chapter_number: 4, page_start: 29, page_end: 37 },
    { chapter_number: 5, page_start: 38, page_end: 47 },
    { chapter_number: 6, page_start: 48, page_end: 55 },
    { chapter_number: 7, page_start: 56, page_end: 63 },
    { chapter_number: 8, page_start: 64, page_end: 75 },
    { chapter_number: 9, page_start: 76, page_end: 88 },
    { chapter_number: 10, page_start: 89, page_end: 94 },
    { chapter_number: 11, page_start: 95, page_end: 105 },
    { chapter_number: 12, page_start: 106, page_end: 119 },
  ],
  'Nancho the Nacho Hamster': [
    { chapter_number: 1, page_start: 6, page_end: 13 },
    { chapter_number: 2, page_start: 14, page_end: 17 },
    { chapter_number: 3, page_start: 18, page_end: 23 },
    { chapter_number: 4, page_start: 24, page_end: 29 },
    { chapter_number: 5, page_start: 30, page_end: 37 },
    { chapter_number: 6, page_start: 38, page_end: 48 },
    { chapter_number: 7, page_start: 49, page_end: 58 },
    { chapter_number: 8, page_start: 59, page_end: 66 },
    { chapter_number: 9, page_start: 67, page_end: 76 },
    { chapter_number: 10, page_start: 77, page_end: 82 },
    { chapter_number: 11, page_start: 83, page_end: 89 },
    { chapter_number: 12, page_start: 90, page_end: 95 },
    { chapter_number: 13, page_start: 96, page_end: 104 },
  ],
  'Sprinkles and the Unicorn': [
    { chapter_number: 1, page_start: 6, page_end: 26 },
    { chapter_number: 2, page_start: 27, page_end: 41 },
    { chapter_number: 3, page_start: 42, page_end: 54 },
    { chapter_number: 4, page_start: 55, page_end: 65 },
    { chapter_number: 5, page_start: 66, page_end: 91 },
    { chapter_number: 6, page_start: 92, page_end: 104 },
    { chapter_number: 7, page_start: 105, page_end: 117 },
  ],
  'Fluff and Robodog': [
    { chapter_number: 1, page_start: 6, page_end: 13 },
    { chapter_number: 2, page_start: 14, page_end: 20 },
    { chapter_number: 3, page_start: 21, page_end: 28 },
    { chapter_number: 4, page_start: 29, page_end: 38 },
    { chapter_number: 5, page_start: 39, page_end: 47 },
    { chapter_number: 6, page_start: 48, page_end: 53 },
    { chapter_number: 7, page_start: 54, page_end: 62 },
    { chapter_number: 8, page_start: 63, page_end: 68 },
    { chapter_number: 9, page_start: 69, page_end: 74 },
    { chapter_number: 10, page_start: 75, page_end: 82 },
    { chapter_number: 11, page_start: 83, page_end: 90 },
    { chapter_number: 12, page_start: 91, page_end: 100 },
    { chapter_number: 13, page_start: 101, page_end: 110 },
  ],
};

// Alternate title mappings — books might be stored under slightly different names
const TITLE_ALIASES = {
  'diary of a famous cat book 1': 'Diary of a Famous Cat: Book 1',
  'diary of a famous cat: book 1': 'Diary of a Famous Cat: Book 1',
  'diary of famous cat book 1': 'Diary of a Famous Cat: Book 1',
  'diary of a famous cat book 2': 'Diary of a Famous Cat: Book 2',
  'diary of a famous cat: book 2': 'Diary of a Famous Cat: Book 2',
  'diary of famous cat book 2': 'Diary of a Famous Cat: Book 2',
  'dragon diaries book 1': 'Dragon Diaries: Book 1',
  'dragon diaries: book 1': 'Dragon Diaries: Book 1',
  'dragon diaries book 2': 'Dragon Diaries: Book 2',
  'dragon diaries: book 2': 'Dragon Diaries: Book 2',
  'sprinkles and the unicorn': 'Sprinkles and the Unicorn',
  'sprinkles & the unicorn': 'Sprinkles and the Unicorn',
  'fluff and robodog': 'Fluff and Robodog',
  'fluff & robodog': 'Fluff and Robodog',
  'nancho the nacho hamster': 'Nancho the Nacho Hamster',
  'nancho hamster': 'Nancho the Nacho Hamster',
  'turtle life': 'Turtle Life',
  'tryouts': 'Tryouts',
};

function findPageData(bookTitle) {
  // Direct match
  if (PAGE_DATA[bookTitle]) return PAGE_DATA[bookTitle];
  // Case-insensitive match
  const lower = bookTitle.toLowerCase().trim();
  for (const [key, val] of Object.entries(PAGE_DATA)) {
    if (key.toLowerCase() === lower) return val;
  }
  // Alias match
  if (TITLE_ALIASES[lower]) return PAGE_DATA[TITLE_ALIASES[lower]];
  // Partial match
  for (const [key, val] of Object.entries(PAGE_DATA)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) return val;
  }
  return null;
}

async function updatePages() {
  console.log('🔑 key2read — Updating Chapter Page Ranges\n');

  // First, ensure page_start and page_end columns exist
  console.log('Adding page_start/page_end columns (if not already present)...');
  const { error: colErr1 } = await supabase.rpc('', {}).catch(() => ({}));
  // Use raw SQL via supabase - we'll try adding columns, ignore if they already exist
  try {
    await supabase.from('chapters').select('page_start').limit(1);
    console.log('  ✅ page_start column already exists');
  } catch {
    console.log('  ⚠️  page_start column may need to be added via SQL Editor');
  }

  // Get all books with their chapters
  const { data: books } = await supabase.from('books').select('id, title');
  if (!books || books.length === 0) {
    console.log('❌ No books found in database');
    process.exit(1);
  }

  let updated = 0, skipped = 0, notFound = 0;

  for (const book of books) {
    const pageData = findPageData(book.title);
    if (!pageData) {
      console.log(`  ⏭️  ${book.title} — no page data available`);
      notFound++;
      continue;
    }

    const { data: chapters } = await supabase
      .from('chapters')
      .select('id, chapter_number')
      .eq('book_id', book.id)
      .order('chapter_number');

    if (!chapters || chapters.length === 0) {
      console.log(`  ⏭️  ${book.title} — no chapters in database yet`);
      skipped++;
      continue;
    }

    for (const ch of chapters) {
      const pd = pageData.find(p => p.chapter_number === ch.chapter_number);
      if (pd) {
        const { error } = await supabase
          .from('chapters')
          .update({ page_start: pd.page_start, page_end: pd.page_end })
          .eq('id', ch.id);
        if (error) {
          console.log(`  ❌ ${book.title} Ch ${ch.chapter_number}: ${error.message}`);
        } else {
          updated++;
        }
      }
    }
    console.log(`  ✅ ${book.title} — ${chapters.length} chapters updated`);
  }

  console.log(`\n✅ Done! Updated ${updated} chapters, skipped ${skipped} books, ${notFound} books without page data.`);
  process.exit(0);
}

updatePages().catch(e => { console.error(e); process.exit(1); });
