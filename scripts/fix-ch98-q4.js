require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

(async () => {
  // Get all questions for chapter 98 (Sprinkles Ch 3)
  const { data } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('chapter_id', 98)
    .order('question_number');

  console.log('Current questions:');
  data.forEach(q => {
    console.log(`\nQ${q.question_number}: ${q.question_text}`);
    q.options.forEach((o, i) => console.log(`  ${i === q.correct_answer ? '✅' : '  '} ${String.fromCharCode(65+i)}: ${o}`));
  });

  // Fix Q4 — replace with a question that makes sense given Unicorn is invisible
  const q4 = data.find(q => q.question_number === 4);
  if (q4) {
    const { error } = await supabase
      .from('quiz_questions')
      .update({
        question_text: 'Why is it so hard for Sprinkles to explain what keeps going wrong?',
        passage_excerpt: 'The whole class gasps and Mrs. Fairy is stunned, but no one can see Unicorn.',
        options: [
          'She forgot what happened during the experiment',
          'No one else can see Unicorn, so she can\'t tell the truth',
          'Mrs. Fairy told her not to talk about it',
          'Orange already explained everything to the class'
        ],
        correct_answer: 1,
        strategy_type: 'making-inferences',
        strategy_tip: 'You can find the answer on page 48',
        explanation: 'Sprinkles can\'t explain what really happened because Unicorn is invisible to everyone else. If she told the truth about an invisible unicorn causing the mess, no one would believe her.'
      })
      .eq('id', q4.id);

    if (error) {
      console.error('Update error:', error);
    } else {
      console.log('\n✅ Fixed Q4!');
      console.log('New Q4: Why is it so hard for Sprinkles to explain what keeps going wrong?');
      console.log('  ✅ B: No one else can see Unicorn, so she can\'t tell the truth');
    }
  }
})();
