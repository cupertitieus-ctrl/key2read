require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

(async () => {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('id, strategy_tip')
    .order('id');

  if (error) { console.error('Error:', error); return; }

  console.log('Total questions:', data.length);

  // Show some examples of current hints
  console.log('\n=== Sample current hints ===');
  data.slice(0, 20).forEach(q => {
    console.log('  Q' + q.id + ':', q.strategy_tip);
  });

  // Find hints that contain page numbers
  const pageRe = /page\s+(\d+)/i;
  let fixedCount = 0;

  for (const q of data) {
    const tip = q.strategy_tip || '';
    const match = tip.match(pageRe);

    if (match) {
      // Has a page number - simplify to just "Page X"
      const pageNum = match[1];
      const newTip = 'Page ' + pageNum;

      if (tip !== newTip) {
        const { error: updateError } = await supabase
          .from('quiz_questions')
          .update({ strategy_tip: newTip })
          .eq('id', q.id);

        if (updateError) {
          console.error('Failed Q' + q.id + ':', updateError.message);
        } else {
          fixedCount++;
        }
      }
    } else if (tip && tip !== 'Reread this chapter.' && tip.length > 20) {
      // No page number but long hint - simplify to generic
      const { error: updateError } = await supabase
        .from('quiz_questions')
        .update({ strategy_tip: 'Reread this chapter.' })
        .eq('id', q.id);

      if (updateError) {
        console.error('Failed Q' + q.id + ':', updateError.message);
      } else {
        fixedCount++;
      }
    }
  }

  console.log('\nFixed', fixedCount, 'hints');

  // Show samples after fix
  const { data: after } = await supabase
    .from('quiz_questions')
    .select('id, strategy_tip')
    .order('id')
    .limit(20);

  console.log('\n=== Sample hints after fix ===');
  after.forEach(q => {
    console.log('  Q' + q.id + ':', q.strategy_tip);
  });
})();
