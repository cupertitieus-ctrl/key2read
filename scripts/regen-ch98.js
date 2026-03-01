require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const { generateChapterQuiz } = require('../server/claude');

(async () => {
  try {
    console.log('Generating quiz for Sprinkles Ch 3...');
    const questions = await generateChapterQuiz(
      'Sprinkles and Unicorn: Surprise Visit',
      'Diane Alber',
      3,
      'Bubbly Science',
      'In science class with Mrs. Fairy, Sprinkles is paired with Orange as lab partners for a baking soda and vinegar experiment. While Orange measures the baking soda, tiny Unicorn wakes up from her nap, teleports out of the backpack, and tips an entire bottle of vinegar into the beaker, causing a massive foam explosion that spills across the desk and onto the floor. The whole class gasps and Mrs. Fairy is stunned, but no one can see Unicorn hiding behind the foam. Orange helps Sprinkles clean up the mess with paper towels, and Mrs. Fairy tells them to be more careful next time. Unicorn teleports back into the backpack, leaving Sprinkles mortified that she keeps looking clumsy in front of Orange.',
      '2nd-3rd',
      5,
      42,
      54
    );

    const qs = Array.isArray(questions) ? questions : (questions.questions || []);
    console.log('Got', qs.length, 'questions');

    if (qs.length > 0 && qs[0].options && !qs[0].options.includes('Option A')) {
      const questions = qs;
      // Strip HTML and fix hints
      for (const q of questions) {
        q.question_text = (q.question_text || '').replace(/<[^>]*>/g, '');
        q.options = (q.options || []).map(o => (o || '').replace(/<[^>]*>/g, ''));
        const pageMatch = (q.strategy_tip || '').match(/(\d+)/);
        if (pageMatch) {
          q.strategy_tip = 'You can find the answer on page ' + pageMatch[1];
        }
      }

      // Insert
      const inserts = questions.map((q, i) => ({
        chapter_id: 98,
        question_number: i + 1,
        question_type: q.question_type || 'literal',
        question_text: q.question_text,
        passage_excerpt: q.passage_excerpt || '',
        options: q.options,
        correct_answer: q.correct_answer,
        strategy_type: q.strategy_type || 'finding-details',
        strategy_tip: q.strategy_tip || 'You can find the answer by rereading this chapter.',
        explanation: q.explanation || '',
        vocabulary_words: q.vocabulary_words || []
      }));

      const { error } = await supabase.from('quiz_questions').insert(inserts);
      if (error) {
        console.error('Insert error:', error);
      } else {
        console.log('Inserted', inserts.length, 'questions successfully!');
        inserts.forEach((q, i) => {
          console.log('\nQ' + (i+1) + ':', q.question_text);
          q.options.forEach((o, j) => console.log('  ' + (j === q.correct_answer ? 'V' : ' ') + ' ' + String.fromCharCode(65+j) + ':', o));
          console.log('  Hint:', q.strategy_tip);
        });
      }
    } else {
      console.log('Got fallback quiz or empty result');
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
})();
