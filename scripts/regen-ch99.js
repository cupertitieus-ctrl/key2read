require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const { generateChapterQuiz } = require('../server/claude');

(async () => {
  try {
    // Delete old fallback questions for chapter 99
    const { error: delError } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('chapter_id', 99);

    if (delError) {
      console.error('Delete error:', delError);
      return;
    }
    console.log('Deleted old fallback questions for chapter 99');

    console.log('Generating quiz for Sprinkles Ch 4 (Glossy Mess)...');
    const questions = await generateChapterQuiz(
      'Sprinkles and Unicorn: Surprise Visit',
      'Diane Alber',
      4,
      'Glossy Mess',
      'In advanced math class with Mr. Edwards, Sprinkles notices Unicorn has gone suspiciously quiet inside her backpack. She peeks inside and discovers tiny Unicorn sitting in her makeup pouch, covered in cherry-scented lip gloss with her hooves slick and shiny. Unicorn stomps through the makeup pouch, knocking over lip gloss tubes and a compact of shimmering powder, sending a cloud of glittery dust everywhere. Unicorn then jumps onto Sprinkles\'s desk and prances around leaving sticky cherry gloss trails, and even lands on the kid next to her\'s math book. In trying to catch Unicorn, Sprinkles knocks over her metal water bottle with a loud clang, drawing the whole class\'s attention before Unicorn finally hops back into the backpack.',
      '2nd-3rd',
      5,
      55,
      65
    );

    const qs = Array.isArray(questions) ? questions : (questions.questions || []);
    console.log('Got', qs.length, 'questions');

    if (qs.length > 0 && qs[0].options && !qs[0].options.includes('Option A')) {
      // Strip HTML and fix hints
      for (const q of qs) {
        q.question_text = (q.question_text || '').replace(/<[^>]*>/g, '');
        q.options = (q.options || []).map(o => (o || '').replace(/<[^>]*>/g, ''));
        const pageMatch = (q.strategy_tip || '').match(/(\d+)/);
        if (pageMatch) {
          q.strategy_tip = 'You can find the answer on page ' + pageMatch[1];
        }
      }

      // Insert
      const inserts = qs.map((q, i) => ({
        chapter_id: 99,
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
