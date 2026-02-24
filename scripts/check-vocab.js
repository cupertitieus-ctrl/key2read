require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

(async () => {
  // Get all Famous Cat book 1 questions
  const { data: qs } = await sb.from('quiz_questions')
    .select('chapter_id, question_number, question_type, question_text, options, vocabulary_words, strategy_tip')
    .gte('chapter_id', 103).lte('chapter_id', 115)
    .order('chapter_id').order('question_number');

  let currentCh = 0;
  for (const q of qs) {
    const chNum = q.chapter_id - 102;
    if (chNum !== currentCh) { currentCh = chNum; console.log('\n--- Entry ' + chNum + ' ---'); }
    const vocabCount = q.vocabulary_words ? q.vocabulary_words.length : 0;
    const vocabStr = vocabCount > 0 ? ' (' + q.vocabulary_words.join(', ') + ')' : '';
    const hint = (q.strategy_tip || 'none').substring(0, 80);
    console.log('Q' + q.question_number + ' [' + q.question_type + '] vocab=' + vocabCount + vocabStr + ' | hint: ' + hint);
  }
})();
