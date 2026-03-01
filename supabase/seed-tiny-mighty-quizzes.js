// ============================================================
// Seed chapters + quiz questions for Tiny and Mighty Book 1
// ============================================================
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const chapters = [
  {
    chapter_number: 1,
    title: 'Humans = Weird',
    summary: 'Tiny arrives at his new home and is carried everywhere by Snuggles. He meets the family — Snuggles, Snack Dropper, Mom, and Dad — and a giant bear-like dog named Mighty, who tells him he needs a collar and a purpose.',
    key_vocabulary: [
      { word: 'wobbled', definition: 'Moved unsteadily from side to side', pos: 'verb' },
      { word: 'inspection', definition: 'Looking at something very carefully to check it out', pos: 'noun' },
      { word: 'unnecessary', definition: 'Not needed — something you could do without', pos: 'adjective' },
      { word: 'collarless', definition: 'Without a collar — missing the strap that goes around a dog\'s neck', pos: 'adjective' },
      { word: 'purpose', definition: 'The special reason something or someone exists', pos: 'noun' }
    ],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'Why does Tiny call the little girl "Snuggles"?', vocabulary_words: [], options: ['She always gives the best snuggle hugs', 'That is her real name', 'Mighty told him to call her that', 'She whispered it in his ear'], correct_answer: 0, strategy_type: 'finding-details', strategy_tip: 'Go to page 5 — Tiny explains why he picked the name!', explanation: 'Tiny says he calls her Snuggles because she gives the best snuggle hugs.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'Why did Tiny name the brother "Snack Dropper"?', vocabulary_words: [], options: ['He always ate snacks in bed', 'He always dropped food on the floor', 'He shared his snacks with Tiny', 'He kept snacks in his pockets'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 7 — Tiny explains the nickname!', explanation: 'Tiny named him Snack Dropper because he always dropped food on the floor, which Tiny knew would come in handy later.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'How did Tiny get Snuggles to put him down?', vocabulary_words: [], options: ['He barked really loud', 'He started wiggling', 'He bit her finger', 'Mighty told her to put him down'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 8 — Tiny tries a little trick!', explanation: 'Tiny started wiggling — not a big wiggle, just a little one — and it worked. Snuggles finally put him down.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What did Mighty do when she first met Tiny?', vocabulary_words: ['inspection'], options: ['She ran away from him', 'She gave him a sniff inspection and flattened him with her paw', 'She barked at him and chased him', 'She brought him a toy'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 10 — Mighty introduces herself in a big way!', explanation: 'Mighty gave Tiny a sniff inspection, then lifted one giant paw and flattened him in a firm but friendly welcome.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'What did Mighty say Tiny needs to figure out?', vocabulary_words: ['purpose'], options: ['How to escape the house', 'What he is good at', 'How to get a bigger bed', 'What food he likes best'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 12 — Mighty asks Tiny a big question!', explanation: 'Mighty asked Tiny what he is good at and said everyone has a purpose around here, leaving Tiny confused and questioning everything.' }
    ]
  },
  {
    chapter_number: 2,
    title: 'Sweater Wearer',
    summary: 'Tiny claims his skill is wearing sweaters. Mighty laughs but says he is meant for something bigger. She shares her own purpose — protecting things from the wind and alerting humans about packages.',
    key_vocabulary: [
      { word: 'confident', definition: 'Feeling sure of yourself and believing you can do something', pos: 'adjective' },
      { word: 'chaos', definition: 'Total confusion and disorder — everything is crazy', pos: 'noun' },
      { word: 'alert', definition: 'To warn someone that something important is happening', pos: 'verb' },
      { word: 'mighty', definition: 'Very strong and powerful', pos: 'adjective' },
      { word: 'stride', definition: 'A long, confident step when walking', pos: 'noun' }
    ],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'What did Tiny say he was good at?', vocabulary_words: [], options: ['Running fast', 'Wearing sweaters', 'Guarding the door', 'Finding food'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 14 — Tiny shouts something funny!', explanation: 'Tiny shouted "I\'m good at sweaters!" even though he did not know why he said it.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What is Mighty\'s special job?', vocabulary_words: ['alert'], options: ['Guarding the food bowl', 'Protecting things from the wind and alerting about packages', 'Playing with the kids', 'Watching TV with Dad'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 16 — Mighty explains what she does!', explanation: 'Mighty says she is good at protecting things from the wind and alerting the humans every time a package arrives.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What did Mighty say the wind once did to Mom?', vocabulary_words: ['chaos'], options: ['Blew her hat off', 'Knocked her down', 'Messed up her hair', 'Broke an umbrella'], correct_answer: 0, strategy_type: 'finding-details', strategy_tip: 'Go to page 18 — Mighty tells a windy story!', explanation: 'Mighty said the wind once blew so hard it made Mom\'s hat fly off, and she barked loudly for her safety.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'Why did Tiny decide to call the big dog "Mighty"?', vocabulary_words: ['mighty'], options: ['That was the name on her collar', 'Mom called her that', 'Because she named him, so he named her back', 'Snuggles suggested the name'], correct_answer: 2, strategy_type: 'making-inferences', strategy_tip: 'Go to page 20 — Tiny picks a name for the big dog!', explanation: 'Since Mighty decided to name him Tiny, he decided to call her Mighty in return because her bark could be heard for miles.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'What did Mighty tell Tiny about his future?', vocabulary_words: [], options: ['He would always be small', 'He was meant to do something big', 'He should stick to wearing sweaters', 'He needed to learn to bark louder'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 15 — Mighty gives Tiny some encouragement!', explanation: 'Mighty told Tiny "you may be tiny, but I can tell you are meant to do something bigger than wearing sweaters."' }
    ]
  },
  {
    chapter_number: 3,
    title: 'Close to the Ground',
    summary: 'Tiny stays up all night thinking about Mighty\'s words. He decides to follow her around like a sidekick, but she works alone. She tells him to find his own thing — something close to the ground.',
    key_vocabulary: [
      { word: 'observer', definition: 'Someone who watches carefully without getting involved', pos: 'noun' },
      { word: 'patrolled', definition: 'Walked around an area to check that everything is safe', pos: 'verb' },
      { word: 'annoyed', definition: 'A little bit angry or bothered by something', pos: 'adjective' },
      { word: 'advantage', definition: 'Something that helps you do better than others', pos: 'noun' },
      { word: 'burrito', definition: 'Here it means being wrapped up tightly like a rolled-up tortilla', pos: 'noun' }
    ],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'What kept Tiny awake all night?', vocabulary_words: [], options: ['A loud noise outside', 'Thinking about what Mighty said about doing something big', 'He was hungry', 'Snuggles kept petting him'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 21 — Tiny can\'t stop thinking!', explanation: 'Tiny stayed up all night thinking about Mighty\'s words: "You may be tiny, but I can tell you are meant to do something big."' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What was Tiny\'s plan in the morning?', vocabulary_words: ['observer'], options: ['To escape the house', 'To follow Mighty around like a sidekick', 'To find his collar', 'To play with Snuggles'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 22 — Tiny comes up with a starting point!', explanation: 'Tiny\'s plan was to follow Mighty like a curious observer with sidekick potential.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'How did Mighty react when Tiny followed her?', vocabulary_words: ['annoyed'], options: ['She was happy to have company', 'She said she works alone', 'She ran away from him', 'She asked him to guard the door'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 23 — Mighty has a clear answer!', explanation: 'Mighty told Tiny "I don\'t need help. I work alone." She was slightly annoyed.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What advice did Mighty give Tiny about finding his thing?', vocabulary_words: ['advantage'], options: ['Look up high where the birds are', 'Use his small size — things close to the ground need protecting too', 'Ask Mom and Dad for help', 'Just keep wearing sweaters'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 24 — Mighty points out something about Tiny\'s size!', explanation: 'Mighty told Tiny that being small is his advantage — there are things close to the ground that need protecting too.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'What happened to Tiny at the end of the chapter?', vocabulary_words: ['burrito'], options: ['He found a bone under the couch', 'Snuggles wrapped him up in a blanket burrito and he fell asleep', 'He went outside for a walk', 'He got into a fight with Mighty'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 27 — Snuggles does something cozy!', explanation: 'Snuggles wrapped Tiny up in a blanket like a burrito and he got so cozy he fell asleep.' }
    ]
  },
  {
    chapter_number: 4,
    title: 'Sock Alert',
    summary: 'Tiny wakes up from a long nap, falls off the couch, escapes his sweater, and discovers a mysterious sock on the floor. He decides it needs protecting.',
    key_vocabulary: [
      { word: 'abandoned', definition: 'Left behind and forgotten about', pos: 'adjective' },
      { word: 'suspicious', definition: 'Looking like something is not quite right', pos: 'adjective' },
      { word: 'dodge', definition: 'To move quickly out of the way to avoid something', pos: 'verb' },
      { word: 'protector', definition: 'Someone who keeps something safe from danger', pos: 'noun' },
      { word: 'unraveled', definition: 'Came undone or unwound', pos: 'verb' }
    ],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'How did Tiny escape from the blanket burrito?', vocabulary_words: ['unraveled'], options: ['Snuggles unwrapped him', 'He wiggled, rolled, and fell off the couch', 'Mighty pulled it off', 'He chewed through it'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 31 — Tiny has a clumsy escape!', explanation: 'Tiny wiggled sideways, rolled once, and fell off the couch. The burrito unraveled midair.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What did Tiny find near the edge of the couch?', vocabulary_words: ['abandoned'], options: ['A bone', 'A toy mouse', 'A sock', 'A shoe'], correct_answer: 2, strategy_type: 'finding-details', strategy_tip: 'Go to page 31 — Tiny spots something suspicious on the floor!', explanation: 'Tiny found one soft, floppy sock lying alone, abandoned, and suspicious near the edge of the couch.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What funny thing happened with Tiny and a shoe?', vocabulary_words: [], options: ['He wore it as a hat', 'He accidentally peed on one', 'He hid inside one', 'He chewed one up'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 33 — Tiny remembers an embarrassing moment!', explanation: 'Tiny accidentally peed on a shoe once. The human kept saying "Not on my new shoes!" over and over.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What job did Tiny give himself after finding the sock?', vocabulary_words: ['protector'], options: ['Sock Rescuer', 'Floor Protector', 'Sweater Wearer', 'Wind Watcher'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 35 — Tiny announces his new title!', explanation: 'Tiny decided to become the Floor Protector, keeping the sock safe from danger.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'Why did Tiny think the sock needed protecting?', vocabulary_words: ['suspicious'], options: ['It was torn and broken', 'It was alone, unprotected, and on the floor without a shoe', 'Mighty told him to guard it', 'Snuggles asked him to watch it'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 35 — Tiny explains why this is important!', explanation: 'Tiny thought the sock needed protecting because it was lying alone on the floor without the shoe that normally protects it.' }
    ]
  },
  {
    chapter_number: 5,
    title: 'Sock in Danger',
    summary: 'Tiny brings the sock to Mighty to report his finding. Mighty is unimpressed but mentions that Dad has been complaining about missing socks. She tells him she knows where socks go to disappear.',
    key_vocabulary: [
      { word: 'exclaimed', definition: 'Said something loudly with strong feeling', pos: 'verb' },
      { word: 'reference', definition: 'Something you look at or mention for information', pos: 'noun' },
      { word: 'dedicated', definition: 'Giving a lot of time and effort to something important', pos: 'adjective' },
      { word: 'vanished', definition: 'Disappeared completely without a trace', pos: 'verb' },
      { word: 'reveal', definition: 'To show or tell something that was hidden or secret', pos: 'verb' }
    ],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'What did Mighty accuse Tiny of doing?', vocabulary_words: [], options: ['Chewing on furniture', 'Being on the couch and stealing socks', 'Barking too loud', 'Eating her food'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 39 — Mighty lists Tiny\'s rule-breaking!', explanation: 'Mighty said Tiny was breaking rules by being on the couch and stealing socks.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What funny question did Tiny ask Mighty about pooping?', vocabulary_words: ['reference'], options: ['Whether dogs can use the toilet', 'Whether he is supposed to poop on the rug', 'Where the backyard is', 'If Mighty ever had an accident'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 39 — Tiny says something hilarious!', explanation: 'When Mighty joked about pooping on the rug, Tiny asked "Oh… am I not supposed to poop there?" — just for future reference.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What had Dad been complaining about?', vocabulary_words: ['vanished'], options: ['The house being messy', 'His favorite socks going missing', 'The dog hair everywhere', 'Not having enough towels'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 44 — Mighty shares what Dad said!', explanation: 'Dad had been complaining about one of his favorite socks going missing, saying "Where do they go? I just bought these!"' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What secret did Mighty share with Tiny?', vocabulary_words: ['reveal'], options: ['She knew where socks go to disappear', 'She had been hiding treats', 'She could open doors by herself', 'She had a secret friend outside'], correct_answer: 0, strategy_type: 'finding-details', strategy_tip: 'Go to page 45 — Mighty reveals something mysterious!', explanation: 'Mighty lowered her voice and said she knew of a place where socks go to disappear, then told Tiny to follow her.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'Why did Tiny think guarding the sock was so important?', vocabulary_words: ['dedicated'], options: ['Mighty told him it was his job', 'He wanted treats as a reward', 'It belonged to Snuggles and was alone and unprotected', 'Dad asked him to guard it'], correct_answer: 2, strategy_type: 'making-inferences', strategy_tip: 'Go to page 41 — Tiny explains whose sock it is!', explanation: 'Tiny was dedicated because it was Snuggles\'s sock and it was alone and unprotected on the floor.' }
    ]
  },
  {
    chapter_number: 6,
    title: 'Metal Beasts',
    summary: 'Mighty leads Tiny to the laundry room where he sees the washer and dryer for the first time. She calls them "metal beasts" that eat socks. Tiny is terrified but determined to protect his sock.',
    key_vocabulary: [
      { word: 'checkered', definition: 'A pattern made of squares in two different colors', pos: 'adjective' },
      { word: 'laundry', definition: 'Clothes and other things that need to be washed', pos: 'noun' },
      { word: 'devoured', definition: 'Eaten up quickly and completely', pos: 'verb' },
      { word: 'mysterious', definition: 'Strange and hard to explain or understand', pos: 'adjective' },
      { word: 'protectively', definition: 'In a way that keeps something safe from harm', pos: 'adverb' }
    ],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'What did the hallway smell like on the way to the laundry room?', vocabulary_words: [], options: ['Cookies and milk', 'Lemons and mystery', 'Flowers and grass', 'Soap and dog food'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 46 — Tiny describes the smells!', explanation: 'The air smelled like lemons and mystery as they walked toward the laundry room.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What does Mighty call the washer and dryer?', vocabulary_words: [], options: ['Sock eaters', 'Metal beasts', 'Scary monsters', 'Loud machines'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 47 — Mighty gives them a dramatic name!', explanation: 'Mighty calls the washer and dryer "metal beasts" because they spin, growl, slosh, and beep.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What do the metal beasts do according to Mighty?', vocabulary_words: ['devoured'], options: ['They make food for the family', 'They spin, growl, slosh, and beep', 'They only run at night', 'They are friendly and quiet'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 47 — Mighty describes how scary they are!', explanation: 'Mighty says the metal beasts spin, growl, one of them sloshes, and the most annoying part — they beep.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'How did Tiny react after seeing the metal beasts?', vocabulary_words: ['protectively'], options: ['He wanted to play with them', 'He curled protectively around his sock', 'He ran out of the room screaming', 'He fell asleep from boredom'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 42 — Tiny makes a brave choice!', explanation: 'After hearing about the danger, Tiny curled himself protectively around the sock, determined to keep it safe.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'Why was it important to Tiny that socks disappear in the laundry room?', vocabulary_words: [], options: ['He wanted to do the laundry himself', 'It proved the sock really was in danger and needed protecting', 'He wanted to tell Mom about it', 'He thought he could sell the information'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to pages 44-45 — Tiny connects the dots!', explanation: 'Learning that Dad\'s socks go missing and that Mighty knows where they disappear confirmed to Tiny that his sock truly was in danger.' }
    ]
  },
  {
    chapter_number: 7,
    title: 'Sock Twins',
    summary: 'Tiny realizes that socks come in pairs — twins! His sock\'s twin is missing. He searches the whole house but only finds a leaf and some grass. He discovers the original sock might have a matching partner somewhere.',
    key_vocabulary: [
      { word: 'utterly', definition: 'Completely and totally — all the way', pos: 'adverb' },
      { word: 'sprinted', definition: 'Ran as fast as possible', pos: 'verb' },
      { word: 'scanning', definition: 'Looking carefully over an area to find something', pos: 'verb' },
      { word: 'survivor', definition: 'Someone or something that made it through a tough situation', pos: 'noun' },
      { word: 'twin', definition: 'One of two things that match and go together', pos: 'noun' }
    ],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'What big realization did Tiny have about socks?', vocabulary_words: ['twin'], options: ['Socks are made of cotton', 'Humans wear socks in pairs — they are twins', 'Socks can be used as toys', 'Socks belong in the kitchen'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 52 — Tiny figures something out!', explanation: 'Tiny remembered that humans wear TWO socks on their paws — socks come in pairs, like twins!' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What color was the sock Mom was holding?', vocabulary_words: [], options: ['White', 'Red', 'Bright blue', 'Green'], correct_answer: 2, strategy_type: 'finding-details', strategy_tip: 'Go to page 51 — Mom walks by with a sock!', explanation: 'Mom came down the hallway holding up a bright blue sock, looking for the other one.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What did Tiny find when he searched the house for the matching sock?', vocabulary_words: ['scanning'], options: ['Another sock under the bed', 'Only a leaf and a little piece of grass', 'A bone and a toy', 'Nothing at all'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 53 — Tiny searches everywhere!', explanation: 'Tiny sprinted through the house scanning every inch of carpet but only found a leaf and a little piece of grass — no matching sock.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'Where had Tiny hidden the original sock?', vocabulary_words: [], options: ['Under his bed', 'In the closet behind the hanging shirts', 'Under the couch', 'In the laundry room'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 53 — Tiny has a secret hiding spot!', explanation: 'Tiny had hidden the sock in the closet, squeezed behind the hanging shirts.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'How did Mighty react when Tiny asked for help finding the sock\'s twin?', vocabulary_words: [], options: ['She refused to help', 'She said she had seen it before and knew where it might be', 'She laughed and walked away', 'She told him to give up'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 55 — Mighty shares important information!', explanation: 'Mighty told Tiny that humans have two paws they cover, meaning there\'s definitely a matching sock out there somewhere.' }
    ]
  },
  {
    chapter_number: 8,
    title: 'Collar',
    summary: 'Snuggles gives Tiny a collar — but it\'s a cat collar with a jingly bell. Tiny is embarrassed but still has a mission. Mighty creates a distraction so Tiny can search for the sock\'s twin.',
    key_vocabulary: [
      { word: 'offensive', definition: 'Something that hurts your feelings or makes you upset', pos: 'adjective' },
      { word: 'mission', definition: 'An important job or task you need to complete', pos: 'noun' },
      { word: 'distraction', definition: 'Something that takes attention away from what is happening', pos: 'noun' },
      { word: 'chaos', definition: 'Total confusion and disorder — everything is crazy', pos: 'noun' },
      { word: 'impossible', definition: 'Something that cannot be done', pos: 'adjective' }
    ],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'Why did Snuggles have to get Tiny a cat collar?', vocabulary_words: [], options: ['They were out of dog collars', 'His neck was so tiny a dog collar would not fit', 'He liked cats better', 'It was on sale'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 58 — Snuggles explains why!', explanation: 'They had to get a cat collar because Tiny\'s neck was so tiny that a regular dog collar would not fit.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What sound did the collar make?', vocabulary_words: [], options: ['A buzzing sound', 'A jingling sound', 'A clicking sound', 'No sound at all'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 58 — Listen for the sound!', explanation: 'The collar had a bell on it that made a jingling sound with every step — jingle, jingle.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'Why was the jingly collar a problem for Tiny\'s mission?', vocabulary_words: ['mission', 'impossible'], options: ['It was too heavy', 'It made sneaking around nearly impossible', 'It scared the other pets', 'It fell off constantly'], correct_answer: 1, strategy_type: 'cause-and-effect', strategy_tip: 'Go to page 59 — Tiny realizes a big problem!', explanation: 'The jingling bell meant Tiny could not sneak anywhere quietly, making his sock-finding mission nearly impossible.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What did Mighty do to create a distraction?', vocabulary_words: ['distraction', 'chaos'], options: ['She barked at the mailman', 'She knocked over her water bowl, splashing water everywhere', 'She chased her tail', 'She hid under the bed'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 60 — Mighty makes a big splash!', explanation: 'Mighty marched into the kitchen, walked up to her water bowl, and — WHACK — splashed water everywhere to create a distraction.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'What does this chapter tell you about Mighty\'s feelings toward Tiny?', vocabulary_words: [], options: ['She does not care about him at all', 'She secretly wants to help him even though she acts tough', 'She is jealous of his collar', 'She wants him to leave the house'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 60 — Look at what Mighty actually DOES, not just what she says!', explanation: 'Even though Mighty acts tough and says she works alone, she agrees to help Tiny by creating a distraction, showing she cares.' }
    ]
  },
  {
    chapter_number: 9,
    title: 'Epic Failure',
    summary: 'Tiny sneaks into the laundry room to search for the sock\'s twin but gets caught by Snuggles. She carries him to her room where he spots more socks on the floor. He finds a possible match but Snuggles puts the sock on him like a sweater.',
    key_vocabulary: [
      { word: 'epic', definition: 'Huge, amazing, or really really big — often used for dramatic effect', pos: 'adjective' },
      { word: 'scattered', definition: 'Spread out all over the place in a messy way', pos: 'adjective' },
      { word: 'squeeze', definition: 'To push yourself through a tight space', pos: 'verb' },
      { word: 'crept', definition: 'Moved slowly and quietly so no one would notice', pos: 'verb' },
      { word: 'resist', definition: 'To stop yourself from doing something tempting', pos: 'verb' }
    ],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'Where was Tiny searching when Snuggles found him?', vocabulary_words: [], options: ['In the backyard', 'In the laundry room buried in socks', 'Under Mom and Dad\'s bed', 'In the kitchen'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 65 — Tiny is deep in his search!', explanation: 'Tiny was buried in socks in the laundry room, still sniffing, searching, and slightly jingling when Snuggles found him.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What did Snuggles say when she found Tiny in the laundry?', vocabulary_words: [], options: ['"Good boy, Tiny!"', '"You are not supposed to be in here!"', '"Did you find my sock?"', '"Let me help you look!"'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 66 — Snuggles is surprised!', explanation: 'Snuggles scooped Tiny up and said "You are not supposed to be in here!"' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What did Tiny see scattered on the floor of Snuggles\'s room?', vocabulary_words: ['scattered'], options: ['Toys and books', 'More socks', 'Shoes and hats', 'Crayons and paper'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 67 — Tiny spots something exciting!', explanation: 'Tiny saw more socks scattered across the floor of Snuggles\'s room — abandoned and forgotten like fuzzy clues.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What distracted Tiny while he was searching Snuggles\'s room?', vocabulary_words: ['resist'], options: ['A bowl of food', 'A squeaky rope toy', 'A cat running by', 'Mighty barking'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 68 — Tiny has to stay focused!', explanation: 'Snuggles pulled out a rope toy with a thousand chewable possibilities. It squeaked when she dropped it and Tiny had to fight to stay focused.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'What was the "epic failure" in this chapter?', vocabulary_words: ['epic'], options: ['Tiny broke something valuable', 'Tiny got caught and his sock search mission failed', 'Mighty\'s distraction did not work', 'The metal beasts ate all the socks'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 67 — Tiny summarizes what happened!', explanation: 'The epic failure was that Tiny got caught by Snuggles in the laundry room and carried out before he could find the sock\'s twin.' }
    ]
  },
  {
    chapter_number: 10,
    title: 'Missing',
    summary: 'Tiny is confused about why Snuggles stopped him from finding the sock\'s twin. He realizes Snuggles doesn\'t understand the danger of the metal beasts. He decides the adults know about disappearing socks but Snuggles is too young to understand.',
    key_vocabulary: [
      { word: 'logical', definition: 'Making sense and following a clear reason', pos: 'adjective' },
      { word: 'conclusion', definition: 'A decision or answer you reach after thinking about something', pos: 'noun' },
      { word: 'precious', definition: 'Very valuable and important — worth protecting', pos: 'adjective' },
      { word: 'machinery', definition: 'Machines or equipment — here meaning the washer and dryer', pos: 'noun' },
      { word: 'reappearing', definition: 'Showing up again after being gone', pos: 'verb' }
    ],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'Why was Tiny confused after leaving Snuggles\'s room?', vocabulary_words: [], options: ['He forgot where his sock was', 'He did not understand why Snuggles stopped him from getting the matching sock', 'He could not find Mighty', 'He was lost in the house'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 73 — Tiny is very confused!', explanation: 'Tiny was confused because Snuggles placed him right next to the sock\'s twin but then said "No!" when he tried to take it.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What did Snuggles put on Tiny that confused him even more?', vocabulary_words: [], options: ['A hat', 'A sock, like a sweater', 'Another collar', 'Sunglasses'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 74 — Snuggles does something silly!', explanation: 'Snuggles decided to decorate Tiny by putting a sock on him like a sweater, which made no sense to Tiny.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What did Tiny figure out about the adults and missing socks?', vocabulary_words: ['logical', 'conclusion'], options: ['The adults did not know socks go missing', 'The adults knew socks disappear but acted like it was normal', 'The adults were hiding the socks on purpose', 'The adults blamed Tiny for taking them'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 74 — Tiny thinks about what Dad said!', explanation: 'Tiny realized the adults knew socks go missing — Dad talked about it like it was normal — but they did not seem worried about it.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'Why did Tiny think Snuggles rescued him from the laundry room?', vocabulary_words: ['precious'], options: ['She wanted to play with him', 'She thought he was too precious to be eaten by the machines', 'She needed him to guard her room', 'She was cleaning the laundry room'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 76 — Tiny connects being rescued to being precious!', explanation: 'Snuggles rescued Tiny and called him cute, so Tiny figured she understood some things are too precious to be eaten by machinery — she just didn\'t realize socks were important too.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'Why did Tiny think Snuggles did not understand the sock danger?', vocabulary_words: ['reappearing'], options: ['She was too busy with her toys', 'She was too young and had never done laundry — socks just kept reappearing to her', 'She did not like socks', 'She only wore shoes, never socks'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 76 — Tiny figures out why Snuggles is different from the adults!', explanation: 'Tiny realized Snuggles was young, had never done laundry, and lived in a world where socks just kept reappearing magically.' }
    ]
  },
  {
    chapter_number: 11,
    title: 'Sock Names',
    summary: 'Tiny sneaks back into Snuggles\'s room while everyone is busy, retrieves the matching sock, and brings it to Dad\'s closet. He discovers the socks have names — "Monday" and "Tuesday" — written on them.',
    key_vocabulary: [
      { word: 'crept', definition: 'Moved slowly and quietly to avoid being noticed', pos: 'verb' },
      { word: 'safekeeping', definition: 'Keeping something in a safe place to protect it', pos: 'noun' },
      { word: 'jingling', definition: 'Making a light ringing sound, like a bell', pos: 'verb' },
      { word: 'examined', definition: 'Looked at something very carefully', pos: 'verb' },
      { word: 'shock', definition: 'A sudden feeling of surprise', pos: 'noun' }
    ],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'When did Tiny sneak into Snuggles\'s room?', vocabulary_words: [], options: ['While everyone was eating dinner', 'While Snuggles was brushing her teeth and Mighty was barking at the wind', 'In the middle of the night', 'When no one was home'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 78 — The timing is perfect!', explanation: 'Tiny snuck in while Snuggles was brushing her teeth, Mighty was barking at the wind, and Mom was folding towels.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'Where did Tiny bring the sock for safekeeping?', vocabulary_words: ['safekeeping'], options: ['Under the couch', 'To Dad\'s closet', 'To Mighty\'s bed', 'To the backyard'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 79 — Tiny has a hiding spot!', explanation: 'Tiny brought the sock to Dad\'s closet where he had hidden the other sock for safekeeping.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What name was written on the sock Tiny just found?', vocabulary_words: [], options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 81 — Tiny sees something written in purple letters!', explanation: 'The word "MONDAY" was written in small purple letters across the top of the foot of the sock.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What name was on the original sock Tiny had rescued earlier?', vocabulary_words: [], options: ['Monday', 'Tuesday', 'Wednesday', 'Friday'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 81 — Tiny checks the first sock too!', explanation: 'The original sock had "TUESDAY" written on it — meaning the two socks had different day names.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'What did Tiny realize about the socks having names?', vocabulary_words: ['shock'], options: ['They were just regular labels', 'These socks were part of something bigger — a whole week of socks', 'The names did not mean anything', 'Someone wrote on them by accident'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Go to page 81 — Tiny is shocked by what he finds!', explanation: 'Tiny realized that if there were Monday and Tuesday socks, there must be a whole week of socks — this was bigger than he thought!' }
    ]
  },
  {
    chapter_number: 12,
    title: 'Wrong Sock',
    summary: 'Tiny examines both socks carefully but cannot figure out more clues. Dad finds Tiny in the closet with the socks, recognizes Monday and Tuesday, and carries everything — including Tiny — straight to the laundry room.',
    key_vocabulary: [
      { word: 'examined', definition: 'Looked at something very carefully to learn more about it', pos: 'verb' },
      { word: 'evidence', definition: 'Clues or proof that help you figure something out', pos: 'noun' },
      { word: 'detective', definition: 'Someone who investigates and solves mysteries', pos: 'noun' },
      { word: 'humming', definition: 'Singing a tune without opening your mouth', pos: 'verb' },
      { word: 'unraveling', definition: 'Coming apart or being figured out piece by piece', pos: 'verb' }
    ],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'What did Tiny do with the two socks in the closet?', vocabulary_words: ['examined', 'evidence'], options: ['He played with them like toys', 'He laid them flat and examined them like evidence in a crime scene', 'He hid them deeper in the closet', 'He tried to wash them himself'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 83 — Tiny goes full detective mode!', explanation: 'Tiny laid both socks out flat and examined their thread count, heel smudges, and overall sock vibes like a detective.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What sock did Tiny think he needed to find next?', vocabulary_words: [], options: ['Sunday', 'Monday', 'Wednesday', 'Saturday'], correct_answer: 2, strategy_type: 'finding-details', strategy_tip: 'Go to page 84 — Tiny has a plan!', explanation: 'Tiny thought if he could just find Wednesday, he could solve the whole sock mystery.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'Who found Tiny in the closet?', vocabulary_words: [], options: ['Snuggles', 'Mom', 'Dad', 'Snack Dropper'], correct_answer: 2, strategy_type: 'finding-details', strategy_tip: 'Go to page 84 — Footsteps are getting closer!', explanation: 'Dad stepped into the closet holding a laundry basket and found Tiny with the two socks.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'How did Dad react when he saw Monday and Tuesday?', vocabulary_words: [], options: ['He was angry at Tiny', 'He was happy and said "Finally!" then scooped them up', 'He ignored them', 'He threw them away'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 86 — Dad recognizes the socks!', explanation: 'Dad said "Hey! There\'s Monday! And Tuesday. Finally!" and scooped them both up along with Tiny.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'Where did Dad take the socks and Tiny?', vocabulary_words: [], options: ['To the kitchen', 'To the backyard', 'Straight to the laundry room', 'To Snuggles\'s room'], correct_answer: 2, strategy_type: 'finding-details', strategy_tip: 'Go to page 86 — Tiny\'s worst fear comes true!', explanation: 'Dad walked straight into the laundry room with both socks and Tiny, heading right toward the metal beasts.' }
    ]
  },
  {
    chapter_number: 13,
    title: 'Failure?',
    summary: 'Tiny watches Dad put the socks into the washing machine and feels like a total failure. Mighty comforts him. Together they go watch the wind, but then Mighty admits she never stayed to see what happens after the beasts beep. They rush back and discover the socks come out clean and fluffy!',
    key_vocabulary: [
      { word: 'defeat', definition: 'Losing or failing at something you tried hard to do', pos: 'noun' },
      { word: 'defeated', definition: 'Feeling like you have lost and there is no hope', pos: 'adjective' },
      { word: 'hesitation', definition: 'A pause before doing something because you are unsure', pos: 'noun' },
      { word: 'casually', definition: 'In a relaxed way, like it is no big deal', pos: 'adverb' },
      { word: 'glow-up', definition: 'A big improvement in how something looks', pos: 'noun' }
    ],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'How did Tiny feel after Dad put the socks in the washing machine?', vocabulary_words: ['defeated'], options: ['Excited and happy', 'Like a total failure who let the socks down', 'Angry at Dad', 'Bored and tired'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 89 — Tiny is really sad!', explanation: 'Tiny felt like a complete failure. He curled up beside the washer and let out the quietest, most defeated sigh in sock-guarding history.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What did Mighty offer Tiny to cheer him up?', vocabulary_words: [], options: ['A treat from the kitchen', 'A chance to be her wind sidekick', 'A new sock to guard', 'A ride on her back'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 90 — Mighty is kind!', explanation: 'Mighty gently offered to let Tiny watch the wind with her and be her wind sidekick.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What surprising thing did Mighty admit?', vocabulary_words: ['hesitation'], options: ['She was scared of the dark', 'She had never stayed to see what happens after the metal beasts beep', 'She did not actually like watching the wind', 'She had been hiding socks herself'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 92 — Mighty makes a big confession!', explanation: 'Mighty admitted she always left when the machines beeped and had never seen what actually happens to the socks after.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What did they discover when Mom opened the dryer?', vocabulary_words: ['glow-up'], options: ['The socks were destroyed', 'The socks were gone forever', 'The socks came out fluffy, clean, and matched with their partners', 'The machine was empty'], correct_answer: 2, strategy_type: 'finding-details', strategy_tip: 'Go to page 93 — They see something amazing!', explanation: 'Mom pulled out towels and socks — Monday, Tuesday, and others — all fluffy and clean! She folded each sock and matched it to its partner.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'What did Tiny mean when he said the socks got a "glow-up"?', vocabulary_words: ['glow-up'], options: ['They were glowing in the dark', 'They looked even better than before after being washed', 'They changed colors', 'They got bigger'], correct_answer: 1, strategy_type: 'vocabulary-in-context', strategy_tip: 'Go to page 94 — Tiny describes what happened to the socks!', explanation: 'A "glow-up" means a big improvement in how something looks. The socks came out cleaner and better than ever — they were not destroyed, they were improved!' }
    ]
  },
  {
    chapter_number: 14,
    title: 'What Now?',
    summary: 'Tiny accepts that socks do not need rescuing. Mighty tells him he is important and that he still has time to find his purpose. Mighty calls him a "Noticer." Tiny ends the story still wearing his sock sweater, still searching for his purpose, but happy.',
    key_vocabulary: [
      { word: 'tragic', definition: 'Very sad and unfortunate', pos: 'adjective' },
      { word: 'apparently', definition: 'Based on what seems to be true or what people say', pos: 'adverb' },
      { word: 'brainstorming', definition: 'Thinking of lots of ideas to solve a problem', pos: 'verb' },
      { word: 'noticer', definition: 'Someone who pays attention and sees things others miss', pos: 'noun' },
      { word: 'purpose', definition: 'The reason someone or something exists — your special job in life', pos: 'noun' }
    ],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'What did Tiny learn about the socks in this chapter?', vocabulary_words: [], options: ['They needed to be rescued from the cat', 'They were never really in danger — being washed is actually good', 'They were being thrown away', 'They belonged to the neighbor'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 96 — Tiny finally understands!', explanation: 'Tiny realized socks didn\'t need saving or protecting. They were never really in danger — being washed is apparently a good thing to humans.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What did Mighty say when Tiny felt unimportant?', vocabulary_words: [], options: ['"You should try harder"', '"I think you\'re important"', '"Maybe socks are not for you"', '"You need a new collar"'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 96 — Mighty says something kind!', explanation: 'When Tiny said it felt weird going from super important to not important, Mighty smiled and said "Well, I think you\'re important."' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What did Mighty say Tiny actually helped with?', vocabulary_words: [], options: ['Protecting the house from wind', 'Getting Monday and Tuesday out of Snuggles\'s room so they made laundry day', 'Teaching Snuggles about socks', 'Keeping the floor clean'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Go to page 98 — Mighty gives Tiny credit!', explanation: 'Mighty said Tiny got Monday and Tuesday out of Snuggles\'s room — they probably would have missed laundry day if he hadn\'t dragged them out.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What name did Mighty give Tiny instead of "Sock Rescuer"?', vocabulary_words: ['noticer'], options: ['Floor Protector', 'Sweater Wearer', 'Wind Watcher', 'A Noticer'], correct_answer: 3, strategy_type: 'finding-details', strategy_tip: 'Go to page 99 — Mighty picks the perfect word!', explanation: 'Mighty said Tiny was not a Sock Rescuer but more of a Noticer — someone who pays attention and notices things others miss.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'What is the main message of this book?', vocabulary_words: ['purpose'], options: ['Socks are very dangerous', 'Big dogs are always right', 'It is okay to not have your purpose figured out yet — you still have time', 'Sweaters are the most important thing'], correct_answer: 2, strategy_type: 'best-answer', strategy_tip: 'Think about the whole story — what does Tiny learn by the end?', explanation: 'The main message is that it\'s okay to not have everything figured out yet. Tiny hasn\'t found his purpose, but he still has time, still has questions, and still has his jingly collar.' }
    ]
  }
];

async function seed() {
  console.log('🐾 Seeding Tiny and Mighty Book 1 quizzes...\n');

  // Find the book
  const { data: book, error: bookErr } = await supabase
    .from('books')
    .select('id, title')
    .ilike('title', '%Tiny and Mighty%')
    .single();

  if (bookErr || !book) {
    console.error('❌ Could not find Tiny and Mighty book:', bookErr?.message);
    process.exit(1);
  }
  console.log(`📖 Found: "${book.title}" (id: ${book.id})\n`);

  for (const ch of chapters) {
    // Upsert chapter
    const { data: chapter, error: chErr } = await supabase
      .from('chapters')
      .upsert({
        book_id: book.id,
        chapter_number: ch.chapter_number,
        title: ch.title,
        summary: ch.summary,
        key_vocabulary: ch.key_vocabulary
      }, { onConflict: 'book_id,chapter_number' })
      .select()
      .single();

    if (chErr) {
      console.error(`❌ Chapter ${ch.chapter_number} error:`, chErr.message);
      continue;
    }
    console.log(`  ✅ Chapter ${ch.chapter_number}: ${ch.title} (id: ${chapter.id})`);

    // Insert quiz questions
    for (const q of ch.questions) {
      const { error: qErr } = await supabase
        .from('quiz_questions')
        .upsert({
          chapter_id: chapter.id,
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
        }, { onConflict: 'chapter_id,question_number' });

      if (qErr) {
        console.error(`    ❌ Q${q.question_number} error:`, qErr.message);
      }
    }
    console.log(`    📝 ${ch.questions.length} questions loaded`);
  }

  console.log('\n🎉 Done! Tiny and Mighty Book 1 is fully loaded with quizzes.');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
