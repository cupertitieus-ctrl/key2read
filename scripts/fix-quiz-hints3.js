require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

(async () => {
  // Get all questions with page-number hints
  const { data: questions, error } = await supabase
    .from('quiz_questions')
    .select('id, strategy_tip')
    .order('id');

  if (error) { console.error(error); return; }

  // Find hints that say "You can find the answer on page X" but NOT "in the book"
  const toFix = questions.filter(q => {
    const tip = q.strategy_tip || '';
    return tip.match(/You can find the answer on page \d+/) && !tip.includes('in the book');
  });

  console.log('Total questions:', questions.length);
  console.log('Hints to update (add "in the book"):', toFix.length);

  if (toFix.length === 0) {
    console.log('All hints already have correct format!');
    return;
  }

  let updated = 0;
  for (const q of toFix) {
    const newTip = q.strategy_tip.replace(
      /You can find the answer on page (\d+)/,
      'You can find the answer on page $1 in the book'
    );
    const { error: upErr } = await supabase
      .from('quiz_questions')
      .update({ strategy_tip: newTip })
      .eq('id', q.id);

    if (upErr) {
      console.error('Error updating', q.id, upErr);
    } else {
      updated++;
    }
  }

  console.log('Updated', updated, 'hints to include "in the book"');

  // Also fix any that say "Reread this chapter." to say "You can find the answer by rereading this chapter."
  const rereadFix = questions.filter(q => {
    const tip = q.strategy_tip || '';
    return tip === 'Reread this chapter.' || tip === 'Reread this chapter';
  });

  if (rereadFix.length > 0) {
    console.log('Also fixing', rereadFix.length, 'short "Reread" hints...');
    for (const q of rereadFix) {
      await supabase
        .from('quiz_questions')
        .update({ strategy_tip: 'You can find the answer by rereading this chapter.' })
        .eq('id', q.id);
    }
  }

  console.log('Done!');
})();
