#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
// seed-dragon-diaries.js — Insert pre-built quiz questions for
// Dragon Diaries (Book ID 68) into Supabase.
// No Claude API key needed — questions are hardcoded.
//
// Usage: node scripts/seed-dragon-diaries.js [--dry-run]
// ═══════════════════════════════════════════════════════════════

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const DRY_RUN = process.argv.includes('--dry-run');

// Chapter IDs for Dragon Diaries (book_id = 68)
// Ch1=128, Ch2=129, ... Ch17=144
const CH = (n) => 127 + n;

// Question builder helper
function Q(num, type, qText, excerpt, opts, correct, strategy, tip, explanation, vocab) {
  return {
    question_number: num,
    question_type: type,
    question_text: qText,
    passage_excerpt: excerpt || '',
    options: opts,
    correct_answer: correct,
    strategy_type: strategy,
    strategy_tip: tip,
    explanation: explanation,
    vocabulary_words: vocab || []
  };
}

const ALL_QUESTIONS = {
  // ═══════════════ CHAPTER 1: Saturday ═══════════════
  [CH(1)]: [
    Q(1, 'recall',
      'What did the narrator find at the garage sale?',
      '',
      [
        'A dusty leather notebook with strange markings burned into the spine of it',
        'A small wooden box filled with old coins and a folded-up treasure map inside it',
        'A collection of ancient-looking dragon books stacked inside a wooden crate',
        'A glowing rock wrapped in newspaper and hidden at the bottom of a bargain bin'
      ], 0, 'finding-details',
      'Look for specific items the narrator describes finding. Reread the part about the garage sale to spot what caught his attention first.',
      'The narrator found a leather notebook at the garage sale with mysterious markings burned into its spine. This discovery is what kicks off the whole adventure!',
      ['mysterious', 'leather']),

    Q(2, 'inference',
      'Why do you think the old man at the garage sale said, "I think this belongs to you"?',
      '',
      [
        'He recognized the narrator from a previous visit and remembered his interests clearly',
        'Something about the narrator made him believe the notebook was meant for this person',
        'The old man wanted to get rid of the notebook quickly because it was scaring customers',
        'He mistakenly thought the narrator had dropped it earlier while browsing the tables'
      ], 1, 'making-inferences',
      'Think about why someone would say an item "belongs" to a stranger. What clues does the text give about the old man\'s mysterious behavior?',
      'The old man seemed to sense something special about the narrator, as if the notebook was destined to find him. This hints that there may be something magical going on.',
      ['recognized', 'destined']),

    Q(3, 'vocabulary',
      'What does the narrator mean when he calls garage sales "outdoor treasure hunts"?',
      '',
      [
        'Going to garage sales feels like searching for hidden gems among ordinary junk',
        'People actually bury valuable things in their yards for customers to discover',
        'Every garage sale has exactly one expensive treasure hidden among cheap items',
        'Searching through boxes of old stuff is exhausting but always worth the effort'
      ], 0, 'context-clues',
      'When you see a comparison like "treasure hunts," think about what the narrator is comparing. What makes garage sales similar to hunting for treasure?',
      'The narrator compares garage sales to treasure hunts because you never know what amazing things you might find hidden among everyday stuff. It shows his excitement about exploring!',
      ['treasure', 'valuable']),

    Q(4, 'theme',
      'What is the main idea of this first diary entry?',
      '',
      [
        'Moving to a new town is always boring until you find something interesting to do',
        'Sometimes the most ordinary day can lead to an extraordinary discovery that changes everything',
        'Garage sales are great places to find cheap things that nobody else wants anymore',
        'Writing in a diary helps people remember the important moments from each day'
      ], 1, 'identifying-theme',
      'Think about the big picture — what happened on this Saturday that could change everything? The theme is usually the larger lesson or idea.',
      'This entry sets up the whole story by showing how an ordinary Saturday turned into something extraordinary when the narrator discovered the mysterious notebook at a garage sale.',
      ['extraordinary', 'discovery']),

    Q(5, 'personal',
      'Have you ever found something unexpected that turned out to be really special to you?',
      '',
      [
        'Yes, discovering something surprising can make a regular day feel like an adventure',
        'Finding unexpected things is exciting because you never know what might happen next',
        'Special discoveries often happen when you least expect them and are not even looking',
        'No, because truly special things are usually given to you by people who care about you'
      ], 0, 'personal-connection',
      'Think about a time you found something cool you weren\'t looking for. How did it make you feel? Connect that feeling to the narrator\'s experience.',
      'Just like the narrator\'s garage sale find, unexpected discoveries can make ordinary days feel magical and exciting!',
      [])
  ],

  // ═══════════════ CHAPTER 2: Sunday ═══════════════
  [CH(2)]: [
    Q(1, 'recall',
      'According to the dragon books, what three things do dragons need to survive?',
      '',
      [
        'Fresh water, a warm cave, and plenty of sunlight during the morning hours',
        'Heat, food, and a safe place where they can feel protected from any danger',
        'Moonlight, music, and a companion who truly understands their special nature',
        'Fireproof bedding, raw meat, and access to a source of constant heat energy'
      ], 1, 'finding-details',
      'Look for the part where the narrator lists what he learned from the dragon books. What three specific needs are mentioned?',
      'The dragon books explained that dragons need heat, food, and a safe place to feel protected. This information becomes really important later in the story!',
      ['companion', 'protected']),

    Q(2, 'inference',
      'Why does the narrator think he might be "the right person" to care for a dragon?',
      '',
      [
        'His extensive research on dragons has given him more knowledge than most people',
        'The old man at the garage sale specifically chose him to receive the mysterious notebook',
        'He feels a special connection to the notebook and believes the discovery was meant to be',
        'His parents already said he could keep any unusual pet as long as he takes care of it'
      ], 2, 'making-inferences',
      'Think about what makes the narrator feel qualified or chosen. What evidence from the text supports his belief?',
      'The narrator feels the mysterious way the notebook came to him — through the old man\'s words — means he was chosen for something special. He trusts his gut feeling about it.',
      ['extensive', 'connection']),

    Q(3, 'vocabulary',
      'What does the word "extensive" mean when the narrator says he did "extensive research"?',
      '',
      [
        'Quick and easy to finish without much effort or concentration on details',
        'Covering a large area or amount of information in a thorough and detailed way',
        'Expensive and difficult to find at the local library or bookstore nearby',
        'Boring and repetitive, requiring the same steps to be done over and over'
      ], 1, 'context-clues',
      'Look at the words around "extensive." The narrator spent a lot of time reading dragon books — what kind of research would that be?',
      '"Extensive" means very thorough and covering a lot of ground. The narrator read many dragon books and took notes, showing he was very serious about his research!',
      ['extensive', 'thorough']),

    Q(4, 'theme',
      'What is the narrator\'s plan to try to hatch the rock, and what does it show about him?',
      '',
      [
        'He aims a blow-dryer at the rock, showing he is creative and willing to try anything',
        'He places the rock outside in direct sunlight, showing patience and understanding',
        'He wraps it in blankets by the heater, showing he carefully follows book instructions',
        'He buries the rock in warm sand from the pet store, showing thorough preparation'
      ], 0, 'identifying-theme',
      'Think about what the narrator actually tried and what it tells you about his personality. Is he careful? Creative? Desperate?',
      'Using a blow-dryer to hatch a rock is creative and a little funny! It shows the narrator is resourceful and determined, even when his ideas seem a bit wild.',
      ['resourceful', 'determined']),

    Q(5, 'personal',
      'If you found a mysterious rock that might be a dragon egg, what would you do first?',
      '',
      [
        'Research everything about dragons online and in books before trying anything risky',
        'Tell a trusted friend or family member and ask for their advice about the situation',
        'Try to keep it warm and safe while watching carefully for any signs of life inside',
        'Bring it to a scientist or expert who might know what kind of creature it contains'
      ], 0, 'personal-connection',
      'Put yourself in the narrator\'s shoes. Think about what you would actually do if you believed you had a real dragon egg.',
      'There\'s no wrong answer here! The narrator chose to do research first, which is a smart move when you\'re dealing with something completely unknown.',
      [])
  ],

  // ═══════════════ CHAPTER 3: Monday ═══════════════
  [CH(3)]: [
    Q(1, 'recall',
      'Why has the narrator moved to so many different schools?',
      '',
      [
        'His family moves frequently because of his parents\' jobs and work situations',
        'He keeps getting expelled for bringing unusual animals into the classroom',
        'Each school he attended closed down shortly after his family arrived in town',
        'His parents believe that experiencing different schools builds stronger character'
      ], 0, 'finding-details',
      'Scan the text for the reason the narrator gives about moving. Families move for different reasons — what does he say about his?',
      'The narrator has moved many times because of his parents\' work, which means he\'s had to start over at new schools repeatedly. That\'s not easy!',
      ['frequently', 'expelled']),

    Q(2, 'inference',
      'Why is the narrator worried about the egg hatching while he is at school?',
      '',
      [
        'His parents might discover it and throw it away before he gets home that afternoon',
        'Nobody would be there to keep the egg warm, and it might need help when it hatches',
        'The other students at school would definitely make fun of him for believing in dragons',
        'His teacher might assign so much homework that he wouldn\'t have time to care for it'
      ], 1, 'making-inferences',
      'Think about what could go wrong if a dragon egg hatched with nobody around. What problems might that cause?',
      'The narrator worries because if the egg hatches when he\'s gone, the baby dragon would be alone with no warmth or food. Plus, his parents might find it!',
      ['discover']),

    Q(3, 'vocabulary',
      'What does the narrator\'s dad mean when he says the town has "dinosaur-era" buildings?',
      '',
      [
        'The buildings are extremely old and outdated, as if they were built ages ago',
        'Real dinosaur fossils were found inside the walls when the buildings were restored',
        'The architecture is designed to look exactly like structures from prehistoric times',
        'Local museums display dinosaur bones right next to photographs of the old buildings'
      ], 0, 'context-clues',
      'When someone describes something as "dinosaur-era," are they being literal or exaggerating? Think about what the dad is really saying.',
      'The dad is using a fun exaggeration to say the buildings are really, really old — not actually from the dinosaur era! It\'s his way of describing a small, old-fashioned town.',
      ['outdated', 'architecture']),

    Q(4, 'theme',
      'What are the two main things the narrator is dealing with on this Monday?',
      '',
      [
        'Starting at a brand-new school while secretly keeping a potential dragon egg at home',
        'Making friends in the neighborhood while also learning to ride his bike to school',
        'Finishing all his late homework assignments while adjusting to a completely new bedroom',
        'Convincing his parents to let him have a pet lizard while also unpacking all his boxes'
      ], 0, 'identifying-theme',
      'Think about the two biggest challenges the narrator faces. One is about his regular life, and one is about his secret.',
      'The narrator is juggling two big things: being the new kid at school (again!) and keeping his mysterious egg safe at home. That\'s a lot of pressure for one Monday!',
      ['adjusting', 'convincing']),

    Q(5, 'personal',
      'How would you feel about starting at a brand-new school where you don\'t know anyone?',
      '',
      [
        'Nervous but hopeful, because new schools can mean new friendships and fresh starts',
        'Scared and frustrated, because leaving old friends behind is always painful for me',
        'Excited and curious, because every new place has interesting things waiting to discover',
        'Calm and confident, because making new friends has always come naturally and easily'
      ], 0, 'personal-connection',
      'Think about a time you were the "new kid" anywhere — a new class, team, or neighborhood. How did you feel?',
      'Most people feel a mix of nervous and excited about new beginnings, just like the narrator. It\'s completely normal!',
      [])
  ],

  // ═══════════════ CHAPTER 4: Tuesday ═══════════════
  [CH(4)]: [
    Q(1, 'recall',
      'What unusual sign did the narrator see posted around town?',
      '',
      [
        'A warning about strange noises coming from the woods near the edge of town at night',
        'An advertisement for a mysterious new shop that sells rare and exotic pet supplies',
        'A notice about a missing pet that matched the description of something very unusual',
        'A poster asking for help finding a lost item that the narrator recognized immediately'
      ], 2, 'finding-details',
      'Look for the part where the narrator mentions seeing signs. What was unusual or surprising about what the signs said?',
      'The narrator spotted signs around town that described something unusual — showing that his small town might not be as ordinary as it seems!',
      ['mysterious', 'exotic']),

    Q(2, 'inference',
      'What does the mom\'s "quiet look" probably mean when the narrator asks about something?',
      '',
      [
        'She is secretly planning a birthday surprise and trying hard not to give it away',
        'She knows more than she is saying and is choosing her words very carefully right now',
        'She is distracted thinking about work problems and not really paying close attention',
        'She disagrees with what he said but does not want to start an argument about it'
      ], 1, 'making-inferences',
      'When a parent gives a "quiet look" instead of answering right away, what does that usually mean? Think about body language clues.',
      'A quiet look usually means someone is thinking carefully before responding, possibly because they know something they\'re not ready to share.',
      ['distracted']),

    Q(3, 'vocabulary',
      'What does it mean when the narrator says his mom gave a look of "quiet disapproval"?',
      '',
      [
        'She showed she didn\'t agree without saying a single word about her feelings aloud',
        'She whispered her complaints so softly that only the narrator could hear them clearly',
        'She pretended to approve while secretly planning to change things behind his back',
        'She wrote down her concerns in a note and slipped it under his bedroom door later'
      ], 0, 'context-clues',
      'Break the phrase apart: "quiet" means silent, and "disapproval" means not agreeing. Put them together — what does that look like?',
      'Quiet disapproval means showing you don\'t agree through facial expressions or body language rather than words. Parents are really good at this!',
      ['disapproval', 'complaints']),

    Q(4, 'theme',
      'What does this Tuesday entry mostly show about the narrator\'s new life?',
      '',
      [
        'His new town feels strange and full of little mysteries that keep adding up quickly',
        'School is going perfectly and he already made three best friends on the second day',
        'His parents are fighting about money, which makes everything feel stressful at home',
        'Being the new kid means having more free time since nobody has invited him anywhere'
      ], 0, 'identifying-theme',
      'Look at the overall feeling of this entry. Is the narrator\'s new town ordinary or unusual? What details support your answer?',
      'This entry builds the sense that the narrator\'s new town is full of small mysteries — from unusual signs to his mom\'s secretive behavior. Something bigger is going on!',
      ['mysteries']),

    Q(5, 'personal',
      'Have you ever noticed something in your neighborhood that seemed mysterious or out of place?',
      '',
      [
        'Yes, noticing unusual things makes me curious and eager to investigate what happened',
        'Sometimes ordinary things seem mysterious when you pay extra attention to your surroundings',
        'Mysteries in real life are usually less exciting than they first appear to be honestly',
        'Paying attention to small details is how great detectives and scientists make discoveries'
      ], 0, 'personal-connection',
      'Think about a time you noticed something unusual in your area. What did you do about it? How does that connect to the narrator?',
      'Being observant — noticing things others miss — is what makes the narrator special. It\'s also a great skill in real life!',
      [])
  ],

  // ═══════════════ CHAPTER 5: Wednesday ═══════════════
  [CH(5)]: [
    Q(1, 'recall',
      'Where did the narrator find the lizard that he names Ziggy?',
      '',
      [
        'Hiding inside one of the unpacked moving boxes sitting in the garage at their house',
        'Sitting on a warm rock in the backyard garden near the fence by the neighbor\'s yard',
        'Perched on the windowsill of his bedroom, soaking up the afternoon sunlight rays',
        'Running across the kitchen floor while his mom was cooking dinner for the family'
      ], 0, 'finding-details',
      'Look for the specific place where the narrator first spots the lizard. Where exactly was it hiding?',
      'The narrator found Ziggy hiding inside one of the unpacked moving boxes — a fun surprise among all that boring moving stuff!',
      ['perched']),

    Q(2, 'inference',
      'Why does the narrator feel it is safe to keep Ziggy as a pet in their new house?',
      '',
      [
        'His dad already mentioned wanting to get a family pet once they finished unpacking',
        'Ziggy seems calm and friendly, plus having a regular lizard hides the secret egg well',
        'The landlord specifically told them that small reptile pets were allowed in the house',
        'His mom once said she loved lizards when she was growing up on her grandparents\' farm'
      ], 1, 'making-inferences',
      'Think about WHY having a normal pet lizard would be helpful for someone hiding a dragon egg. What\'s the narrator\'s real strategy?',
      'Having Ziggy gives the narrator a perfect cover story — if his parents notice a heat lamp or aquarium, he can say it\'s for his pet lizard!',
      ['specifically', 'strategy']),

    Q(3, 'vocabulary',
      'What does the narrator mean when he says the boxes were "a maze of cardboard"?',
      '',
      [
        'There were so many boxes piled up everywhere that it felt like being lost in a labyrinth',
        'Someone had carefully arranged the boxes into a fun obstacle course shaped like a maze',
        'The cardboard boxes were decorated with printed maze puzzles on every single side',
        'All the boxes looked identical, making it impossible to tell which one held what items'
      ], 0, 'context-clues',
      'When someone calls something "a maze," they\'re comparing it to something. What does a maze feel like to walk through? Confusing? Overwhelming?',
      'Calling the boxes "a maze of cardboard" means there were so many stacked everywhere that navigating through them felt confusing and overwhelming — just like a real maze!',
      ['labyrinth', 'identical']),

    Q(4, 'theme',
      'What is the most surprising thing that happens when Ziggy is placed near the egg?',
      '',
      [
        'Ziggy curls up right next to the egg as if trying to protect it and keep it warm',
        'The egg starts glowing faintly, and Ziggy doesn\'t seem scared of the light at all',
        'Ziggy immediately runs away from the aquarium and hides in the corner of the room',
        'Nothing happens at first, but later that night the narrator hears scratching sounds'
      ], 1, 'identifying-theme',
      'Think about what connects Ziggy (a lizard) to the egg. What reaction would be surprising and meaningful?',
      'When Ziggy seems comfortable near the egg and it starts reacting, it suggests a connection between the lizard and whatever is inside the egg. Reptiles and dragons are related!',
      ['protect']),

    Q(5, 'personal',
      'If you found a stray animal hiding in your house, what would you want to do?',
      '',
      [
        'Keep it as a pet after checking that it was healthy, safe, and not somebody else\'s',
        'Show it to my parents right away so they could help decide what the best plan would be',
        'Try to figure out where it came from and whether it had an owner looking for it first',
        'Build a small shelter for it outside until I could learn more about what it needed'
      ], 0, 'personal-connection',
      'Think about what you would realistically do. Would you try to keep it? Tell someone? How does your answer compare to the narrator\'s choice?',
      'The narrator chose to keep Ziggy, which worked out well for his secret plan. Your answer shows what kind of decision-maker you are!',
      [])
  ],

  // ═══════════════ CHAPTER 6: Thursday ═══════════════
  [CH(6)]: [
    Q(1, 'recall',
      'What is the narrator\'s dad\'s weakness when it comes to animals?',
      '',
      [
        'He pretends not to like them but always ends up bonding with every pet they meet',
        'He is allergic to most furry animals, which is why they only have a pet lizard now',
        'He loves watching nature documentaries but refuses to let any animals into the house',
        'He volunteers at the local animal shelter every weekend without telling the family'
      ], 0, 'finding-details',
      'Look for what the narrator says about his dad and animals. Does dad pretend to feel one way but act another?',
      'The dad pretends not to be interested in pets but can\'t help bonding with them. This is a sweet detail that shows he\'s a softie at heart!',
      ['bonding', 'allergic']),

    Q(2, 'inference',
      'Why did the narrator use Ziggy as an excuse to get a heat lamp?',
      '',
      [
        'Ziggy actually needed a heat lamp to survive, so it was a perfectly honest request',
        'The heat lamp was really for the dragon egg, and Ziggy provided a believable cover story',
        'His science teacher required all students to set up a reptile habitat for a class project',
        'He wanted to sell the heat lamp later to earn money for better dragon-hatching equipment'
      ], 1, 'making-inferences',
      'Think about the narrator\'s secret. Why would he need a heat lamp, and how does Ziggy help him get one without raising suspicion?',
      'The narrator cleverly uses Ziggy as a cover story! The heat lamp is really for keeping the dragon egg warm, but his parents think it\'s just for the pet lizard.',
      ['suspicion', 'believable']),

    Q(3, 'vocabulary',
      'What does the narrator\'s mom mean when she says, "Well, at least it\'s educational"?',
      '',
      [
        'She is trying to find a positive side to the situation even though she has some doubts',
        'She believes that owning a lizard will automatically improve his grades in science class',
        'She is being sarcastic and actually thinks having a pet lizard is a terrible idea overall',
        'She wants him to write a school report about Ziggy to justify keeping the pet at home'
      ], 0, 'context-clues',
      'Think about the tone. Is the mom enthusiastic, hesitant, or annoyed? "At least" is a clue — what does that phrase usually signal?',
      'When someone says "at least," they\'re looking for a silver lining. The mom isn\'t thrilled about Ziggy but is trying to see the bright side by focusing on learning.',
      ['sarcastic', 'educational']),

    Q(4, 'theme',
      'What is the narrator\'s main goal during this Thursday entry?',
      '',
      [
        'Making friends at the new school so he doesn\'t feel lonely during lunch and recess',
        'Gathering supplies he needs for the egg without his parents figuring out his real plan',
        'Teaching Ziggy tricks so he can bring the lizard to school for show and tell on Friday',
        'Writing down everything he knows about dragons before he forgets the important details'
      ], 1, 'identifying-theme',
      'Think about what the narrator is trying to accomplish throughout this entry. What\'s driving his actions?',
      'The narrator spends Thursday secretly gathering supplies — like the heat lamp — for the dragon egg. He\'s becoming quite the clever planner!',
      ['gathering']),

    Q(5, 'personal',
      'Have you ever had to convince a parent to let you have something you really wanted?',
      '',
      [
        'Yes, and I had to come up with good arguments for why I needed it and how I\'d use it',
        'Asking nicely and showing responsibility beforehand usually works better than begging',
        'Sometimes you need to find creative ways to explain why something is a good idea',
        'Parents usually agree once they see you have done your research and thought things through'
      ], 0, 'personal-connection',
      'Think about a time you really wanted something and had to persuade a parent. What worked? How is that similar to what the narrator does?',
      'Like the narrator convincing his parents the heat lamp is for Ziggy, sometimes you have to present things the right way to get a yes!',
      [])
  ],

  // ═══════════════ CHAPTER 7: Friday ═══════════════
  [CH(7)]: [
    Q(1, 'recall',
      'What was Carl at the pet store especially knowledgeable about?',
      '',
      [
        'Training dogs to do elaborate tricks for competitions held across the entire state',
        'Reptiles and how to properly care for all different species of lizards and snakes',
        'Building custom aquariums designed specifically for exotic tropical fish collections',
        'Growing special plants that are safe for pets to eat without getting sick at all'
      ], 1, 'finding-details',
      'Look for what makes Carl stand out as a pet store employee. What specific subject does he know a lot about?',
      'Carl at the pet store is a reptile expert! His specialized knowledge helps the narrator learn how to care for Ziggy — and secretly, the dragon egg too.',
      ['knowledgeable', 'elaborate']),

    Q(2, 'inference',
      'Why did the narrator\'s mom want lizard food in pellet form instead of live insects?',
      '',
      [
        'Pellets are cheaper and last longer than buying fresh live insects every single week',
        'Live bugs made her uncomfortable, and pellets seemed cleaner and easier to deal with',
        'The vet specifically recommended pellets because they contain more balanced nutrition',
        'Pellet food was the only option available at this particular pet store\'s small inventory'
      ], 1, 'making-inferences',
      'Think about the mom\'s personality. How would most parents feel about handling live bugs? What would they prefer instead?',
      'The mom wasn\'t thrilled about dealing with live insects — most people prefer the cleaner pellet option! Her reaction shows she\'s supportive but has her limits.',
      ['uncomfortable', 'nutrition']),

    Q(3, 'vocabulary',
      'What does the narrator mean when he says Carl explained things "enthusiastically"?',
      '',
      [
        'Carl spoke with great excitement and energy because he truly loved talking about reptiles',
        'Carl was bored and rushing through the explanation so he could go on his lunch break',
        'Carl read the information directly from the product labels without adding any personal input',
        'Carl whispered the details quietly so other customers wouldn\'t hear the private conversation'
      ], 0, 'context-clues',
      'The word "enthusiastically" describes HOW Carl talked. Break it down: "enthusiastic" means full of excitement. How would that look?',
      'When someone explains something enthusiastically, they speak with energy and passion! Carl clearly loves reptiles and was thrilled to share his knowledge.',
      ['enthusiastically', 'conversation']),

    Q(4, 'theme',
      'What was the main purpose of the pet store trip?',
      '',
      [
        'Getting supplies for Ziggy while also secretly learning information useful for the egg',
        'Buying a birthday present for the narrator\'s little sister who wanted a hamster badly',
        'Returning a defective heat lamp that stopped working after just one night of use',
        'Meeting Carl to ask whether baby dragons have ever been spotted anywhere in the area'
      ], 0, 'identifying-theme',
      'Think about WHY the narrator and his mom went to the pet store. Was there just one reason, or a hidden reason too?',
      'The pet store trip served double duty — the narrator got Ziggy supplies while secretly learning things that would help him care for whatever hatches from the egg!',
      ['defective']),

    Q(5, 'personal',
      'Is there someone in your life who gets really excited when talking about their favorite topic?',
      '',
      [
        'Yes, it\'s fun to listen to people who are passionate because their excitement is contagious',
        'People who know a lot about one subject can teach you things you never expected to learn',
        'Having a hobby or passion that you love to share with others makes life more interesting',
        'Sometimes experts explain things in a way that makes complicated topics easy to understand'
      ], 0, 'personal-connection',
      'Think about someone like Carl — a person who lights up when talking about what they love. Who is that person in your life?',
      'Carl\'s enthusiasm makes the pet store scene really fun. Having passionate people around us helps us learn and get excited about new things too!',
      [])
  ],

  // ═══════════════ CHAPTER 8: Saturday ═══════════════
  [CH(8)]: [
    Q(1, 'recall',
      'What woke the narrator up on this Saturday morning?',
      '',
      [
        'His alarm clock went off at the wrong time because the power had gone out overnight',
        'The dog next door was barking loudly at something moving around in the backyard',
        'A strange glowing light was coming from the aquarium where the egg was being kept',
        'His mom called him downstairs for breakfast because she had made his favorite pancakes'
      ], 2, 'finding-details',
      'Look for what interrupted the narrator\'s sleep. What unusual thing was happening with the egg?',
      'The narrator woke up to a strange glowing light coming from the aquarium — the egg was finally doing something! That would definitely wake you up.',
      ['interrupted']),

    Q(2, 'inference',
      'Why did the narrator kick the glowing rock into the closet?',
      '',
      [
        'He was angry at the rock for waking him up from a really good dream about dragons',
        'Panicking about his parents seeing the glow, he hid it in the nearest dark space quickly',
        'The rock was burning hot and he needed to move it away from the wooden bed frame safely',
        'His first instinct was to play soccer with it because he was still half asleep and confused'
      ], 1, 'making-inferences',
      'Think about what would happen if the narrator\'s parents saw a glowing rock. What emotion would make him react so fast?',
      'The narrator panicked! A glowing rock would be impossible to explain to his parents, so he quickly hid it in the darkest, most hidden spot — the closet.',
      ['panicking']),

    Q(3, 'vocabulary',
      'What does the narrator mean when he describes Ziggy sleeping "motionless" on the warm rock?',
      '',
      [
        'Ziggy was completely still and not moving at all, like a tiny statue on the rock surface',
        'Ziggy was tossing and turning in his sleep, clearly having a very active lizard dream',
        'Ziggy had left the rock earlier and was actually sleeping somewhere else in the aquarium',
        'Ziggy was pretending to sleep but was actually watching the glowing egg with one eye open'
      ], 0, 'context-clues',
      'The word "motionless" has a clear root word inside it. "Motion" means movement. What does adding "-less" do to the meaning?',
      '"Motionless" means without any motion — completely still. Ziggy was so relaxed on the warm rock that he looked like a little statue!',
      ['motionless']),

    Q(4, 'theme',
      'What is the biggest event that happens in this Saturday entry?',
      '',
      [
        'The narrator finally finishes unpacking every single box in his bedroom and closet',
        'Ziggy lays an egg of his own, which means Ziggy is actually a female lizard named Ziggy',
        'The mysterious egg begins to glow and show clear signs that something inside is alive',
        'The narrator tells his best friend about the egg during a late-night video call session'
      ], 2, 'identifying-theme',
      'What makes this Saturday different from all the other days? Look for the most dramatic moment.',
      'The egg glowing is a game-changer! After days of waiting, the narrator finally has proof that something is alive inside the mysterious rock. The excitement is building!',
      []),

    Q(5, 'personal',
      'How would you react if something you\'d been waiting for finally started happening?',
      '',
      [
        'Excited but also nervous, because the moment you\'ve been waiting for can feel overwhelming',
        'Proud of myself for being patient, since good things often take time to finally arrive',
        'Ready to tell everyone I know, because sharing exciting news makes the moment even better',
        'Calm and focused, because the real challenge often begins right when things start happening'
      ], 0, 'personal-connection',
      'Think about a time you waited a long time for something — a holiday, a game release, a test result. How did you feel when it finally happened?',
      'Waiting and then finally seeing results is thrilling! The narrator\'s mix of excitement and panic is exactly how most people feel in that moment.',
      [])
  ],

  // ═══════════════ CHAPTER 9: Sunday ═══════════════
  [CH(9)]: [
    Q(1, 'recall',
      'What did the baby dragon look like when it first appeared from the closet?',
      '',
      [
        'Tiny and wobbly with bright scales, barely bigger than the palm of a hand overall',
        'Huge and terrifying with sharp teeth and wings that stretched across the whole room',
        'Completely invisible at first until it sneezed out a small puff of sparkling smoke',
        'Covered in a thick shell coating that slowly crumbled away as it stretched its wings'
      ], 0, 'finding-details',
      'Look for the description of the baby dragon\'s first appearance. How does the narrator describe its size and look?',
      'The baby dragon was tiny, wobbly, and small enough to fit in someone\'s hand — not the giant scary beast you might expect from the stories!',
      ['wobbly', 'terrifying']),

    Q(2, 'inference',
      'How did the narrator know the baby dragon was still alive after it crashed into things?',
      '',
      [
        'He could hear tiny breathing sounds and saw it moving slightly beneath a fallen shirt',
        'A small trail of scorch marks on the floor led directly to where the dragon had landed',
        'The dragon let out a loud roar that shook the windows and rattled items on the shelves',
        'His phone\'s camera detected unusual heat signatures coming from the corner of the room'
      ], 0, 'making-inferences',
      'After a baby dragon crashes around, what sounds or signs would tell you it survived? Think small — this is a tiny dragon.',
      'The narrator heard small sounds and saw movement, confirming the baby dragon survived its clumsy flight. Baby creatures of all kinds tend to be wobbly at first!',
      ['scorch', 'signatures']),

    Q(3, 'vocabulary',
      'What does the word "ricocheted" mean when the narrator says the dragon ricocheted off the walls?',
      '',
      [
        'Bounced off surfaces rapidly in different directions, like a ball in a pinball machine',
        'Flew in a perfectly straight line from one end of the room directly to the other end',
        'Hovered in one spot while flapping its wings as hard and fast as it possibly could',
        'Crashed through the wall leaving a dragon-shaped hole like a scene from a cartoon show'
      ], 0, 'context-clues',
      'Picture something ricocheting — it hits one surface and bounces to another. What image does that create for the baby dragon?',
      '"Ricocheted" means bouncing off surfaces in different directions. The baby dragon was zooming around the room, bouncing off walls like a tiny pinball!',
      ['ricocheted', 'hovered']),

    Q(4, 'theme',
      'Why is this Sunday entry the most important one so far in the diary?',
      '',
      [
        'It records the exact moment the narrator\'s wildest dream actually became real at last',
        'It contains the narrator\'s decision to finally tell his parents about everything secret',
        'It describes the first day of school in complete detail from morning until afternoon',
        'It explains how the narrator built a perfect habitat for both Ziggy and the new dragon'
      ], 0, 'identifying-theme',
      'Think about what makes this entry a turning point. What happened that changes everything going forward?',
      'This is the moment everything changes — the dragon actually hatched! The narrator\'s life went from "I might have a dragon egg" to "I definitely have a real baby dragon."',
      []),

    Q(5, 'personal',
      'What would be the first thing you\'d do if a baby dragon hatched in your bedroom closet?',
      '',
      [
        'Try to keep it calm and figure out what it needs while making sure nobody hears anything',
        'Run out of the room screaming because having a real dragon appear would be pretty scary',
        'Grab my phone to record it because nobody would believe me otherwise without solid proof',
        'Open the window so it could fly free since keeping a wild magical creature seems unfair'
      ], 0, 'personal-connection',
      'Be honest — what would your very first reaction be? Excitement? Fear? Curiosity? There\'s no wrong answer!',
      'Everyone would react differently! The narrator tried to stay calm, which is impressive when a tiny dragon is bouncing around your bedroom.',
      [])
  ],

  // ═══════════════ CHAPTER 10: Monday ═══════════════
  [CH(10)]: [
    Q(1, 'recall',
      'Where did the narrator find the dragon after it disappeared from the room?',
      '',
      [
        'Hiding in the bathroom cabinet behind a stack of towels and cleaning supplies',
        'Sleeping on top of the refrigerator where the warm air from the motor rises up',
        'Curled up inside his backpack, which was hanging on the hook behind his bedroom door',
        'Sitting on the windowsill camouflaged against the curtain fabric with its color change'
      ], 2, 'finding-details',
      'Scan for where the narrator eventually discovers the hiding dragon. Where was it tucked away?',
      'The narrator found the dragon curled up inside his backpack! Even baby dragons need cozy spots to nap.',
      ['camouflaged']),

    Q(2, 'inference',
      'What does it tell you about the dragon that it got into the backpack by itself?',
      '',
      [
        'Baby dragons are drawn to enclosed dark spaces that feel safe and warm like a nest would',
        'The dragon was trying to escape and go back to the garage sale where the egg came from',
        'It wanted to go to school with the narrator because it was bored being alone all day long',
        'Dragons are naturally curious creatures that love exploring bags, boxes, and tight spaces'
      ], 0, 'making-inferences',
      'Why would a tiny creature crawl into a backpack? Think about what a backpack is like from a dragon\'s perspective — dark, warm, enclosed.',
      'The dragon chose the backpack because it\'s a dark, enclosed space — just like a nest or cave! Baby animals often seek out cozy hiding spots where they feel safe.',
      ['enclosed', 'naturally']),

    Q(3, 'vocabulary',
      'Why does the narrator call the dragon a "dragon ninja"?',
      '',
      [
        'Because it fights invisible enemies using martial arts moves it learned from watching TV',
        'Because it moves silently and disappears so quickly that it seems like a sneaky ninja',
        'Because its black scales make it look exactly like a ninja wearing a dark costume at night',
        'Because it only comes out after midnight, which is when real ninjas do all their training'
      ], 1, 'context-clues',
      'What are ninjas known for? Stealth and speed! How does that connect to what the dragon does?',
      'Calling it a "dragon ninja" is a fun way of saying the dragon is incredibly sneaky and fast — it can disappear and reappear before you even know what happened!',
      ['martial', 'stealth']),

    Q(4, 'theme',
      'What important decisions does the narrator make about the dragon in this entry?',
      '',
      [
        'He decides to name it Tiny and commits to keeping it hidden and safe from everyone',
        'He decides to release the dragon back into the wild because it belongs in the forest',
        'He calls a scientist to come examine the dragon and help determine what species it is',
        'He decides to show the dragon to his parents because the secret is getting too difficult'
      ], 0, 'identifying-theme',
      'Think about the choices the narrator makes. What name does he pick, and what plan does he commit to?',
      'Naming the dragon "Tiny" and deciding to keep it secret shows the narrator is fully committed to caring for this creature. Giving it a name makes it personal!',
      ['commits', 'determine']),

    Q(5, 'personal',
      'If you had a secret pet, what would you name it and why?',
      '',
      [
        'A funny name that describes how it looks or acts, because personality-based names are best',
        'Something that sounds normal so nobody gets suspicious if they accidentally hear the name',
        'A strong powerful name because even small creatures deserve names that make them feel big',
        'The same name as my favorite book or movie character because that would make it extra cool'
      ], 0, 'personal-connection',
      'The narrator chose "Tiny" because the dragon is small. What would your naming strategy be for a secret pet?',
      'Names say a lot about how we see our pets. "Tiny" is funny because the dragon might not stay small forever!',
      [])
  ],

  // ═══════════════ CHAPTER 11: Tuesday ═══════════════
  [CH(11)]: [
    Q(1, 'recall',
      'How did Tiny escape from the tank?',
      '',
      [
        'By pushing the lid off with surprising strength and climbing over the glass edge easily',
        'Through a small crack in the corner that formed after Tiny scratched at it repeatedly',
        'By melting a hole in the side of the aquarium glass using a focused burst of dragon fire',
        'Ziggy helped by pushing the lid while Tiny squeezed through the gap they created together'
      ], 0, 'finding-details',
      'Look for the specific method Tiny used to get out. Was it strength, fire, or something else?',
      'Tiny pushed the lid off the tank and climbed out — showing surprising strength for such a small dragon! The narrator learned he needs better security.',
      ['repeatedly', 'focused']),

    Q(2, 'inference',
      'Why does the narrator say Tiny "has strong opinions about math homework"?',
      '',
      [
        'Tiny accidentally toasted the homework pages, which the narrator found hilariously convenient',
        'The dragon can actually read numbers and pointed out several wrong answers on the worksheet',
        'Tiny arranged the math papers into a neat pile, showing an unexpected talent for organization',
        'The dragon sat on top of the homework refusing to move, preventing any work from being done'
      ], 0, 'making-inferences',
      'Think about what a baby dragon might do to paper. What\'s the funny connection between dragon fire and homework?',
      'Tiny\'s fire breath toasted the math homework — which the narrator found pretty funny! It\'s a humorous way of saying the dragon "destroyed" his homework.',
      ['convenient', 'organization']),

    Q(3, 'vocabulary',
      'What does it mean that the page was "toasting" and not "burning"?',
      '',
      [
        'The paper turned brown and crispy around the edges but didn\'t actually catch on full fire',
        'Tiny was making toast for breakfast using the homework papers as a heat source instead',
        'The homework got wet and soggy, making all the written answers impossible to read clearly',
        'A magical spell from the dragon turned the paper into a slice of perfectly golden toast'
      ], 0, 'context-clues',
      'Think about the difference between toasting bread and burning it. Toasting is gentler — what would "toasted" paper look like?',
      'Toasting means the paper got brown and crispy but didn\'t burst into flames. It\'s like the difference between a nicely browned piece of toast and a burnt one!',
      ['crispy']),

    Q(4, 'theme',
      'What two new things does the narrator learn about Tiny in this entry?',
      '',
      [
        'Tiny is strong enough to escape the tank and can produce small controlled bursts of fire',
        'Tiny can speak English clearly and also knows how to unlock any door in the entire house',
        'Tiny hates loud music intensely and also refuses to eat anything besides raw vegetables',
        'Tiny can turn invisible at will and also has the ability to read people\'s private thoughts'
      ], 0, 'identifying-theme',
      'Look for the NEW discoveries about Tiny\'s abilities. What two things surprised the narrator?',
      'The narrator discovers Tiny is strong enough to escape and can breathe fire (even if it\'s small). These abilities make keeping Tiny hidden a bigger challenge!',
      ['controlled', 'invisible']),

    Q(5, 'personal',
      'What would you do if your pet accidentally destroyed your homework?',
      '',
      [
        'Take a photo as proof and hope the teacher believes the wildest excuse of all time',
        'Redo the homework quickly and keep a closer eye on my pet during study time from now on',
        'Laugh about it first and then figure out how to explain the situation to my teacher',
        'Make sure to keep all important papers in a safe place where pets cannot reach them'
      ], 0, 'personal-connection',
      'Think about how you\'d explain "my dragon toasted my homework" to your teacher. Would they believe you?',
      'The classic "my dog ate my homework" excuse just got upgraded to "my dragon toasted my homework"! The narrator can\'t exactly tell the truth here.',
      [])
  ],

  // ═══════════════ CHAPTER 12: Wednesday ═══════════════
  [CH(12)]: [
    Q(1, 'recall',
      'How did Tiny react when the narrator first offered a marshmallow?',
      '',
      [
        'Sniffed it carefully, then toasted it with a tiny burst of fire before eating it happily',
        'Ignored it completely and continued sleeping in the warm corner of the aquarium instead',
        'Knocked it out of the narrator\'s hand and then chased it across the floor like a toy',
        'Grabbed it immediately and swallowed the entire marshmallow whole without even chewing'
      ], 0, 'finding-details',
      'Look for Tiny\'s first reaction to the marshmallow. What did the dragon do before eating it?',
      'Tiny sniffed the marshmallow, then toasted it with dragon fire before eating it — showing that dragons prefer their marshmallows perfectly roasted!',
      ['chewing']),

    Q(2, 'inference',
      'What does the marshmallow experiment reveal about Tiny\'s personality?',
      '',
      [
        'Tiny is picky about food temperature and prefers everything cooked before eating it',
        'Tiny is scared of new foods and will only eat things that smell familiar and comforting',
        'Dragons have no sense of taste and will eat anything regardless of how it is prepared',
        'Tiny is aggressive around food and will attack anyone who tries to take it away quickly'
      ], 0, 'making-inferences',
      'What does Tiny\'s behavior with the marshmallow tell you about how this dragon approaches food? Think about personality traits.',
      'Tiny toasting the marshmallow first shows the dragon is particular about food! It also reveals that Tiny\'s fire breathing can be gentle and controlled, not just destructive.',
      ['personality', 'regardless']),

    Q(3, 'vocabulary',
      'What does the narrator mean when he calls the toasted marshmallows "dragon-roasted perfection"?',
      '',
      [
        'The marshmallows were toasted to an absolutely ideal golden brown by Tiny\'s gentle fire',
        'The marshmallows were completely burned and charred black and totally impossible to enjoy',
        'Tiny arranged the marshmallows into a perfectly symmetrical pattern on the plate artfully',
        'The marshmallows were still frozen because Tiny\'s breath turned out to be ice cold instead'
      ], 0, 'context-clues',
      'Break down "dragon-roasted perfection" — "roasted" means cooked with heat, and "perfection" means the best possible result. What picture does that paint?',
      'Dragon-roasted perfection means Tiny toasted the marshmallows to an ideal golden brown — better than any campfire could do! The narrator is impressed.',
      ['perfection', 'symmetrical']),

    Q(4, 'theme',
      'What happened after Tiny spotted the plate of marshmallows on the kitchen counter?',
      '',
      [
        'Tiny stayed calm and waited patiently for the narrator to bring one over to share',
        'The dragon flew straight to the counter and toasted the entire plate in one excited burst',
        'Tiny hid behind the couch because the white marshmallows scared the dragon initially',
        'Nothing happened because Tiny was too tired from playing to care about more food treats'
      ], 1, 'identifying-theme',
      'Think about what a food-loving dragon would do when spotting a whole plate of its new favorite snack. What\'s the most likely reaction?',
      'Tiny couldn\'t resist — the dragon flew right to the plate and toasted them all! This shows that Tiny\'s love for marshmallows might cause problems.',
      ['initially', 'patiently']),

    Q(5, 'personal',
      'What is your favorite snack, and how would you feel if you discovered it for the first time?',
      '',
      [
        'As excited as Tiny discovering marshmallows — some foods just make you instantly happy',
        'Curious to try it different ways, like Tiny experimenting with toasting before eating',
        'Eager to share it with friends because the best foods are even better when shared together',
        'Grateful to whoever introduced it to me because great discoveries often come from others'
      ], 0, 'personal-connection',
      'Think about your all-time favorite snack. Remember the first time you tried it — how did you feel? Connect that to Tiny\'s marshmallow discovery.',
      'Tiny\'s pure joy over marshmallows is just like our own excitement when we discover a new favorite food. Some things just click!',
      [])
  ],

  // ═══════════════ CHAPTER 13: Thursday ═══════════════
  [CH(13)]: [
    Q(1, 'recall',
      'What food did Tiny end up loving even more than marshmallows?',
      '',
      [
        'Fresh strawberries picked from the garden patch behind the narrator\'s house',
        'Pepperoni pizza slices that were leftover from the family dinner the night before',
        'Chicken nuggets that the narrator microwaved and offered as an experiment treat',
        'Peanut butter sandwiches cut into tiny dragon-sized triangles for easier eating'
      ], 2, 'finding-details',
      'Look for the food that Tiny loved most. What did the narrator offer that got the biggest reaction?',
      'Tiny absolutely loved chicken nuggets — even more than marshmallows! The narrator discovered this by microwaving some and offering them to the dragon.',
      ['experiment']),

    Q(2, 'inference',
      'Why did Tiny blast the microwaved chicken nuggets with fire before eating them?',
      '',
      [
        'Dragons instinctively heat their food to a higher temperature before consuming it',
        'The nuggets were frozen in the middle and Tiny could somehow sense they weren\'t hot enough',
        'Tiny was angry that the narrator took too long bringing the food over to the aquarium',
        'The microwave smell confused Tiny into thinking the nuggets were a threat to be destroyed'
      ], 0, 'making-inferences',
      'Think about why a fire-breathing creature would add MORE heat to already-warm food. What might be instinctive for a dragon?',
      'Dragons seem to naturally want their food extra hot! It\'s an instinct — just like how some animals always sniff their food before eating, dragons fire-blast theirs.',
      ['instinctively', 'consuming']),

    Q(3, 'vocabulary',
      'What does "gobbled" mean when the narrator says Tiny "gobbled up every last nugget"?',
      '',
      [
        'Ate everything very quickly and eagerly without pausing between bites for even a second',
        'Carefully examined each piece before deciding whether or not it was worth eating slowly',
        'Shared the food equally between himself and Ziggy like a generous and thoughtful friend',
        'Hid the nuggets around the room to save them for later like a squirrel storing acorns'
      ], 0, 'context-clues',
      'The word "gobbled" sounds like what it means! Say it out loud — does it sound fast or slow? Careful or greedy?',
      '"Gobbled" means eating quickly and eagerly, barely stopping to chew. Tiny was so excited about the chicken nuggets that they disappeared almost instantly!',
      ['gobbled', 'generous']),

    Q(4, 'theme',
      'What problem does the narrator realize now that Tiny knows about chicken nuggets?',
      '',
      [
        'Keeping Tiny fed will be expensive and hard to hide from his parents who buy the groceries',
        'Tiny will only eat nuggets and refuse all other foods, which creates a nutrition problem',
        'The smell of cooking nuggets will attract neighborhood cats that might discover the dragon',
        'Tiny will grow too fast on a protein-rich diet and soon be impossible to hide in a room'
      ], 0, 'identifying-theme',
      'Think about the practical problems. If your secret pet suddenly needs lots of a specific food, what challenges would come up?',
      'The narrator realizes that a nugget-loving dragon is expensive to feed — and it\'s hard to explain why so many chicken nuggets keep disappearing from the kitchen!',
      ['nutrition', 'expensive']),

    Q(5, 'personal',
      'Is there a food you love so much that you would eat it every single day if you could?',
      '',
      [
        'Absolutely — some foods never get boring no matter how many times you eat them weekly',
        'For a while yes, but eventually eating the same thing every day would get old and boring',
        'Only if it was healthy, because eating junk food daily would make me feel terrible eventually',
        'My favorite food changes constantly, so the answer would be different depending on the week'
      ], 0, 'personal-connection',
      'Think about YOUR food obsession. Is there something you could eat forever, like Tiny with chicken nuggets?',
      'We all have that one food we can\'t get enough of — Tiny\'s is chicken nuggets! Food obsessions are universal, whether you\'re a human or a dragon.',
      [])
  ],

  // ═══════════════ CHAPTER 14: Friday ═══════════════
  [CH(14)]: [
    Q(1, 'recall',
      'What colors did Tiny\'s scales turn when music started playing?',
      '',
      [
        'Bright red and orange flickering like flames dancing across the dragon\'s whole body',
        'Multiple shifting colors that changed with the beat, like a living rainbow light show',
        'Pure white that glowed brightly enough to light up the entire bedroom in the dark night',
        'Dark green and brown camouflage patterns that helped Tiny blend into the bedroom walls'
      ], 1, 'finding-details',
      'Look for the description of what happened to Tiny\'s appearance when the music played. What did the scales look like?',
      'Tiny\'s scales shifted through multiple colors that changed with the music — like a tiny living disco ball! It was a completely new ability the narrator hadn\'t seen before.',
      ['flickering', 'camouflage']),

    Q(2, 'inference',
      'Why do you think Tiny reacted so strongly to music?',
      '',
      [
        'Dragons might be deeply sensitive to sound vibrations in ways that humans cannot fully understand',
        'The music was played at an extremely loud volume that physically hurt the dragon\'s sensitive ears',
        'Tiny was frightened by the noise and the color changes were actually a defensive warning signal',
        'Someone had trained the dragon before the egg was sold, teaching it to respond to different songs'
      ], 0, 'making-inferences',
      'Think about why a magical creature might react to music. Is it fear, joy, or something deeper connected to the dragon\'s nature?',
      'Dragons seem to be sensitive to vibrations and sounds in special ways. Tiny\'s color changes suggest music connects to something deep in dragon nature — almost magical.',
      ['vibrations', 'sensitive']),

    Q(3, 'vocabulary',
      'What is a "cleaning playlist" as the narrator uses the term?',
      '',
      [
        'A collection of upbeat songs someone listens to while doing chores to make them more fun',
        'A special type of music scientifically designed to help people focus and clean efficiently',
        'A list of cleaning supplies organized in the order that you should use them in a room',
        'A phone app that plays reminders telling you exactly which room needs to be cleaned next'
      ], 0, 'context-clues',
      'Break the phrase into parts: "cleaning" is an activity, and "playlist" is a list of songs. What do you get when you combine them?',
      'A cleaning playlist is a collection of songs people play while doing chores — the music makes boring tasks like cleaning feel more fun and go faster!',
      ['efficiently', 'playlist']),

    Q(4, 'theme',
      'What surprising new ability does the narrator discover about Tiny in this entry?',
      '',
      [
        'Tiny can turn completely invisible when scared, making the dragon impossible to find anywhere',
        'Tiny\'s scales change colors in response to music, creating a beautiful and magical light display',
        'Tiny can communicate with other animals using a special high-pitched sound only they can hear',
        'Tiny has the ability to fly at incredible speeds that break the sound barrier inside the house'
      ], 1, 'identifying-theme',
      'What NEW power or skill does Tiny reveal that the narrator hasn\'t seen before? This one is connected to music.',
      'Tiny\'s color-changing scales that react to music are a brand-new discovery! Each chapter reveals something new about what makes this dragon special.',
      ['communicate', 'incredible']),

    Q(5, 'personal',
      'Does music change your mood or energy level? How?',
      '',
      [
        'Yes, fast songs give me energy while slow songs help me calm down and relax completely',
        'Music can make boring activities like homework or chores feel much more enjoyable overall',
        'Listening to my favorite songs always puts me in a better mood no matter what happened',
        'Different types of music work for different situations, like studying versus exercising hard'
      ], 0, 'personal-connection',
      'Think about how music affects YOU. Does it change your energy like it changes Tiny\'s scales?',
      'Just like Tiny\'s scales respond to music, humans are deeply affected by it too — our moods, energy, and even heartbeat change with different songs!',
      [])
  ],

  // ═══════════════ CHAPTER 15: Saturday ═══════════════
  [CH(15)]: [
    Q(1, 'recall',
      'What happened when the narrator tried to get Tiny into his backpack?',
      '',
      [
        'Tiny refused to cooperate and kept flying out of the bag every time it was placed inside',
        'The dragon fit perfectly and fell asleep immediately in the cozy dark space of the bag',
        'Tiny burned a small hole through the bottom of the backpack while trying to get comfortable',
        'The narrator gave up because Tiny was too large to fit inside the backpack opening anymore'
      ], 0, 'finding-details',
      'Look for the part where the narrator tries to put Tiny in the backpack. How does the dragon respond?',
      'Tiny kept escaping from the backpack — the dragon had its own ideas about where it wanted to be! Getting a dragon to cooperate is harder than it looks.',
      ['cooperate']),

    Q(2, 'inference',
      'Why do you think Tiny stopped time when the narrator\'s mom was about to walk in?',
      '',
      [
        'Tiny sensed the narrator\'s panic and instinctively used a hidden power to protect them both',
        'The dragon was practicing time-freezing abilities that it had been working on all week long',
        'Stopping time was just a coincidence that happened right at the exact same moment randomly',
        'The narrator\'s mom actually froze on her own because she was so shocked by a noise inside'
      ], 0, 'making-inferences',
      'Think about WHY this power activated at this specific moment. Was Tiny protecting the narrator? Was it instinct?',
      'Tiny sensed the danger of being discovered and instinctively froze time to protect both of them. This suggests dragons can sense their owner\'s emotions!',
      ['instinctively', 'coincidence']),

    Q(3, 'vocabulary',
      'What does the narrator mean when he says his mom "glitched like a video game character"?',
      '',
      [
        'She froze mid-step and was completely stuck in place, like a game character that stopped loading',
        'She started moving in fast-forward speed and zooming around the room in an unnatural way',
        'Her voice echoed and repeated the same sentence multiple times like a broken audio recording',
        'She flickered between visible and invisible like a hologram losing its signal during a storm'
      ], 0, 'context-clues',
      'In video games, what does a "glitch" look like? Characters freeze, stutter, or stop working normally. Apply that image to the mom.',
      'A video game glitch makes characters freeze or act weird. The narrator\'s mom froze mid-step, just like when a game character stops responding — because Tiny stopped time!',
      ['hologram', 'unnatural']),

    Q(4, 'theme',
      'What incredible new power does Tiny reveal in this entry?',
      '',
      [
        'The ability to read minds and communicate thoughts directly into people\'s brains',
        'The power to shrink down to the size of an insect and become nearly impossible to see',
        'The ability to freeze time temporarily, stopping everything and everyone except the dragon',
        'The power to transform into any animal it wants, perfectly copying their appearance exactly'
      ], 2, 'identifying-theme',
      'What is the biggest, most dramatic new ability Tiny shows? This one changes everything about keeping the secret.',
      'Tiny can freeze time! This is the most powerful ability revealed so far and changes everything — it means Tiny might be able to protect the narrator\'s secret.',
      ['temporarily', 'transform']),

    Q(5, 'personal',
      'If you could freeze time for ten seconds, what would you use that power for?',
      '',
      [
        'Avoiding an embarrassing moment by fixing whatever went wrong before anyone notices it',
        'Getting extra time on a test to double-check my answers and make sure everything is right',
        'Pulling a harmless prank on a friend that would be impossible without time being frozen',
        'Just enjoying a really perfect moment a little longer before it has to end and move on'
      ], 0, 'personal-connection',
      'Tiny uses time-freezing for protection. What would YOUR reason be? Think creatively about how you\'d use this ability.',
      'Time-freezing is one of the coolest superpowers! Everyone would use it differently — the narrator is just grateful it saved him from being caught.',
      [])
  ],

  // ═══════════════ CHAPTER 16: Sunday ═══════════════
  [CH(16)]: [
    Q(1, 'recall',
      'What two loud noises scared Tiny during this Sunday?',
      '',
      [
        'A car backfiring outside the window and the smoke alarm going off in the kitchen nearby',
        'Thunder from a storm rolling through town and a door slamming shut from a gust of wind',
        'The vacuum cleaner starting up suddenly and the neighbor\'s dog barking right outside loudly',
        'A fireworks display in the distance and the television volume jumping to maximum by accident'
      ], 1, 'finding-details',
      'Look for the two specific sounds that frightened Tiny. What happened in the environment around the house?',
      'Thunder and a slamming door both scared Tiny — showing that loud, sudden noises are this dragon\'s biggest weakness!',
      ['backfiring']),

    Q(2, 'inference',
      'Why did the narrator decide NOT to bring Tiny to school?',
      '',
      [
        'Too many loud noises at school could trigger Tiny\'s powers and cause an uncontrollable scene',
        'The narrator\'s backpack was already too full of textbooks to fit a dragon inside safely',
        'His best friend at school is allergic to reptiles and would get sick if Tiny came along',
        'The principal announced a strict no-pets policy that specifically mentioned exotic creatures'
      ], 0, 'making-inferences',
      'Think about what happens when Tiny gets scared by loud noises. Now imagine a school full of bells, yelling kids, and slamming lockers.',
      'School is full of sudden loud noises — bells, lockers, shouting — and each one could trigger Tiny\'s powers. The risk of exposure would be way too high!',
      ['uncontrollable', 'exotic']),

    Q(3, 'vocabulary',
      'What does the narrator mean when he says he is "completely torn" about a decision?',
      '',
      [
        'He feels pulled in two different directions and cannot decide which choice is the right one',
        'His favorite shirt got ripped during a struggle while trying to catch Tiny before it escaped',
        'He is extremely angry about the situation and wants to yell at someone to release frustration',
        'The pages of his diary are physically damaged because Tiny accidentally burned the paper edges'
      ], 0, 'context-clues',
      'Being "torn" about something means feeling pulled in opposite directions. What two sides is the narrator choosing between?',
      'Being "completely torn" means the narrator can\'t decide between two options — wanting to keep Tiny safe at home versus wanting to bring the dragon with him.',
      ['frustration', 'physically']),

    Q(4, 'theme',
      'What important thing does the narrator figure out about Tiny\'s powers?',
      '',
      [
        'Tiny\'s abilities are triggered by strong emotions like fear, not controlled by choice or will',
        'The dragon can only use each power once per day before needing a long nap to recharge fully',
        'Tiny\'s powers grow stronger every time chicken nuggets are eaten within an hour beforehand',
        'The abilities only work when the narrator is nearby, suggesting a magical bond between them'
      ], 0, 'identifying-theme',
      'Think about WHEN Tiny\'s powers activate. Is it random, or does it connect to how the dragon is feeling?',
      'The narrator realizes Tiny\'s powers are emotional — they activate when the dragon feels strong emotions like fear. This makes the powers unpredictable and hard to control!',
      ['triggered', 'recharge']),

    Q(5, 'personal',
      'What do you do when you feel scared by a sudden loud noise?',
      '',
      [
        'Jump first, then take deep breaths to calm myself down once I realize everything is okay',
        'Look around quickly to figure out what caused the noise before deciding how to react next',
        'Cover my ears and close my eyes for a moment until the startling feeling passes completely',
        'Laugh it off afterward even though my heart was racing because being startled feels silly'
      ], 0, 'personal-connection',
      'Everyone reacts to sudden loud noises! Think about YOUR reaction and how it compares to Tiny\'s dragon-powered version.',
      'When we get startled, our bodies react automatically — just like Tiny! The difference is our reaction is a racing heart, while Tiny\'s is freezing time.',
      [])
  ],

  // ═══════════════ CHAPTER 17: Monday ═══════════════
  [CH(17)]: [
    Q(1, 'recall',
      'What did the narrator see poking out of Sprinkles\' backpack at school?',
      '',
      [
        'A scaly tail that looked like it belonged to a small lizard or possibly a baby dragon',
        'A glowing horn that shimmered with rainbow colors and sparkled in the classroom light',
        'A tiny pair of wings folded neatly that could only belong to some kind of magical creature',
        'A fluffy unicorn mane peeking out through the zipper opening of the half-closed backpack'
      ], 1, 'finding-details',
      'Look for the specific detail the narrator spotted sticking out of Sprinkles\' bag. What magical clue was visible?',
      'The narrator saw a glowing horn poking out of Sprinkles\' backpack — revealing that another classmate might also have a magical secret creature!',
      ['shimmered', 'creature']),

    Q(2, 'inference',
      'Why was Sprinkles shocked that the narrator could see her unicorn?',
      '',
      [
        'Only people with their own magical creatures can see other people\'s magical creatures too',
        'She had cast an invisibility spell that should have hidden the unicorn from all human eyes',
        'Unicorns are trained from birth to stay hidden and have never been spotted by outsiders',
        'The narrator was wearing special glasses that she thought only magical shopkeepers owned'
      ], 0, 'making-inferences',
      'Why would seeing something magical be surprising? Think about what the narrator has that other students don\'t.',
      'Sprinkles was shocked because normally only magical creature owners can see other magical creatures. The narrator having Tiny must have given him the ability to see!',
      ['invisibility', 'outsiders']),

    Q(3, 'vocabulary',
      'Why does the narrator use code names like "Sprinkles" and "Marshmallow" in the diary?',
      '',
      [
        'To protect their real identities in case someone reads the diary and discovers the truth',
        'Because he forgot their actual names since he just moved to the school very recently',
        'The teacher assigned everyone food-themed nicknames as a fun first-week bonding activity',
        'His parents told him never to write real names in a personal diary for privacy reasons'
      ], 0, 'context-clues',
      'Think about why someone keeping a BIG secret would use fake names. What are they protecting?',
      'Code names protect everyone involved! If someone found the diary, they wouldn\'t know who Sprinkles really is. The narrator is being smart about keeping secrets safe.',
      ['identities', 'privacy']),

    Q(4, 'theme',
      'What is the most important thing that happens to the narrator at the end of the book?',
      '',
      [
        'He discovers he is not alone — other kids at school also have secret magical creatures',
        'He decides to release Tiny back into the wild because keeping a dragon is too dangerous',
        'His parents finally discover the dragon and ground him for the rest of the entire school year',
        'He moves away to yet another new town before anyone can discover his secret about Tiny'
      ], 0, 'identifying-theme',
      'Think about what changes the narrator\'s situation the most. What discovery makes the biggest difference?',
      'The biggest revelation is that the narrator isn\'t alone! Finding out other kids have magical creatures too changes everything and sets up an exciting next chapter in his life.',
      ['revelation', 'dangerous']),

    Q(5, 'personal',
      'What does the narrator do at the very end of the book, and what would you do?',
      '',
      [
        'He starts writing a new diary entry, excited about the adventures ahead with new friends',
        'He decides to tell his parents everything because the secret has become too big to handle',
        'He locks the diary away forever and pretends none of the magical events ever happened',
        'He challenges Sprinkles to a magical creature competition to see whose pet is more powerful'
      ], 0, 'personal-connection',
      'Think about how the narrator feels at this moment — excited? Relieved? Scared? What would your next move be?',
      'The narrator ends the book looking forward to new adventures with Tiny AND new friends who understand his secret. Sometimes the best part of a story is knowing more is coming!',
      [])
  ]
};

// ─── Insert into Supabase ───
async function main() {
  console.log('═══════════════════════════════════════════');
  console.log('  SEED DRAGON DIARIES QUIZ QUESTIONS');
  console.log('═══════════════════════════════════════════');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

  let totalInserted = 0;
  const chapterIds = Object.keys(ALL_QUESTIONS).map(Number).sort((a, b) => a - b);

  for (const chapterId of chapterIds) {
    const questions = ALL_QUESTIONS[chapterId];
    const chapterNum = chapterId - 127;
    console.log(`Chapter ${chapterNum} (ID: ${chapterId}): ${questions.length} questions`);

    // Check if questions already exist
    const { data: existing } = await supabase.from('quiz_questions').select('id').eq('chapter_id', chapterId);
    if (existing && existing.length > 0) {
      console.log(`  SKIP — ${existing.length} questions already exist`);
      continue;
    }

    for (const q of questions) {
      // Verify answer length balance
      const lens = q.options.map(o => o.length);
      const correctLen = lens[q.correct_answer];
      const avgOther = lens.filter((_, i) => i !== q.correct_answer).reduce((a, b) => a + b, 0) / 3;
      const ratio = avgOther > 0 ? (correctLen / avgOther).toFixed(1) : 'N/A';

      if (!DRY_RUN) {
        const { error } = await supabase.from('quiz_questions').insert({
          chapter_id: chapterId,
          question_number: q.question_number,
          question_type: q.question_type,
          question_text: q.question_text,
          passage_excerpt: q.passage_excerpt,
          options: q.options,
          correct_answer: q.correct_answer,
          strategy_type: q.strategy_type,
          strategy_tip: q.strategy_tip,
          explanation: q.explanation,
          vocabulary_words: q.vocabulary_words
        });
        if (error) {
          console.error(`  ERROR Q${q.question_number}:`, error.message);
        } else {
          totalInserted++;
        }
      } else {
        console.log(`  Q${q.question_number} [${q.question_type}] ratio=${ratio}x lens=[${lens.join(',')}] correct=${q.correct_answer}`);
        totalInserted++;
      }
    }
  }

  console.log(`\nTotal: ${totalInserted} questions ${DRY_RUN ? 'would be' : ''} inserted.`);
  if (DRY_RUN) console.log('(Dry run — no changes made. Remove --dry-run to apply.)');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
