require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function main() {
  const { data: chapters } = await sb.from('chapters').select('id, chapter_number').eq('book_id', 68).order('chapter_number');
  if (!chapters) { console.log('No chapters found'); return; }

  let total = 0;
  for (const ch of chapters) {
    const { data: qs } = await sb.from('quiz_questions').select('id').eq('chapter_id', ch.id);
    const count = qs?.length || 0;
    total += count;
    if (count > 0) console.log(`Ch${ch.chapter_number}: ${count} questions`);
  }
  console.log(`\nTotal Dragon Diaries questions: ${total}`);
}
main();
