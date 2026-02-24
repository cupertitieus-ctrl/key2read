require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function main() {
  const { data: chapters } = await sb.from('chapters').select('id, chapter_number, title, summary').eq('book_id', 68).order('chapter_number');
  if (!chapters) { console.log('No chapters'); return; }
  for (const ch of chapters) {
    console.log(`\n--- Chapter ${ch.chapter_number}: "${ch.title}" (ID: ${ch.id}) ---`);
    console.log(ch.summary || '(no summary)');
  }
}
main();
