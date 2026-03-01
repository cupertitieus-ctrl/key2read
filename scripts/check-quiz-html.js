require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

(async () => {
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('id, chapter_id, question_number, question_text, options, strategy_tip')
    .order('chapter_id')
    .order('question_number');

  if (error) { console.error('Error:', error); return; }
  console.log('Total quiz questions:', data.length);

  const htmlRe = /<[a-z][^>]*>/i;

  // HTML in question_text
  console.log('\n=== HTML tags in question_text ===');
  let found1 = 0;
  data.forEach(q => {
    if (htmlRe.test(q.question_text)) {
      found1++;
      console.log('  Ch', q.chapter_id, 'Q' + q.question_number, ':', q.question_text.substring(0, 150));
    }
  });
  if (found1 === 0) console.log('  None found');

  // HTML in options
  console.log('\n=== HTML tags in options ===');
  let found2 = 0;
  data.forEach(q => {
    if (q.options && q.options.some(o => htmlRe.test(o))) {
      found2++;
      const bad = q.options.filter(o => htmlRe.test(o));
      console.log('  Ch', q.chapter_id, 'Q' + q.question_number, ':', bad.join(' | '));
    }
  });
  if (found2 === 0) console.log('  None found');

  // HTML in strategy_tip
  console.log('\n=== HTML tags in strategy_tip ===');
  let found3 = 0;
  data.forEach(q => {
    if (q.strategy_tip && htmlRe.test(q.strategy_tip)) {
      found3++;
      console.log('  Ch', q.chapter_id, 'Q' + q.question_number, ':', q.strategy_tip);
    }
  });
  if (found3 === 0) console.log('  None found');

  // Summary
  console.log('\n=== SUMMARY ===');
  console.log('Questions with HTML:', found1);
  console.log('Options with HTML:', found2);
  console.log('Tips with HTML:', found3);

  // Get chapter/book info for affected questions
  if (found1 > 0 || found2 > 0) {
    const affectedChapterIds = [...new Set(data.filter(q => htmlRe.test(q.question_text) || (q.options && q.options.some(o => htmlRe.test(o)))).map(q => q.chapter_id))];
    const { data: chapters } = await supabase.from('chapters').select('id, chapter_number, book_id, title').in('id', affectedChapterIds);
    if (chapters) {
      const bookIds = [...new Set(chapters.map(c => c.book_id))];
      const { data: books } = await supabase.from('books').select('id, title').in('id', bookIds);
      console.log('\nAffected books/chapters:');
      chapters.forEach(ch => {
        const book = books && books.find(b => b.id === ch.book_id);
        console.log('  ', book ? book.title : 'Book ' + ch.book_id, '- Chapter', ch.chapter_number, '(' + ch.title + ')');
      });
    }
  }
})();
