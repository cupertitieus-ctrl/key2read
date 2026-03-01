require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

function stripHtml(str) {
  return str ? str.replace(/<[^>]*>/g, '') : str;
}

(async () => {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('id, question_text, options, strategy_tip')
    .order('id');

  if (error) { console.error('Error:', error); return; }

  const htmlRe = /<[^>]*>/;
  let fixedCount = 0;

  for (const q of data) {
    const needsQuestionFix = htmlRe.test(q.question_text || '');
    const needsOptionsFix = q.options && q.options.some(o => htmlRe.test(o || ''));
    const needsTipFix = htmlRe.test(q.strategy_tip || '');

    if (needsQuestionFix || needsOptionsFix || needsTipFix) {
      const update = {};
      if (needsQuestionFix) update.question_text = stripHtml(q.question_text);
      if (needsOptionsFix) update.options = q.options.map(o => stripHtml(o));
      if (needsTipFix) update.strategy_tip = stripHtml(q.strategy_tip);

      const { error: updateError } = await supabase
        .from('quiz_questions')
        .update(update)
        .eq('id', q.id);

      if (updateError) {
        console.error('Failed to update Q', q.id, ':', updateError.message);
      } else {
        fixedCount++;
      }
    }
  }

  console.log('Fixed', fixedCount, 'quiz questions');

  // Verify
  const { data: verify } = await supabase
    .from('quiz_questions')
    .select('id, question_text, options')
    .order('id');

  const remaining = verify.filter(q =>
    htmlRe.test(q.question_text || '') ||
    (q.options && q.options.some(o => htmlRe.test(o || '')))
  );
  console.log('Remaining questions with HTML:', remaining.length);
})();
