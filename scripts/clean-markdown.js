// Quick script to strip markdown asterisks from all quiz question texts in DB
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function clean() {
  // Fetch all questions that contain asterisks
  const { data: questions, error } = await supabase
    .from('quiz_questions')
    .select('id, question_text, passage_excerpt, strategy_tip, explanation, options')
    .or('question_text.like.*%*%*,passage_excerpt.like.*%*%*,strategy_tip.like.*%*%*,explanation.like.*%*%*');

  if (error) { console.error('Fetch error:', error); return; }
  if (!questions || questions.length === 0) { console.log('No questions with asterisks found.'); return; }

  console.log(`Found ${questions.length} questions with potential markdown asterisks`);
  const strip = (s) => typeof s === 'string' ? s.replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1') : s;

  let updated = 0;
  for (const q of questions) {
    const cleaned = {
      question_text: strip(q.question_text),
      passage_excerpt: strip(q.passage_excerpt || ''),
      strategy_tip: strip(q.strategy_tip || ''),
      explanation: strip(q.explanation || ''),
      options: (q.options || []).map(o => strip(o))
    };
    // Only update if something changed
    if (cleaned.question_text !== q.question_text ||
        cleaned.passage_excerpt !== (q.passage_excerpt || '') ||
        cleaned.strategy_tip !== (q.strategy_tip || '') ||
        cleaned.explanation !== (q.explanation || '') ||
        JSON.stringify(cleaned.options) !== JSON.stringify(q.options)) {
      const { error: updateErr } = await supabase
        .from('quiz_questions')
        .update(cleaned)
        .eq('id', q.id);
      if (updateErr) console.error(`Error updating q${q.id}:`, updateErr);
      else { updated++; console.log(`Cleaned q${q.id}: ${q.question_text.substring(0, 60)}...`); }
    }
  }
  console.log(`Done. Updated ${updated} questions.`);
}

clean().catch(console.error);
