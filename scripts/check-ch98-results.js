require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

(async () => {
  const { data } = await supabase
    .from('quiz_results')
    .select('id, student_id, chapter_id, score, keys_earned, created_at')
    .eq('chapter_id', 98)
    .order('created_at', { ascending: false });

  console.log('Quiz results for chapter 98 (Sprinkles Ch 3):');
  if (!data || data.length === 0) {
    console.log('  None found');
  } else {
    data.forEach(r => {
      console.log(`  ID: ${r.id} | Student: ${r.student_id} | Score: ${r.score}% | Keys: ${r.keys_earned} | Date: ${r.created_at}`);
    });
  }
})();
