// ============================================================
// key2read — Seed Real Books Only (no fake users/students)
// ============================================================
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Real K-12 books with ISBNs and Open Library covers
const books = [
  { title: "Charlotte's Web", author: 'E.B. White', lexile_level: 680, grade_level: '4.4', genre: 'Fiction', chapter_count: 22, isbn: '9780061124952', description: 'The story of a pig named Wilbur and his friendship with a barn spider named Charlotte.' },
  { title: 'Hatchet', author: 'Gary Paulsen', lexile_level: 1020, grade_level: '5.7', genre: 'Adventure', chapter_count: 19, isbn: '9781416936473', description: 'Brian survives alone in the Canadian wilderness after a plane crash.' },
  { title: 'Wonder', author: 'R.J. Palacio', lexile_level: 790, grade_level: '4.8', genre: 'Realistic Fiction', chapter_count: 80, isbn: '9780375869020', description: 'Auggie Pullman, born with facial differences, navigates fifth grade.' },
  { title: 'Holes', author: 'Louis Sachar', lexile_level: 660, grade_level: '4.6', genre: 'Fiction', chapter_count: 50, isbn: '9780440414803', description: 'Stanley Yelnats is sent to Camp Green Lake where boys dig holes all day.' },
  { title: 'Bridge to Terabithia', author: 'Katherine Paterson', lexile_level: 810, grade_level: '4.6', genre: 'Fiction', chapter_count: 13, isbn: '9780064401845', description: 'Two children create a magical kingdom in the woods.' },
  { title: 'Number the Stars', author: 'Lois Lowry', lexile_level: 670, grade_level: '4.5', genre: 'Historical Fiction', chapter_count: 17, isbn: '9780547577098', description: 'A girl helps her Jewish friend escape the Nazis in WWII Denmark.' },
  { title: 'The Giver', author: 'Lois Lowry', lexile_level: 760, grade_level: '5.7', genre: 'Science Fiction', chapter_count: 23, isbn: '9780544336261', description: 'Jonas lives in a seemingly perfect society but discovers its dark secrets.' },
  { title: 'Island of the Blue Dolphins', author: "Scott O'Dell", lexile_level: 1000, grade_level: '5.4', genre: 'Historical Fiction', chapter_count: 29, isbn: '9780547328614', description: 'A girl survives alone on an island off California for years.' },
  { title: 'Esperanza Rising', author: 'Pam Muñoz Ryan', lexile_level: 750, grade_level: '5.3', genre: 'Historical Fiction', chapter_count: 14, isbn: '9780439120425', description: 'A wealthy Mexican girl must adjust to life as a farm worker in California.' },
  { title: 'Tuck Everlasting', author: 'Natalie Babbitt', lexile_level: 770, grade_level: '5.0', genre: 'Fantasy', chapter_count: 25, isbn: '9780312369811', description: 'Winnie discovers a family who drank from a spring of immortality.' },
  { title: 'The Lightning Thief', author: 'Rick Riordan', lexile_level: 680, grade_level: '4.7', genre: 'Fantasy', chapter_count: 22, isbn: '9780786838653', description: 'Percy Jackson discovers he is the son of a Greek god.' },
  { title: 'Frindle', author: 'Andrew Clements', lexile_level: 830, grade_level: '5.4', genre: 'Realistic Fiction', chapter_count: 15, isbn: '9780689806698', description: 'Nick Allen invents a new word and causes a sensation.' },
  { title: 'Shiloh', author: 'Phyllis Reynolds Naylor', lexile_level: 890, grade_level: '4.4', genre: 'Realistic Fiction', chapter_count: 15, isbn: '9780689835827', description: 'A boy tries to save an abused beagle from its cruel owner.' },
  { title: 'The One and Only Ivan', author: 'Katherine Applegate', lexile_level: 570, grade_level: '3.6', genre: 'Fiction', chapter_count: 60, isbn: '9780061992278', description: 'A gorilla living in a mall reflects on his life and dreams of freedom.' },
  { title: 'Because of Winn-Dixie', author: 'Kate DiCamillo', lexile_level: 610, grade_level: '3.9', genre: 'Realistic Fiction', chapter_count: 26, isbn: '9780763680862', description: 'A girl named Opal finds a stray dog and through him makes friends in a new town.' },
  { title: 'The Wild Robot', author: 'Peter Brown', lexile_level: 740, grade_level: '4.5', genre: 'Science Fiction', chapter_count: 72, isbn: '9780316382007', description: 'A robot learns to survive in the wilderness and becomes a mother.' },
  { title: 'Sarah, Plain and Tall', author: 'Patricia MacLachlan', lexile_level: 560, grade_level: '3.4', genre: 'Historical Fiction', chapter_count: 9, isbn: '9780064402057', description: 'A mail-order bride comes to the prairie to join a widower and his children.' },
  { title: 'My Side of the Mountain', author: 'Jean Craighead George', lexile_level: 810, grade_level: '5.2', genre: 'Adventure', chapter_count: 23, isbn: '9780142401811', description: 'A boy runs away to live alone in the Catskill Mountains.' },
  { title: 'The BFG', author: 'Roald Dahl', lexile_level: 720, grade_level: '4.8', genre: 'Fantasy', chapter_count: 24, isbn: '9780142410387', description: 'A little girl befriends the Big Friendly Giant and helps him defeat evil giants.' },
  { title: 'Matilda', author: 'Roald Dahl', lexile_level: 840, grade_level: '5.0', genre: 'Fantasy', chapter_count: 21, isbn: '9780142410370', description: 'A brilliant girl with telekinetic powers stands up against cruel adults.' },
  { title: 'The Phantom Tollbooth', author: 'Norton Juster', lexile_level: 1000, grade_level: '6.7', genre: 'Fantasy', chapter_count: 20, isbn: '9780394820378', description: 'A bored boy drives through a magic tollbooth into the Lands Beyond.' },
  { title: 'A Wrinkle in Time', author: "Madeleine L'Engle", lexile_level: 740, grade_level: '4.7', genre: 'Science Fiction', chapter_count: 12, isbn: '9780312367541', description: 'Meg Murry travels through space and time to rescue her father.' },
  { title: 'Bud, Not Buddy', author: 'Christopher Paul Curtis', lexile_level: 950, grade_level: '5.0', genre: 'Historical Fiction', chapter_count: 19, isbn: '9780440413288', description: 'A 10-year-old orphan during the Depression sets out to find the man he believes is his father.' },
  { title: 'Roll of Thunder, Hear My Cry', author: 'Mildred D. Taylor', lexile_level: 920, grade_level: '5.7', genre: 'Historical Fiction', chapter_count: 12, isbn: '9780142401125', description: 'A Black family in 1930s Mississippi fights to keep their land and dignity.' },
  { title: 'The Tale of Despereaux', author: 'Kate DiCamillo', lexile_level: 670, grade_level: '4.7', genre: 'Fantasy', chapter_count: 58, isbn: '9780763680893', description: 'A small mouse with big ears falls in love with a princess.' },
  { title: 'Flora & Ulysses', author: 'Kate DiCamillo', lexile_level: 530, grade_level: '4.3', genre: 'Fantasy', chapter_count: 64, isbn: '9780763687649', description: 'A girl rescues a squirrel that develops superpowers after being vacuumed up.' },
  { title: 'When You Reach Me', author: 'Rebecca Stead', lexile_level: 750, grade_level: '4.5', genre: 'Mystery', chapter_count: 49, isbn: '9780375850868', description: 'A girl in 1970s New York receives mysterious notes that predict the future.' },
  { title: 'The Crossover', author: 'Kwame Alexander', lexile_level: 660, grade_level: '5.0', genre: 'Realistic Fiction', chapter_count: 42, isbn: '9780544107717', description: 'Twin brothers deal with basketball, growing up, and their father\'s health in this novel in verse.' },
  { title: 'Brown Girl Dreaming', author: 'Jacqueline Woodson', lexile_level: 990, grade_level: '5.3', genre: 'Autobiography', chapter_count: 36, isbn: '9780399252518', description: 'Jacqueline Woodson shares her childhood growing up in South Carolina and Brooklyn.' },
  { title: 'From the Mixed-Up Files of Mrs. Basil E. Frankweiler', author: 'E.L. Konigsburg', lexile_level: 700, grade_level: '4.7', genre: 'Mystery', chapter_count: 10, isbn: '9781416949756', description: 'Two siblings run away and hide inside the Metropolitan Museum of Art.' }
];

function coverUrl(isbn) {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
}

async function seed() {
  console.log('🔑 key2read — Seeding Book Library\n');

  // Check if books already exist
  const { data: existing } = await supabase.from('books').select('id').limit(1);
  if (existing && existing.length > 0) {
    console.log('⚠️  Books already exist. Clearing and re-seeding...');
    await supabase.from('quiz_questions').delete().neq('id', 0);
    await supabase.from('chapters').delete().neq('id', 0);
    await supabase.from('books').delete().neq('id', 0);
  }

  // Insert books with covers
  const booksToInsert = books.map(b => ({ ...b, cover_url: coverUrl(b.isbn) }));
  const { data: insertedBooks, error } = await supabase.from('books').insert(booksToInsert).select();
  if (error) { console.error('❌ Failed to insert books:', error.message); process.exit(1); }
  console.log(`✅ Inserted ${insertedBooks.length} books with covers\n`);

  // Seed Charlotte's Web chapters + quizzes
  const cw = insertedBooks.find(b => b.title === "Charlotte's Web");
  if (cw) {
    console.log("📖 Seeding Charlotte's Web chapters & quizzes...");
    const chapters = [
      { book_id: cw.id, chapter_number: 1, title: 'Before Breakfast', summary: 'Fern saves a runt pig from being killed by her father.', key_vocabulary: [{ word: 'runt', definition: 'The smallest and weakest animal in a litter', pos: 'noun' }, { word: 'injustice', definition: 'Lack of fairness or justice', pos: 'noun' }, { word: 'specimen', definition: 'An individual example of an animal or plant', pos: 'noun' }] },
      { book_id: cw.id, chapter_number: 2, title: 'Wilbur', summary: 'Fern names the pig Wilbur and cares for him. He is eventually sold to the Zuckerman farm.', key_vocabulary: [{ word: 'infant', definition: 'A very young child or baby', pos: 'noun' }, { word: 'reluctantly', definition: 'In a hesitant, unwilling way', pos: 'adverb' }] },
      { book_id: cw.id, chapter_number: 3, title: 'Escape', summary: 'Wilbur escapes from his pen but realizes he has nowhere to go and returns.', key_vocabulary: [{ word: 'solitude', definition: 'The state of being alone', pos: 'noun' }, { word: 'aimlessly', definition: 'Without purpose or direction', pos: 'adverb' }] }
    ];
    const { data: chs, error: chErr } = await supabase.from('chapters').insert(chapters).select();
    if (chErr) console.error('Chapter error:', chErr.message);
    else {
      console.log(`   ✅ ${chs.length} chapters`);
      const ch1 = chs.find(c => c.chapter_number === 1);
      const ch2 = chs.find(c => c.chapter_number === 2);
      const ch3 = chs.find(c => c.chapter_number === 3);
      const questions = [
        { chapter_id: ch1.id, question_number: 1, question_type: 'recall', question_text: 'What does Fern do when she learns her father is going to kill the runt pig?', passage_excerpt: '"Where\'s Papa going with that ax?"', options: ['She hides', 'She runs after her father to stop him', 'She calls the police', 'She asks her mother for help'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look for action words (verbs).', explanation: 'Fern ran after her father to stop him.', vocabulary_words: ['runt'] },
        { chapter_id: ch1.id, question_number: 2, question_type: 'inference', question_text: 'Why does Fern call killing the pig an "injustice"?', passage_excerpt: '"The pig couldn\'t help being born small, could it?"', options: ['Pigs should never be killed', 'The pig did nothing wrong', 'Her father was mean', 'The pig belongs to someone else'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Look at Fern\'s comparison of the pig to herself.', explanation: 'The pig was punished for something it couldn\'t control.', vocabulary_words: ['injustice'] },
        { chapter_id: ch1.id, question_number: 3, question_type: 'vocabulary', question_text: 'What does "specimen" mean here?', passage_excerpt: '"It\'s a weak specimen."', options: ['A type of food', 'A science experiment', 'An example of an animal', 'A pig\'s name'], correct_answer: 2, strategy_type: 'context-clues', strategy_tip: 'Look at surrounding clue words.', explanation: 'Specimen means an individual example of something.', vocabulary_words: ['specimen'] },
        { chapter_id: ch1.id, question_number: 4, question_type: 'theme', question_text: 'What idea does this chapter introduce?', passage_excerpt: '', options: ['Obey your parents', 'Farm animals don\'t matter', 'Speaking up against unfairness can make a difference', 'Breakfast is important'], correct_answer: 2, strategy_type: 'identifying-theme', strategy_tip: 'Think about what Fern\'s actions teach.', explanation: 'Standing up for what\'s right can make a difference.', vocabulary_words: [] },
        { chapter_id: ch1.id, question_number: 5, question_type: 'personal', question_text: 'What would you have done in Fern\'s situation?', passage_excerpt: '', options: ['Run away', 'Talk to my father', 'Tell my mother', 'Do nothing'], correct_answer: 1, strategy_type: 'personal-connection', strategy_tip: 'No wrong answer here.', explanation: 'Speaking up takes courage.', vocabulary_words: [] },
        { chapter_id: ch2.id, question_number: 1, question_type: 'recall', question_text: 'How does Fern care for Wilbur?', passage_excerpt: 'Fern loved Wilbur more than anything.', options: ['Keeps him in a cage', 'Feeds him with a bottle and treats him like a baby', 'Leaves him in the barn', 'Takes him to school'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look for specific actions.', explanation: 'Fern feeds and cares for Wilbur like a baby.', vocabulary_words: [] },
        { chapter_id: ch2.id, question_number: 2, question_type: 'inference', question_text: 'Why does Fern agree to sell Wilbur?', passage_excerpt: '"Can I still go see him?"', options: ['She doesn\'t like him', 'He needs more space and she can visit', 'She\'s forced', 'She wants a new pet'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'What does her question about visiting tell you?', explanation: 'She understands but wants to keep the connection.', vocabulary_words: ['reluctantly'] },
        { chapter_id: ch2.id, question_number: 3, question_type: 'vocabulary', question_text: 'What does "reluctantly" mean?', passage_excerpt: 'Fern reluctantly agreed.', options: ['Happily', 'Quickly', 'Unwillingly', 'Angrily'], correct_answer: 2, strategy_type: 'context-clues', strategy_tip: 'Think about how Fern feels.', explanation: 'Reluctantly means doing something you don\'t want to.', vocabulary_words: ['reluctantly'] },
        { chapter_id: ch2.id, question_number: 4, question_type: 'theme', question_text: 'What does this chapter show about growing up?', passage_excerpt: '', options: ['Forget what you love', 'Accept change even when hard', 'Never give pets away', 'Don\'t have pets'], correct_answer: 1, strategy_type: 'identifying-theme', strategy_tip: 'How does Fern handle change?', explanation: 'Growing up means accepting hard changes.', vocabulary_words: [] },
        { chapter_id: ch2.id, question_number: 5, question_type: 'personal', question_text: 'Have you had to let go of something you cared about?', passage_excerpt: '', options: ['Never', 'Yes, it was sad but I understood', 'I\'d never let go', 'Excited for new things'], correct_answer: 1, strategy_type: 'personal-connection', strategy_tip: 'Connect to your own experience.', explanation: 'Letting go is part of growing up.', vocabulary_words: [] },
        { chapter_id: ch3.id, question_number: 1, question_type: 'recall', question_text: 'What does Wilbur do after escaping?', passage_excerpt: 'He wandered aimlessly.', options: ['Runs to Fern', 'Wanders and returns to his pen', 'Hides in the forest', 'Finds another farm'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Follow the sequence of events.', explanation: 'Wilbur wanders then returns.', vocabulary_words: ['aimlessly'] },
        { chapter_id: ch3.id, question_number: 2, question_type: 'inference', question_text: 'Why does Wilbur go back to his pen?', passage_excerpt: '', options: ['Scared of animals', 'No friends outside, comfort is in the barn', 'Someone catches him', 'Forgot why he escaped'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'What does the pen have that outside doesn\'t?', explanation: 'He needs connection, not just freedom.', vocabulary_words: ['solitude'] },
        { chapter_id: ch3.id, question_number: 3, question_type: 'vocabulary', question_text: 'What does "aimlessly" tell us?', passage_excerpt: 'He wandered aimlessly.', options: ['He has a plan', 'He\'s confused with no direction', 'He\'s running fast', 'He\'s being sneaky'], correct_answer: 1, strategy_type: 'context-clues', strategy_tip: '"Aim" + "lessly" = without aim.', explanation: 'Without purpose or direction.', vocabulary_words: ['aimlessly'] },
        { chapter_id: ch3.id, question_number: 4, question_type: 'theme', question_text: 'What does this teach about happiness?', passage_excerpt: '', options: ['Food is most important', 'Happiness comes from connection, not just freedom', 'Never escape', 'Being alone is better'], correct_answer: 1, strategy_type: 'identifying-theme', strategy_tip: 'What was missing when Wilbur was free?', explanation: 'Connection and belonging matter more than freedom alone.', vocabulary_words: [] },
        { chapter_id: ch3.id, question_number: 5, question_type: 'personal', question_text: 'What do you do when you feel lonely?', passage_excerpt: '', options: ['Something fun alone', 'Reach out to someone', 'Wait it out', 'Try something new'], correct_answer: 1, strategy_type: 'personal-connection', strategy_tip: 'Connect to Wilbur\'s experience.', explanation: 'Reaching out helps most.', vocabulary_words: ['solitude'] }
      ];
      const { error: qErr } = await supabase.from('quiz_questions').insert(questions);
      if (qErr) console.error('Question error:', qErr.message);
      else console.log(`   ✅ ${questions.length} quiz questions`);
    }
  }

  console.log('\n📚 Books seeded:');
  insertedBooks.forEach(b => console.log(`   ${b.title} — ${b.author} (${b.grade_level})`));
  console.log('\n✅ Done! No fake data — real users come from real signups.');
  console.log('   Flow: Teacher signs up → gets class code → shares with students → students join\n');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
