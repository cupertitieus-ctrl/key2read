// ============================================================
// Seed chapters + quiz questions for Purple Space Chickens Book 1
// ============================================================
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const chapters = [
  {
    chapter_number: 1,
    title: 'Code Names',
    summary: 'Bear introduces himself and his code name, explains how his sister Sprinkles got her nickname, describes his golden retriever Fluff, and reveals his love for gardening.',
    key_vocabulary: ['code name', 'document', 'obsessed', 'enclosure', 'extraordinary'],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'Why does Bear use a code name instead of his real name?', options: ['He thinks code names sound cool', 'He wants to protect his identity and his friend from NASA', 'His teacher told him to use one', 'He forgot his real name'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 6 — Bear tells you why he needs to hide!', explanation: 'Bear says he uses a code name because he does not want NASA asking questions or taking his little friend.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'How did Sprinkles get her code name?', options: ['She loves rainbow sprinkles on pancakes', 'She spilled sprinkle-covered ice cream on her face', 'Her mom named her that as a baby', 'She won a sprinkle-eating contest'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 7 — something funny happened with ice cream!', explanation: 'Sprinkles got her name when she spilled a bowl of sprinkle-covered ice cream on her face trying to impress her crush.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What is special about Bear compared to most kids his age?', options: ['He is really tall for his age', 'He loves gardening and has a green thumb', 'He can run faster than anyone', 'He speaks three languages'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 10 — Bear talks about something he loves to do!', explanation: 'Bear says he has a green thumb, meaning he loves to garden, which he admits is unusual for a kid.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What can you tell about Bear and Sprinkles from reading chapter 1?', options: ['They do not get along at all', 'They are close even though they are very different', 'They never talk to each other', 'They are exactly alike in every way'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 9 — Bear says something nice about how they agree on the big stuff!', explanation: 'Even though Bear and Sprinkles are opposites in many ways, Bear says they always agree on the big stuff, showing they are close.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'Why did Bear\'s mom build a fence around the garden?', options: ['To make the garden look pretty', 'To stop Fluff from burying things and keep the stray cat out', 'To protect the garden from rain', 'To give Bear a place to play'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 11 — Bear tells you about two animals causing trouble!', explanation: 'The enclosure was built to stop Fluff from burying things and to keep the stray cat from eating the blueberries.' }
    ]
  },
  {
    chapter_number: 2,
    title: 'Extraordinary Garden',
    summary: 'Bear finds a tiny purple chicken with a miniature astronaut helmet in his garden. He puts her in his backpack and names her Nugget.',
    key_vocabulary: ['rustling', 'miniature', 'ironically', 'hesitated', 'astronaut'],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'What was the first sign that something was wrong in the garden?', options: ['The plants were all dead', 'One of the cage doors was wide open', 'Fluff was barking at the fence', 'There was a strange noise from the sky'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 13 — Bear notices something about the cage!', explanation: 'Bear noticed that one of the cage doors on the garden enclosure was wide open.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'How big was the chicken Bear found?', options: ['The size of a basketball', 'The size of a tennis ball', 'The size of a watermelon', 'The size of a golf ball'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 14 — Bear compares the chicken to a ball!', explanation: 'The chicken was the size of a tennis ball.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'Why was Bear scared to touch the chicken?', options: ['He was afraid she might fly away', 'He was worried she might bite him', 'He thought she was a robot', 'He did not want to get his hands dirty'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 16 — Bear imagines going to the hospital!', explanation: 'Bear hesitated because he was afraid the chicken might bite him and no hospital would know how to treat a purple chicken bite.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'How did Bear get the chicken into his backpack?', options: ['He put food inside the pocket', 'He placed her tiny helmet inside a sock nest', 'He pushed her in with his hand', 'He asked Sprinkles to help'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 18 — Bear has a clever idea with the helmet!', explanation: 'Bear placed the tiny helmet inside the sock nest in his backpack pocket, which encouraged the chicken to hop in.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'Why did Bear name the chicken Nugget?', options: ['Because she was golden colored', 'Because the name seemed perfect for a tiny space chicken', 'Because she liked to eat chicken nuggets', 'Because his sister suggested the name'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 20 — Bear picks the perfect name!', explanation: 'Bear chose the name Nugget because it seemed perfect for such a tiny, space-exploring chicken.' }
    ]
  },
  {
    chapter_number: 3,
    title: 'Morning Walk',
    summary: 'Bear and Sprinkles walk to school. Sprinkles talks about her math test while Bear tries to keep Nugget hidden in his backpack.',
    key_vocabulary: ['suspicion', 'skeptical', 'casual', 'frantically', 'doomed'],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'What subject is Sprinkles worried about?', options: ['Science', 'English', 'Math', 'History'], correct_answer: 2, strategy_type: 'finding-details', strategy_tip: 'Go to page 24 — Sprinkles talks about fractions and decimals!', explanation: 'Sprinkles is worried about her math test, mentioning long division, fractions, and decimals.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'How did Bear cover up the sound Nugget made?', options: ['He turned on loud music', 'He started coughing loudly', 'He told Sprinkles it was a bird outside', 'He pretended to sneeze'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 26 — Nugget chirps and Bear has to act fast!', explanation: 'Bear started coughing loudly to mask the sound of Nugget chirping.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What does Sprinkles say Bear has to do if she gets sick?', options: ['Tell their mom on him', 'Do her math test for her', 'Never walk to school with him again', 'Take his backpack'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 28 — Sprinkles makes a funny threat!', explanation: 'Sprinkles says if she gets sick, Bear has to do her math test for her.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What was Bear really thinking about during the walk?', options: ['His own homework', 'Whether Nugget was okay in his backpack', 'What he wanted for lunch', 'How to run faster to school'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 25 — Bear keeps thinking about the little bird in his bag!', explanation: 'While pretending to listen to Sprinkles, Bear was really thinking about Nugget and wondering if she was bored or planning an escape.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'What is Bear worried about at the end of the chapter?', options: ['Whether Sprinkles will pass her test', 'Whether he can keep Nugget hidden all day', 'Whether Fluff is okay at home', 'Whether it will rain'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 29 — Bear asks himself a big question!', explanation: 'Bear worries whether he can keep a chicken hidden in his backpack the entire school day without anyone noticing.' }
    ]
  },
  {
    chapter_number: 4,
    title: 'Nugget Goes to School',
    summary: 'At school, Nugget pokes her head out and Strawberry sees her. But Nugget puffs up and freezes like a toy! Strawberry thinks she is just a weird toy.',
    key_vocabulary: ['obsession', 'crimson', 'suspicious', 'mechanism', 'convinced'],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'Why is Red called Red?', options: ['He has red hair', 'He always wears red shoelaces', 'His favorite food is red apples', 'He blushes a lot'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 32 — it has to do with his shoes!', explanation: 'Red got his nickname because he is obsessed with red shoelaces and wears them on every pair of shoes.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What cool trick does Nugget do when Strawberry sees her?', options: ['She turns invisible', 'She puffs up and looks like a fluffy toy', 'She flies up to the ceiling', 'She starts talking'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 40 — Nugget does something amazing with her feathers!', explanation: 'When spotted, Nugget puffed up like a pufferfish and her feathers turned into cloud-like fuzz, making her look like a toy.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What lie does Bear tell about Nugget?', options: ['He says he won it at a fair', 'He says his dad brought it from a trip', 'He says he made it in art class', 'He says he found it on the bus'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 41 — Bear makes up a story about his dad!', explanation: 'Bear tells Strawberry that his dad brought the toy back from one of his trips.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'Why is Bear extra worried about Strawberry finding out?', options: ['Because Strawberry is a tattletale', 'Because she knows him better than anyone', 'Because Strawberry is scared of animals', 'Because Strawberry is the teacher\'s pet'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 43 — Bear says she always knows when something is up!', explanation: 'Bear worries because Strawberry knows him better than anyone and he always tells her everything, making it hard to keep secrets from her.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'What does Strawberry bring Bear at lunch every day?', options: ['A sandwich', 'An extra bag of strawberries', 'A juice box', 'Cookies'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 35 — that is how she got her code name!', explanation: 'Strawberry brings Bear an extra bag of strawberries at lunch every single day.' }
    ]
  },
  {
    chapter_number: 5,
    title: 'Bathroom Stall',
    summary: 'Bear takes Nugget to the school bathroom to check on her. When he touches Nugget, purple light explodes and they teleport to a different bathroom!',
    key_vocabulary: ['teleportation', 'weightless', 'vengeance', 'unmistakable'],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'Why did Bear pick the bathroom to check on Nugget?', options: ['It was the closest room', 'It was the only private place he could think of', 'He needed to wash his hands', 'His teacher told him to go there'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to pages 45-46 — Bear thinks about all the places he could go!', explanation: 'Bear ruled out the janitor\'s closet, classrooms, and the gym. The bathroom was the only place private enough.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What made the teleportation happen?', options: ['Bear said a magic word', 'Bear touched Nugget with both hands', 'Nugget pressed a button on her helmet', 'Bear flushed the toilet'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 49 — it happens the second Bear grabs her!', explanation: 'The teleportation happened the second Bear touched Nugget, causing an explosion of purple light.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'How did the teleportation feel to Bear?', options: ['It felt calm and relaxing', 'It felt like the worst roller coaster ever', 'He did not feel anything', 'It felt like falling asleep'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 50 — Bear talks about his stomach flipping!', explanation: 'Bear says his stomach flipped like being on the worst roller coaster and everything blurred into swirling colors.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'Where did Bear and Nugget end up?', options: ['At their house', 'At a restaurant called Bob\'s Burger Barn', 'At the park', 'At NASA headquarters'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 52 — the smell gives it away!', explanation: 'The smell of fries and burgers told Bear they had teleported to Bob\'s Burger Barn, his favorite restaurant.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'How did Nugget act after teleporting Bear?', options: ['She was scared and shaking', 'She was totally calm like it was no big deal', 'She fell asleep right away', 'She started clucking loudly'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 51 — look at how Nugget acts compared to Bear!', explanation: 'Unlike Bear who was shocked, Nugget was completely unbothered, acting like teleportation was just a normal thing.' }
    ]
  },
  {
    chapter_number: 6,
    title: "Bob's Burger Barn",
    summary: 'Bear hides Nugget in his hoodie and orders a burger. He helps an old lady outside. Then he teleports back to school through the bathroom.',
    key_vocabulary: ['circumstances', 'transaction', 'satisfaction', 'coincidence', 'polite'],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'Where did Bear hide Nugget in the restaurant?', options: ['In his pants pocket', 'In the hood of his hoodie', 'Under a table', 'Inside a burger bag'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 56 — Bear puts Nugget somewhere cozy!', explanation: 'Bear placed Nugget in the hood of his hoodie so she would be hidden while he walked through the restaurant.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What nice thing did Bear do at the restaurant?', options: ['He cleaned up a spill', 'He helped an old lady step up onto the curb', 'He gave his food to a hungry kid', 'He picked up trash outside'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 60 — Bear sees someone who needs help outside!', explanation: 'Bear helped an elderly woman who was struggling to step up onto the curb outside the restaurant.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'How was the trip back to school different from the first teleport?', options: ['It was much scarier and louder', 'It was gentler and smoother', 'It did not work at all', 'It took them to the wrong place'], correct_answer: 1, strategy_type: 'comparing-contrasting', strategy_tip: 'Go to page 63 — Bear says it was like a gentle pop this time!', explanation: 'The second teleportation was much gentler than the first — just a lazy spin and a gentle pop.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What does Bear think Nugget\'s power might be connected to?', options: ['It only works on Mondays', 'It might be connected to helping people', 'It only works with food nearby', 'Sprinkles can teleport too'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 62 — Bear wonders about helping the old lady!', explanation: 'Bear wonders if Nugget\'s power is connected to helping people, since the teleportation happened after he helped the elderly woman.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'Where does the teleportation always happen?', options: ['Only outdoors', 'Only from one bathroom to another bathroom', 'Only at school', 'Anywhere Nugget wants'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 64 — Bear talks about bathroom teleportation!', explanation: 'Bear notices that both teleportations went from one bathroom to another.' }
    ]
  },
  {
    chapter_number: 7,
    title: 'Rescue Homework',
    summary: 'Bear forgot his homework at home! He tries to teleport with Nugget but it does not work at first. When he explains to Nugget how much it would help, she teleports them home and back!',
    key_vocabulary: ['frantically', 'emphasizing', 'concentrating', 'beeline', 'grateful'],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'What did Bear forget at home?', options: ['His pencil', 'His homework', 'His lunch', 'Nugget\'s helmet'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 65 — Bear searches his backpack and panics!', explanation: 'Bear panicked because he realized his homework was still sitting on his desk at home.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'Why did the first teleportation try not work?', options: ['Bear was not in a bathroom', 'Nugget was asleep', 'Bear did not explain how it would help him', 'The helmet was broken'], correct_answer: 2, strategy_type: 'making-inferences', strategy_tip: 'Go to page 72 — Bear figures out he needs to tell Nugget WHY it helps!', explanation: 'The first attempt failed because Bear just thought about the location. The second time he explained how getting his homework would really help him.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What did Bear say to make Nugget teleport?', options: ['He promised her extra blueberries', 'He told her getting his homework would really help him', 'He threatened to leave her at school', 'He showed her a picture of his house'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 72 — Bear talks to Nugget about his grade!', explanation: 'Bear told Nugget that getting his homework would really help him and that his grade would go down without it.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What almost went wrong at home?', options: ['Fluff started barking at Nugget', 'His mom heard him and called out', 'Sprinkles was already home', 'He could not find his homework'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 76 — someone calls his name!', explanation: 'Bear\'s mom heard him and called out, almost catching him at home when he should have been at school.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'What big thing did Bear learn about how Nugget\'s power works?', options: ['It only works once per day', 'Nugget needs to understand how the trip will help someone', 'It only works when Nugget is hungry', 'It gets weaker each time'], correct_answer: 1, strategy_type: 'identifying-theme', strategy_tip: 'Go to page 72 — Bear connects helping the old lady to helping himself!', explanation: 'Bear learns that Nugget\'s teleportation seems tied to helping — Nugget needs to understand how the trip will help someone.' }
    ]
  },
  {
    chapter_number: 8,
    title: 'The Spill',
    summary: 'In art class, Strawberry spills paint and borrows Bear\'s hoodie — with Nugget still in the pocket! Nugget freezes into toy mode again and Strawberry thinks it is that same weird toy.',
    key_vocabulary: ['abstract', 'splatters', 'furiously', 'obsession', 'embarrassed'],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'Why did Bear take off his hoodie in art class?', options: ['He was too hot', 'He did not want to get paint on it', 'The teacher told him to', 'Nugget was making it move'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 83 — Bear is about to start painting!', explanation: 'Bear took off his hoodie so he would not get paint on it during art class.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What happened to Strawberry\'s sweatshirt?', options: ['She ripped it on a nail', 'Blue paint spilled all over it', 'She forgot it at home', 'Someone stole it from her chair'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 84 — Strawberry\'s elbow hits something!', explanation: 'Strawberry accidentally knocked over a cup of blue paint which splattered all over her favorite sweatshirt.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'Why did Bear panic when Strawberry put on his hoodie?', options: ['He did not want anyone wearing his clothes', 'He forgot Nugget was hidden in the pocket', 'The hoodie had a hole in it', 'He had money hidden in the pocket'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 88 — Bear forgot one very important thing!', explanation: 'Bear panicked because he forgot that Nugget was still hidden in the hoodie pocket when Strawberry put it on.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'How did Nugget keep her secret safe again?', options: ['She turned invisible', 'She froze into toy mode so Strawberry thought she was just a toy', 'She ran away under a desk', 'Bear distracted Strawberry with a joke'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 92 — Strawberry says "This is that toy you had earlier!"', explanation: 'Nugget froze into her puffed-up toy mode again, so Strawberry just thought it was the same weird toy from earlier.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'What does Strawberry think about Bear after this chapter?', options: ['She thinks he is hiding something serious', 'She thinks he has a tummy problem and a weird chicken toy obsession', 'She thinks he is totally normal', 'She thinks he is playing a prank on her'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 96 — Bear lists the funny things Strawberry now believes!', explanation: 'Strawberry now thinks Bear has stomach issues and a strange obsession with a chicken toy.' }
    ]
  },
  {
    chapter_number: 9,
    title: 'How Will I Get Home?',
    summary: 'Bear spills green food coloring in science class and goes to wash his hands. Nugget accidentally teleports them — but this time they end up in the woods, not a bathroom!',
    key_vocabulary: ['instinctively', 'sensation', 'substances', 'unbearable', 'teleport'],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'What did Bear spill in science class?', options: ['A beaker of water', 'Green food coloring all over his hands', 'A cup of orange juice', 'His notebook in the experiment'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 99 — something bright green goes everywhere!', explanation: 'Bear accidentally tipped over his cup and spilled bright green food coloring all over his hands.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'Why did Bear go to the bathroom instead of using the classroom sink?', options: ['The classroom sink was broken', 'The line for the sink was way too long', 'The teacher told him to', 'He wanted to check on Nugget'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 100 — Bear sees the line and says no way!', explanation: 'The line for the classroom sink was moving too slowly so Bear decided to just go to the bathroom.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What was different about this teleportation?', options: ['It was faster than before', 'They did NOT land in a bathroom — they ended up in the woods!', 'Nothing was different', 'They went back in time'], correct_answer: 1, strategy_type: 'comparing-contrasting', strategy_tip: 'Go to page 102 — Bear looks around and sees something very different!', explanation: 'Unlike every other teleportation which went bathroom to bathroom, this time they ended up in the woods surrounded by tall trees.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What does Bear see and smell around him?', options: ['A sandy beach', 'Tall trees, dirt, and the smell of pine', 'A shopping mall', 'Another school'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 103 — Bear describes what he can feel and smell!', explanation: 'Bear notices tall trees, crunchy leaves, dirt, a cool breeze, and the earthy smell of pine — they are in a forest.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'Why is the ending so exciting?', options: ['Bear falls asleep in the woods', 'Bear is stuck in the woods and does not know how to get home!', 'Bear finds another purple chicken', 'Bear wakes up and it was all a dream'], correct_answer: 1, strategy_type: 'identifying-theme', strategy_tip: 'Go to page 104 — Bear asks himself some big questions!', explanation: 'The chapter ends with Bear stuck in an unknown forest, not knowing why or how to get home — a cliffhanger!' }
    ]
  }
];

async function seedQuizzes() {
  console.log('📝 Seeding Purple Space Chickens — Chapters & Quizzes\n');

  const { data: bookRows } = await supabase.from('books').select('id, title').eq('title', 'Purple Space Chickens');
  if (!bookRows || bookRows.length === 0) {
    console.error('❌ Book "Purple Space Chickens" not found. Run seed.js first.');
    process.exit(1);
  }
  const bookId = bookRows[0].id;
  console.log(`📖 Found book: ${bookRows[0].title} (id: ${bookId})\n`);

  const { data: existingChapters } = await supabase.from('chapters').select('id').eq('book_id', bookId);
  if (existingChapters && existingChapters.length > 0) {
    const chapterIds = existingChapters.map(c => c.id);
    await supabase.from('quiz_questions').delete().in('chapter_id', chapterIds);
    await supabase.from('chapters').delete().eq('book_id', bookId);
    console.log('⚠️  Cleared existing chapters & questions for this book.\n');
  }

  let totalQuestions = 0;

  for (const ch of chapters) {
    const { data: inserted, error: chErr } = await supabase.from('chapters').insert({
      book_id: bookId,
      chapter_number: ch.chapter_number,
      title: ch.title,
      summary: ch.summary,
      key_vocabulary: ch.key_vocabulary
    }).select().single();

    if (chErr) { console.error(`❌ Chapter ${ch.chapter_number}:`, chErr.message); continue; }
    console.log(`  ✅ Ch ${ch.chapter_number}: ${ch.title}`);

    for (const q of ch.questions) {
      const { error: qErr } = await supabase.from('quiz_questions').insert({
        chapter_id: inserted.id,
        question_number: q.question_number,
        question_type: q.question_type,
        question_text: q.question_text,
        passage_excerpt: '',
        options: q.options,
        correct_answer: q.correct_answer,
        strategy_type: q.strategy_type,
        strategy_tip: q.strategy_tip,
        explanation: q.explanation,
        vocabulary_words: q.vocabulary_words || []
      });
      if (qErr) console.error(`    ❌ Q${q.question_number}:`, qErr.message);
      else totalQuestions++;
    }
    console.log(`     └─ ${ch.questions.length} questions added`);
  }

  console.log(`\n✅ Done! ${chapters.length} chapters, ${totalQuestions} quiz questions seeded.`);
  process.exit(0);
}

seedQuizzes().catch(e => { console.error(e); process.exit(1); });
