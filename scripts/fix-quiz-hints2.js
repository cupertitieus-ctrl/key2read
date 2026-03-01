require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

(async () => {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('id, strategy_tip')
    .order('id');

  if (error) { console.error('Error:', error); return; }

  let fixedCount = 0;
  const pageRe = /(\d+)/;

  for (const q of data) {
    const tip = q.strategy_tip || '';
    const match = tip.match(pageRe);

    if (match) {
      const pageNum = match[1];
      const newTip = 'You can find the answer on page ' + pageNum;

      if (tip !== newTip) {
        const { error: updateError } = await supabase
          .from('quiz_questions')
          .update({ strategy_tip: newTip })
          .eq('id', q.id);

        if (!updateError) fixedCount++;
      }
    }
  }

  console.log('Fixed', fixedCount, 'hints');

  // Verify
  const { data: after } = await supabase
    .from('quiz_questions')
    .select('id, strategy_tip')
    .order('id')
    .limit(5);

  after.forEach(q => console.log('  Q' + q.id + ':', q.strategy_tip));
})();
