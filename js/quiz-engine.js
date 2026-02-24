// ─── QUIZ ENGINE ───
// Interactive quiz player with reading strategies, hover definitions, and score tracking

const QuizEngine = (function() {
  // State
  let currentQuiz = null;       // { chapter, questions, book }
  let currentQuestion = 0;      // index
  let currentStudent = null;
  let answers = [];              // student's selected answers
  let feedback = [];             // feedback for each question
  let quizStartTime = 0;
  let questionStartTime = 0;
  let answered = false;
  let showingStrategy = false;
  let quizResults = null;        // final results after submission
  let definitionCache = {};      // word -> definition
  let onComplete = null;         // callback when quiz finishes
  let _nextChapter = null;       // { bookId, chapterNum, studentId } if a next chapter exists
  let hintShown = [];            // per-question: true if hint was shown (auto or manual)
  let attempts = [];             // per-question: number of attempts made
  let wrongPicks = [];           // per-question: Set of wrong answer indices
  let showRetryModal = false;    // true when wrong-answer overlay is visible
  let showRevealModal = false;   // true when correct answer is revealed after 2 wrong attempts

  const STRATEGY_ICONS = {
    'finding-details': '🔍',
    'making-inferences': '🧩',
    'context-clues': '📖',
    'identifying-theme': '💡',
    'personal-connection': '💭',
    'cause-and-effect': '⚡',
    'character-analysis': '🎭',
    'best-answer-reasoning': '🏆'
  };

  const STRATEGY_NAMES = {
    'finding-details': 'Detail Detective',
    'making-inferences': 'Reading Between the Lines',
    'context-clues': 'Word Detective',
    'identifying-theme': 'Big Idea Finder',
    'personal-connection': 'Connect to You',
    'cause-and-effect': 'Cause & Effect',
    'character-analysis': 'Character Explorer',
    'best-answer-reasoning': 'Best Answer Finder'
  };

  const QUESTION_TYPE_LABELS = {
    'recall': 'Recall',
    'inference': 'Inference',
    'vocabulary': 'Vocabulary',
    'theme': 'Theme & Analysis',
    'personal': 'Personal Connection',
    'literal': 'Comprehension',
    'cause-effect': 'Cause & Effect',
    'best-answer': 'Best Answer'
  };

  // ─── Contextual Vocabulary Dictionary ───
  // Words that may increase cognitive load for young readers (Ages 6-10), with friendly definitions
  const CONTEXTUAL_VOCAB = {
    // Abstract concepts
    'special': { word: 'special', definition: 'Not like everything else — really important or different', pos: 'adjective' },
    'compared': { word: 'compared', definition: 'Looking at two things to see how they are the same or different', pos: 'verb' },
    'similar': { word: 'similar', definition: 'Almost the same but not exactly — like twins who look alike', pos: 'adjective' },
    'different': { word: 'different', definition: 'Not the same — when two things are NOT alike', pos: 'adjective' },
    'instead': { word: 'instead', definition: 'Picking one thing in place of another thing', pos: 'adverb' },
    'probably': { word: 'probably', definition: 'Most likely going to happen — almost for sure', pos: 'adverb' },
    'perhaps': { word: 'perhaps', definition: 'Maybe — it could happen or it might not', pos: 'adverb' },
    'certain': { word: 'certain', definition: 'Totally sure about something — you KNOW it is true', pos: 'adjective' },
    'imagine': { word: 'imagine', definition: 'Making a picture in your head of something that is not really there', pos: 'verb' },
    'pretend': { word: 'pretend', definition: 'Acting like something is real even when it is not — like playing make-believe', pos: 'verb' },
    'exactly': { word: 'exactly', definition: 'Perfectly right — not even a tiny bit off', pos: 'adverb' },
    'actually': { word: 'actually', definition: 'What REALLY happened — the truth', pos: 'adverb' },
    'especially': { word: 'especially', definition: 'More than anything else — extra important', pos: 'adverb' },
    'ordinary': { word: 'ordinary', definition: 'Normal and regular — nothing fancy or special', pos: 'adjective' },
    'unusual': { word: 'unusual', definition: 'Not normal — something you do not see every day', pos: 'adjective' },
    'typical': { word: 'typical', definition: 'The way things usually are — normal and expected', pos: 'adjective' },
    'definitely': { word: 'definitely', definition: 'For sure — no question about it', pos: 'adverb' },
    'rarely': { word: 'rarely', definition: 'Almost never — it hardly ever happens', pos: 'adverb' },
    'immediately': { word: 'immediately', definition: 'Right now — not waiting even one second', pos: 'adverb' },
    'obviously': { word: 'obviously', definition: 'Easy to see or understand — super clear', pos: 'adverb' },
    // Sequence & cause words
    'because': { word: 'because', definition: 'The reason WHY something happened', pos: 'conjunction' },
    'although': { word: 'although', definition: 'Even though — saying something is true BUT something else is also true', pos: 'conjunction' },
    'however': { word: 'however', definition: 'But — something different or opposite is also true', pos: 'adverb' },
    'therefore': { word: 'therefore', definition: 'So — this is what happened next because of that', pos: 'adverb' },
    'meanwhile': { word: 'meanwhile', definition: 'At the same time — while one thing is happening, something else is too', pos: 'adverb' },
    'eventually': { word: 'eventually', definition: 'After a long time — it finally happened', pos: 'adverb' },
    'suddenly': { word: 'suddenly', definition: 'It happened really fast with no warning — out of nowhere!', pos: 'adverb' },
    'recently': { word: 'recently', definition: 'Not long ago — it happened just a little while back', pos: 'adverb' },
    'afterward': { word: 'afterward', definition: 'After that — what came next', pos: 'adverb' },
    'finally': { word: 'finally', definition: 'At last! After waiting a long time, it happened', pos: 'adverb' },
    // Emotional & social
    'nervous': { word: 'nervous', definition: 'Feeling worried and a little scared — like butterflies in your tummy', pos: 'adjective' },
    'worried': { word: 'worried', definition: 'Thinking that something bad might happen', pos: 'adjective' },
    'frustrated': { word: 'frustrated', definition: 'Feeling upset because something is not working the way you want', pos: 'adjective' },
    'embarrassed': { word: 'embarrassed', definition: 'Feeling shy or awkward because something silly happened to you', pos: 'adjective' },
    'confident': { word: 'confident', definition: 'Believing in yourself — feeling like you CAN do it!', pos: 'adjective' },
    'curious': { word: 'curious', definition: 'Really wanting to know more about something — asking lots of questions', pos: 'adjective' },
    'suspicious': { word: 'suspicious', definition: 'Feeling like something sneaky or weird is going on', pos: 'adjective' },
    'convinced': { word: 'convinced', definition: 'Totally believing something is true — your mind is made up', pos: 'adjective' },
    'disappointed': { word: 'disappointed', definition: 'Feeling sad because something did not turn out the way you hoped', pos: 'adjective' },
    'proud': { word: 'proud', definition: 'Feeling really happy about something good you did', pos: 'adjective' },
    'determined': { word: 'determined', definition: 'Not giving up no matter what — you are going to do it!', pos: 'adjective' },
    'impressed': { word: 'impressed', definition: 'Thinking something is really cool or amazing', pos: 'adjective' },
    // Academic & reading words
    'describe': { word: 'describe', definition: 'Telling someone what something looks like or is about using words', pos: 'verb' },
    'explain': { word: 'explain', definition: 'Telling someone how or why something works so they understand', pos: 'verb' },
    'predict': { word: 'predict', definition: 'Guessing what will happen next by using clues', pos: 'verb' },
    'decide': { word: 'decide', definition: 'Making up your mind — choosing what to do', pos: 'verb' },
    'realize': { word: 'realize', definition: 'When you suddenly understand something — an aha! moment', pos: 'verb' },
    'discover': { word: 'discover', definition: 'Finding something new that you did not know before', pos: 'verb' },
    'notice': { word: 'notice', definition: 'Seeing something or paying attention to it', pos: 'verb' },
    'protect': { word: 'protect', definition: 'Keeping something safe so nothing bad happens to it', pos: 'verb' },
    'explore': { word: 'explore', definition: 'Looking around a new place to find out what is there', pos: 'verb' },
    'recognize': { word: 'recognize', definition: 'Knowing what something is because you have seen it before', pos: 'verb' },
    'according': { word: 'according', definition: 'Based on what someone said or wrote', pos: 'preposition' },
    'struggle': { word: 'struggle', definition: 'Having a really hard time doing something', pos: 'verb' },
    'encourage': { word: 'encourage', definition: 'Cheering someone on and telling them they can do it!', pos: 'verb' },
    'mention': { word: 'mention', definition: 'Saying something quickly without going into a lot of detail', pos: 'verb' },
    'approach': { word: 'approach', definition: 'Getting closer to something, or a way of doing something', pos: 'verb' },
    'survive': { word: 'survive', definition: 'Staying alive through something hard or dangerous', pos: 'verb' },
    // Words common in quiz answer options
    'identity': { word: 'identity', definition: 'Who you really are — your name and everything about you', pos: 'noun' },
    'obsessed': { word: 'obsessed', definition: 'Thinking about something SO much you cannot stop', pos: 'adjective' },
    'accidentally': { word: 'accidentally', definition: 'It happened by mistake — you did not mean to do it', pos: 'adverb' },
    'circumstances': { word: 'circumstances', definition: 'Everything that is going on around a situation', pos: 'noun' },
    'coincidence': { word: 'coincidence', definition: 'When two things happen at the same time by chance — not planned', pos: 'noun' },
    'mechanism': { word: 'mechanism', definition: 'The parts inside something that make it work', pos: 'noun' },
    'satisfaction': { word: 'satisfaction', definition: 'A happy, proud feeling when something goes well', pos: 'noun' },
    // Book-specific key vocabulary (Purple Space Chickens)
    'code name': { word: 'code name', definition: 'A secret name you use so nobody knows who you really are', pos: 'noun' },
    'document': { word: 'document', definition: 'An important piece of paper or writing with information on it', pos: 'noun' },
    'enclosure': { word: 'enclosure', definition: 'A space with walls or fences around it — like a pen for animals', pos: 'noun' },
    'extraordinary': { word: 'extraordinary', definition: 'Way more amazing than normal — super special!', pos: 'adjective' },
    'rustling': { word: 'rustling', definition: 'A soft, crunchy sound like leaves moving around', pos: 'noun' },
    'miniature': { word: 'miniature', definition: 'Really really tiny — a small version of something bigger', pos: 'adjective' },
    'ironically': { word: 'ironically', definition: 'When the opposite of what you expected happens — kind of funny!', pos: 'adverb' },
    'hesitated': { word: 'hesitated', definition: 'Stopped for a second because you were not sure what to do', pos: 'verb' },
    'astronaut': { word: 'astronaut', definition: 'A person who travels to outer space in a rocket ship', pos: 'noun' },
    'suspicion': { word: 'suspicion', definition: 'A feeling that something sneaky might be going on', pos: 'noun' },
    'skeptical': { word: 'skeptical', definition: 'Not really believing something — thinking "hmm, are you sure?"', pos: 'adjective' },
    'casual': { word: 'casual', definition: 'Relaxed and easy-going — not fancy or serious', pos: 'adjective' },
    'frantically': { word: 'frantically', definition: 'Doing something really fast because you are scared or worried', pos: 'adverb' },
    'doomed': { word: 'doomed', definition: 'When something bad is definitely going to happen — no way out!', pos: 'adjective' },
    'obsession': { word: 'obsession', definition: 'When you cannot stop thinking about something — it is always on your mind', pos: 'noun' },
    'crimson': { word: 'crimson', definition: 'A deep, dark red color — like a red ruby', pos: 'adjective' },
    'teleportation': { word: 'teleportation', definition: 'Moving from one place to another in the blink of an eye — like magic!', pos: 'noun' },
    'teleport': { word: 'teleport', definition: 'Disappearing from one place and appearing in another instantly', pos: 'verb' },
    'weightless': { word: 'weightless', definition: 'Feeling like you weigh nothing — floating in the air like in space', pos: 'adjective' },
    'vengeance': { word: 'vengeance', definition: 'Getting someone back for something mean they did to you', pos: 'noun' },
    'unmistakable': { word: 'unmistakable', definition: 'So clear you cannot get it wrong — easy to recognize', pos: 'adjective' },
    'transaction': { word: 'transaction', definition: 'When you buy or trade something — giving one thing to get another', pos: 'noun' },
    'polite': { word: 'polite', definition: 'Having good manners — saying please and thank you', pos: 'adjective' },
    'emphasizing': { word: 'emphasizing', definition: 'Saying something in a bigger voice to show it is really important', pos: 'verb' },
    'concentrating': { word: 'concentrating', definition: 'Thinking really hard about one thing and not getting distracted', pos: 'verb' },
    'beeline': { word: 'beeline', definition: 'Going straight to something as fast as you can — no stopping!', pos: 'noun' },
    'grateful': { word: 'grateful', definition: 'Feeling thankful for something nice someone did for you', pos: 'adjective' },
    'abstract': { word: 'abstract', definition: 'Something you cannot touch or see — like an idea or a feeling', pos: 'adjective' },
    'splatters': { word: 'splatters', definition: 'Messy drops that go everywhere — like paint splashing', pos: 'noun' },
    'furiously': { word: 'furiously', definition: 'Doing something really fast and with lots of energy, maybe angry', pos: 'adverb' },
    'instinctively': { word: 'instinctively', definition: 'Doing something without thinking — your body just knows what to do', pos: 'adverb' },
    'sensation': { word: 'sensation', definition: 'A feeling in your body — like tingling or warmth', pos: 'noun' },
    'substances': { word: 'substances', definition: 'Stuff that things are made of — like liquids, powders, or metals', pos: 'noun' },
    'unbearable': { word: 'unbearable', definition: 'So bad or hard that you can barely take it anymore', pos: 'adjective' },
    // Multi-word phrases
    'most likely': { word: 'most likely', definition: 'The thing that will probably happen — the best guess', pos: 'phrase' },
    'on purpose': { word: 'on purpose', definition: 'You meant to do it — it was not an accident', pos: 'phrase' },
    'at first': { word: 'at first', definition: 'In the beginning — before things changed', pos: 'phrase' },
    'in the end': { word: 'in the end', definition: 'When everything was over — the final part', pos: 'phrase' },
    'for example': { word: 'for example', definition: 'Here is one way to show what I mean', pos: 'phrase' },
    'make sense': { word: 'make sense', definition: 'Easy to understand — it all adds up', pos: 'phrase' },
    'nervous-squirrel mode': { word: 'nervous-squirrel mode', definition: 'Acting jumpy and scared like a squirrel — looking around all worried', pos: 'phrase' },
    'ah ha moment': { word: 'Ah ha moment', definition: 'When you suddenly figure something out — like a light bulb turning on in your head!', pos: 'phrase' },
    'window of opportunity': { word: 'window of opportunity', definition: 'A short time when you have a chance to do something before it is too late', pos: 'phrase' },
    // Diary of a Famous Cat vocabulary
    'feral': { word: 'feral', definition: 'A wild animal that does not have a home or an owner', pos: 'adjective' },
    'upload': { word: 'upload', definition: 'Putting a picture or video on the internet for people to see', pos: 'verb' },
    'bolted': { word: 'bolted', definition: 'Ran away really fast — zoom!', pos: 'verb' },
    'nudged': { word: 'nudged', definition: 'Gave a little push with your nose or elbow to get someone\'s attention', pos: 'verb' },
    'viral': { word: 'viral', definition: 'When something on the internet gets shared by SO many people really fast', pos: 'adjective' },
    'shrieked': { word: 'shrieked', definition: 'Let out a really loud, high scream — like when you see a spider!', pos: 'verb' },
    'strutted': { word: 'strutted', definition: 'Walked in a proud, fancy way — like you own the place', pos: 'verb' },
    'flawless': { word: 'flawless', definition: 'Perfect — with zero mistakes or problems', pos: 'adjective' },
    'mess': { word: 'mess', definition: 'When things are all mixed up and not neat at all', pos: 'noun' },
    'organized': { word: 'organized', definition: 'Everything is in the right place — neat and tidy', pos: 'adjective' },
    'likeness': { word: 'likeness', definition: 'A picture or drawing that looks just like someone', pos: 'noun' },
    'comebacks': { word: 'comebacks', definition: 'Clever or funny things you say back to someone', pos: 'noun' },
    'detective': { word: 'detective', definition: 'Someone who looks for clues and figures out mysteries', pos: 'noun' },
    'distracting': { word: 'distracting', definition: 'Something that takes your attention away from what you are doing', pos: 'adjective' },
    'superpower': { word: 'superpower', definition: 'An amazing ability that makes you extra special — like a superhero!', pos: 'noun' },
    'airmail': { word: 'airmail', definition: 'Sending a letter or package by airplane so it gets there faster', pos: 'noun' },
    'VIP': { word: 'VIP', definition: 'Very Important Person — someone who gets special treatment', pos: 'noun' },
    'pedestal': { word: 'pedestal', definition: 'A stand that holds something up high so everyone can see it', pos: 'noun' },
    'stray': { word: 'stray', definition: 'An animal that is lost or does not have a home', pos: 'noun' },
    'recess': { word: 'recess', definition: 'The fun break time at school when you get to play outside!', pos: 'noun' },
    'hangry': { word: 'hangry', definition: 'Feeling angry because you are SO hungry — hungry + angry!', pos: 'adjective' },
    'beanie': { word: 'beanie', definition: 'A soft, warm hat that fits snugly on your head', pos: 'noun' },
    'influence': { word: 'influence', definition: 'The power to change how someone thinks or acts', pos: 'noun' },
    // Dragon Diaries vocabulary
    'mysterious': { word: 'mysterious', definition: 'Strange and hard to explain — full of secrets', pos: 'adjective' },
    'peculiar': { word: 'peculiar', definition: 'Really weird or strange — not like anything you have seen before', pos: 'adjective' },
    'shimmer': { word: 'shimmer', definition: 'A soft, sparkly light — like glitter catching the sun', pos: 'verb' },
    'chaotic': { word: 'chaotic', definition: 'Crazy and out of control — everything is a mess!', pos: 'adjective' },
    'camouflage': { word: 'camouflage', definition: 'Hiding by blending in with what is around you — like a chameleon', pos: 'noun' },
    'scorched': { word: 'scorched', definition: 'Burned a little bit — like when toast gets too dark', pos: 'adjective' },
    'devoured': { word: 'devoured', definition: 'Ate something really fast because you were super hungry', pos: 'verb' },
    'inevitable': { word: 'inevitable', definition: 'Something that is going to happen no matter what — you cannot stop it', pos: 'adjective' },
    'rummaging': { word: 'rummaging', definition: 'Digging through a pile of stuff to find something', pos: 'verb' },
    'snooping': { word: 'snooping', definition: 'Sneaking around and looking at things that might not be your business', pos: 'verb' },
    'catastrophe': { word: 'catastrophe', definition: 'A really big disaster — everything went wrong!', pos: 'noun' },
    'reputation': { word: 'reputation', definition: 'What other people think about you based on what you have done', pos: 'noun' },
    'revelation': { word: 'revelation', definition: 'Finding out something surprising that you did not know before', pos: 'noun' },
    'uncontrollable': { word: 'uncontrollable', definition: 'Cannot be stopped or controlled — it just keeps going!', pos: 'adjective' },
    'triggered': { word: 'triggered', definition: 'Something that started or set off something else', pos: 'verb' },
    'backfiring': { word: 'backfiring', definition: 'When a plan goes wrong and the opposite of what you wanted happens', pos: 'verb' },
    'invisibility': { word: 'invisibility', definition: 'Being impossible to see — like you disappeared!', pos: 'noun' },
    'outsiders': { word: 'outsiders', definition: 'People who are not part of a group — they are on the outside', pos: 'noun' },
    'leather': { word: 'leather', definition: 'A tough material made from animal skin — used for shoes and bags', pos: 'noun' },
    'exotic': { word: 'exotic', definition: 'From a faraway place and very unusual or special', pos: 'adjective' },
    'frustration': { word: 'frustration', definition: 'That annoyed feeling when things are not going your way', pos: 'noun' },
    'recharge': { word: 'recharge', definition: 'Filling up your energy again — like charging a phone battery', pos: 'verb' },
    'shimmered': { word: 'shimmered', definition: 'Sparkled and glowed with a soft, pretty light', pos: 'verb' },
    'creature': { word: 'creature', definition: 'Any living animal or being — real or imaginary', pos: 'noun' },
    // Descriptive action words kids encounter in chapter books
    'dangling': { word: 'dangling', definition: 'Hanging down and swinging back and forth loosely', pos: 'verb' },
    'swooped': { word: 'swooped', definition: 'Flew down really fast — like a bird diving through the air', pos: 'verb' },
    'crouched': { word: 'crouched', definition: 'Bent down low to hide or get ready to jump', pos: 'verb' },
    'lunged': { word: 'lunged', definition: 'Jumped forward really fast to grab something', pos: 'verb' },
    'scrambled': { word: 'scrambled', definition: 'Moved quickly in a messy, clumsy way — like climbing fast', pos: 'verb' },
    'trembling': { word: 'trembling', definition: 'Shaking a little because you are scared or cold', pos: 'verb' },
    'gasped': { word: 'gasped', definition: 'Took a sudden sharp breath because you were surprised or shocked', pos: 'verb' },
    'muttered': { word: 'muttered', definition: 'Said something very quietly, almost under your breath', pos: 'verb' },
    'whispered': { word: 'whispered', definition: 'Talked super quietly so only the person next to you can hear', pos: 'verb' },
    'pounced': { word: 'pounced', definition: 'Jumped on something quickly — like a cat catching a mouse!', pos: 'verb' },
    'wobbled': { word: 'wobbled', definition: 'Moved side to side in a shaky, unsteady way', pos: 'verb' },
    'yanked': { word: 'yanked', definition: 'Pulled something really hard and fast', pos: 'verb' },
    'darted': { word: 'darted', definition: 'Moved suddenly and quickly in one direction', pos: 'verb' },
    'snatched': { word: 'snatched', definition: 'Grabbed something really fast', pos: 'verb' },
    'glanced': { word: 'glanced', definition: 'Took a quick, short look at something', pos: 'verb' },
    'squinted': { word: 'squinted', definition: 'Made your eyes small and narrow to see better', pos: 'verb' },
    'grinned': { word: 'grinned', definition: 'Smiled really big showing your teeth', pos: 'verb' },
    'giggled': { word: 'giggled', definition: 'Laughed in a quiet, silly way', pos: 'verb' },
    'groaned': { word: 'groaned', definition: 'Made a low, tired sound because something was annoying or hard', pos: 'verb' },
    'shrugged': { word: 'shrugged', definition: 'Lifted your shoulders up and down to say "I don\'t know"', pos: 'verb' },
    'stumbled': { word: 'stumbled', definition: 'Almost fell down because you tripped on something', pos: 'verb' },
    'tiptoed': { word: 'tiptoed', definition: 'Walked very quietly on the tips of your toes so nobody hears you', pos: 'verb' },
    'enormous': { word: 'enormous', definition: 'REALLY, really big — way bigger than normal', pos: 'adjective' },
    'tiny': { word: 'tiny', definition: 'Super small — like an ant or a grain of sand', pos: 'adjective' },
    'fierce': { word: 'fierce', definition: 'Strong and scary-looking — like a lion about to roar', pos: 'adjective' },
    'cozy': { word: 'cozy', definition: 'Warm and comfortable — like being under a soft blanket', pos: 'adjective' },
    'drenched': { word: 'drenched', definition: 'Completely soaked with water — totally wet all over', pos: 'adjective' },
    'exhausted': { word: 'exhausted', definition: 'SO tired that you can barely move or keep your eyes open', pos: 'adjective' },
    'stunned': { word: 'stunned', definition: 'So surprised you cannot move or talk for a second', pos: 'adjective' },
    'squishy': { word: 'squishy', definition: 'Soft and mushy — you can squeeze it and it changes shape', pos: 'adjective' },
    'soaked': { word: 'soaked', definition: 'Very very wet — like you jumped in a puddle', pos: 'adjective' },
    'tangled': { word: 'tangled', definition: 'All twisted and knotted up together — hard to pull apart', pos: 'adjective' },
    'perched': { word: 'perched', definition: 'Sitting on the edge of something up high, like a bird on a branch', pos: 'verb' },
    'clutched': { word: 'clutched', definition: 'Held onto something really tight because you didn\'t want to let go', pos: 'verb' },
    'peered': { word: 'peered', definition: 'Looked closely at something, usually through a small space', pos: 'verb' },
    'slumped': { word: 'slumped', definition: 'Fell or drooped down because you were tired or sad', pos: 'verb' },
    'beamed': { word: 'beamed', definition: 'Smiled really brightly — your whole face lit up with happiness', pos: 'verb' },
    'startled': { word: 'startled', definition: 'Surprised and a little scared by something sudden', pos: 'adjective' },
    // ─── Additional quiz vocabulary (Famous Cat + Dragon Diaries) ───
    'alley': { word: 'alley', definition: 'A narrow path or street between buildings', pos: 'noun' },
    'announced': { word: 'announced', definition: 'Said something out loud so everyone could hear', pos: 'verb' },
    'architecture': { word: 'architecture', definition: 'The way a building is designed and built — its shape and style', pos: 'noun' },
    'adjusting': { word: 'adjusting', definition: 'Changing something a little bit to make it fit or work better', pos: 'verb' },
    'camouflaged': { word: 'camouflaged', definition: 'Hidden by blending in with the colors and shapes around you', pos: 'adjective' },
    'commits': { word: 'commits', definition: 'Promises to do something and really means it', pos: 'verb' },
    'companion': { word: 'companion', definition: 'A friend who goes with you and keeps you company', pos: 'noun' },
    'connection': { word: 'connection', definition: 'A link between two things or people — how they go together', pos: 'noun' },
    'conversation': { word: 'conversation', definition: 'When two or more people talk back and forth to each other', pos: 'noun' },
    'controlled': { word: 'controlled', definition: 'Kept something steady and in charge — not letting it go wild', pos: 'adjective' },
    'convincing': { word: 'convincing', definition: 'Making someone believe something is true or a good idea', pos: 'adjective' },
    'cooperate': { word: 'cooperate', definition: 'Working together with someone as a team', pos: 'verb' },
    'crashed': { word: 'crashed', definition: 'Bumped into something really hard — BANG!', pos: 'verb' },
    'dangerous': { word: 'dangerous', definition: 'Something that could hurt you — not safe', pos: 'adjective' },
    'defective': { word: 'defective', definition: 'Broken or not working the right way', pos: 'adjective' },
    'determine': { word: 'determine', definition: 'To figure something out or make a decision', pos: 'verb' },
    'destined': { word: 'destined', definition: 'Meant to happen — like it was always part of the plan', pos: 'adjective' },
    'discovery': { word: 'discovery', definition: 'Finding something new and exciting that you did not know about', pos: 'noun' },
    'drifted': { word: 'drifted', definition: 'Moved slowly and gently, like floating on water or falling asleep', pos: 'verb' },
    'efficiently': { word: 'efficiently', definition: 'Getting things done quickly without wasting time or energy', pos: 'adverb' },
    'elaborate': { word: 'elaborate', definition: 'Very detailed and fancy — with lots of parts or decorations', pos: 'adjective' },
    'enclosed': { word: 'enclosed', definition: 'Surrounded on all sides — closed in like a box', pos: 'adjective' },
    'enthusiastically': { word: 'enthusiastically', definition: 'Doing something with LOTS of excitement and energy', pos: 'adverb' },
    'excuses': { word: 'excuses', definition: 'Reasons you give to explain why you did or did not do something', pos: 'noun' },
    'expelled': { word: 'expelled', definition: 'Kicked out of a place and told you cannot come back', pos: 'verb' },
    'experiment': { word: 'experiment', definition: 'A test you do to find out if something works or is true', pos: 'noun' },
    'experiments': { word: 'experiments', definition: 'Tests you do to learn something new by trying things out', pos: 'noun' },
    'expensive': { word: 'expensive', definition: 'Costs a LOT of money — not cheap at all', pos: 'adjective' },
    'filmed': { word: 'filmed', definition: 'Recorded a video using a camera or phone', pos: 'verb' },
    'flickering': { word: 'flickering', definition: 'A light going on and off quickly — blinking and shaky', pos: 'verb' },
    'frequently': { word: 'frequently', definition: 'Happening a lot — over and over again', pos: 'adverb' },
    'generous': { word: 'generous', definition: 'Happy to share and give things to others', pos: 'adjective' },
    'gobbled': { word: 'gobbled', definition: 'Ate something super fast — like you were starving!', pos: 'verb' },
    'hologram': { word: 'hologram', definition: 'A picture made of light that looks 3D — like it is floating in the air', pos: 'noun' },
    'hovered': { word: 'hovered', definition: 'Floated in one spot in the air without moving much', pos: 'verb' },
    'identical': { word: 'identical', definition: 'Exactly the same — like two matching puzzle pieces', pos: 'adjective' },
    'identities': { word: 'identities', definition: 'Who people really are — their names and what makes them special', pos: 'noun' },
    'interrupted': { word: 'interrupted', definition: 'Started talking when someone else was still speaking', pos: 'verb' },
    'invisible': { word: 'invisible', definition: 'Cannot be seen — like you turned completely see-through', pos: 'adjective' },
    'knowledgeable': { word: 'knowledgeable', definition: 'Knowing a lot about something — really smart about it', pos: 'adjective' },
    'labyrinth': { word: 'labyrinth', definition: 'A big maze with lots of twists and turns that is hard to find your way through', pos: 'noun' },
    'library': { word: 'library', definition: 'A place full of books where you can read and borrow them for free', pos: 'noun' },
    'martial': { word: 'martial', definition: 'Having to do with fighting or self-defense — like karate or kung fu', pos: 'adjective' },
    'motionless': { word: 'motionless', definition: 'Not moving at all — completely still like a statue', pos: 'adjective' },
    'naturally': { word: 'naturally', definition: 'In a normal, easy way — without having to try hard', pos: 'adverb' },
    'nutrition': { word: 'nutrition', definition: 'The healthy stuff in food that helps your body grow strong', pos: 'noun' },
    'outdated': { word: 'outdated', definition: 'Old and not used anymore — there is a newer version now', pos: 'adjective' },
    'panicking': { word: 'panicking', definition: 'Freaking out because you are really scared and do not know what to do', pos: 'verb' },
    'performing': { word: 'performing', definition: 'Doing something in front of people — like a show or trick', pos: 'verb' },
    'personality': { word: 'personality', definition: 'The way someone acts and feels that makes them who they are', pos: 'noun' },
    'physically': { word: 'physically', definition: 'Having to do with your body — like running, jumping, or touching', pos: 'adverb' },
    'playlist': { word: 'playlist', definition: 'A list of songs you picked to listen to one after another', pos: 'noun' },
    'privacy': { word: 'privacy', definition: 'Being alone and having your own space where nobody is watching', pos: 'noun' },
    'protected': { word: 'protected', definition: 'Kept safe so nothing bad could happen', pos: 'verb' },
    'recognized': { word: 'recognized', definition: 'Knew who or what something was because you saw it before', pos: 'verb' },
    'regardless': { word: 'regardless', definition: 'No matter what — it does not change the answer', pos: 'adverb' },
    'resourceful': { word: 'resourceful', definition: 'Really good at solving problems with whatever you have around you', pos: 'adjective' },
    'ricocheted': { word: 'ricocheted', definition: 'Bounced off something and flew in a different direction', pos: 'verb' },
    'scorch': { word: 'scorch', definition: 'To burn something a little on the outside with heat', pos: 'verb' },
    'sensitive': { word: 'sensitive', definition: 'Feeling things strongly — can get hurt easily by words or touch', pos: 'adjective' },
    'signatures': { word: 'signatures', definition: 'The special way you write your name — your own style', pos: 'noun' },
    'slouched': { word: 'slouched', definition: 'Sat or stood with your shoulders drooping forward — looking tired or sad', pos: 'verb' },
    'specifically': { word: 'specifically', definition: 'Exactly and clearly — talking about one certain thing', pos: 'adverb' },
    'sprinted': { word: 'sprinted', definition: 'Ran as fast as you possibly could', pos: 'verb' },
    'strategy': { word: 'strategy', definition: 'A smart plan for how to win or solve something', pos: 'noun' },
    'stealth': { word: 'stealth', definition: 'Moving quietly and secretly so nobody notices you — like a ninja', pos: 'noun' },
    'teased': { word: 'teased', definition: 'Made fun of someone in a joking or mean way', pos: 'verb' },
    'temporarily': { word: 'temporarily', definition: 'Only for a short time — not forever', pos: 'adverb' },
    'terrifying': { word: 'terrifying', definition: 'SO scary it makes your heart pound and your legs shake', pos: 'adjective' },
    'thorough': { word: 'thorough', definition: 'Checking everything carefully and not missing a single thing', pos: 'adjective' },
    'transform': { word: 'transform', definition: 'To change into something completely different', pos: 'verb' },
    'revealed': { word: 'revealed', definition: 'Showed something that was hidden — the secret came out!', pos: 'verb' },
    'treasure': { word: 'treasure', definition: 'Something really valuable and special — like gold or jewels', pos: 'noun' },
    'uncomfortable': { word: 'uncomfortable', definition: 'Not feeling good — like something is bugging you or does not fit right', pos: 'adjective' },
    'unnatural': { word: 'unnatural', definition: 'Not normal — something that does not happen in nature', pos: 'adjective' },
    'valuable': { word: 'valuable', definition: 'Worth a lot — really important or costs a lot of money', pos: 'adjective' },
    'vibrations': { word: 'vibrations', definition: 'Tiny shaking movements back and forth — like a phone buzzing', pos: 'noun' },
    'wobbly': { word: 'wobbly', definition: 'Shaky and unsteady — moving side to side like it might fall', pos: 'adjective' },
    // ─── Additional quiz vocabulary (all books) ───
    'amazing': { word: 'amazing', definition: 'So cool and awesome that it makes you say WOW!', pos: 'adjective' },
    'annoyed': { word: 'annoyed', definition: 'Feeling a little bit mad because something keeps bugging you', pos: 'adjective' },
    'attention': { word: 'attention', definition: 'When you are looking and listening carefully to something', pos: 'noun' },
    'celebrated': { word: 'celebrated', definition: 'Had a party or did something special because something good happened', pos: 'verb' },
    'celebrity': { word: 'celebrity', definition: 'A person or animal that lots and lots of people know about — they are famous!', pos: 'noun' },
    'coincidences': { word: 'coincidences', definition: 'When two things happen at the same time by accident — not planned', pos: 'noun' },
    'comfortable': { word: 'comfortable', definition: 'Feeling cozy and relaxed — like nothing is bothering you', pos: 'adjective' },
    'complicated': { word: 'complicated', definition: 'Hard to understand because it has a lot of parts — not simple', pos: 'adjective' },
    'confidence': { word: 'confidence', definition: 'Believing in yourself — feeling brave enough to try things', pos: 'noun' },
    'confused': { word: 'confused', definition: 'Not understanding what is going on — your brain feels mixed up', pos: 'adjective' },
    'connections': { word: 'connections', definition: 'How things are linked together — the way they go with each other', pos: 'noun' },
    'decorative': { word: 'decorative', definition: 'Something that is there to make things look pretty — like decorations', pos: 'adjective' },
    'deliberately': { word: 'deliberately', definition: 'Doing something on purpose — you planned to do it', pos: 'adverb' },
    'determination': { word: 'determination', definition: 'Not giving up even when things are hard — you keep trying!', pos: 'noun' },
    'discovered': { word: 'discovered', definition: 'Found something new that you did not know about before', pos: 'verb' },
    'excited': { word: 'excited', definition: 'Feeling super happy and full of energy because something great is happening', pos: 'adjective' },
    'experience': { word: 'experience', definition: 'Something that happened to you — what you went through', pos: 'noun' },
    'extremely': { word: 'extremely', definition: 'Way more than normal — like REALLY, REALLY a lot', pos: 'adverb' },
    'famous': { word: 'famous', definition: 'Very well-known — when everyone has heard of you, like a movie star', pos: 'adjective' },
    'frighten': { word: 'frighten', definition: 'To scare someone — making them feel afraid', pos: 'verb' },
    'frightening': { word: 'frightening', definition: 'Something that makes you feel scared or afraid', pos: 'adjective' },
    'genuine': { word: 'genuine', definition: 'Real and true — not fake or pretend', pos: 'adjective' },
    'imagines': { word: 'imagines', definition: 'Makes pictures in your head of things that are not really there', pos: 'verb' },
    'investigated': { word: 'investigated', definition: 'Looked into something closely to find out the truth', pos: 'verb' },
    'investigation': { word: 'investigation', definition: 'Looking for clues and trying to figure out what happened', pos: 'noun' },
    'jealous': { word: 'jealous', definition: 'Feeling upset because someone else has something you want', pos: 'adjective' },
    'magical': { word: 'magical', definition: 'Like magic — special and wonderful in a way that seems impossible', pos: 'adjective' },
    'maintenance': { word: 'maintenance', definition: 'Taking care of something so it stays in good shape', pos: 'noun' },
    'massive': { word: 'massive', definition: 'Super duper BIG — way bigger than normal', pos: 'adjective' },
    'merchandise': { word: 'merchandise', definition: 'Things you can buy — like t-shirts, toys, and hats', pos: 'noun' },
    'nightmare': { word: 'nightmare', definition: 'A really scary dream that makes you feel afraid', pos: 'noun' },
    'observer': { word: 'observer', definition: 'Someone who watches and pays close attention to what is happening', pos: 'noun' },
    'occurrence': { word: 'occurrence', definition: 'Something that happened — an event', pos: 'noun' },
    'opinions': { word: 'opinions', definition: 'What you think or believe about something — your own ideas', pos: 'noun' },
    'patterns': { word: 'patterns', definition: 'Things that repeat in the same way — you can see them happen again and again', pos: 'noun' },
    'permission': { word: 'permission', definition: 'When someone says it is OK for you to do something', pos: 'noun' },
    'popular': { word: 'popular', definition: 'Liked by a LOT of people — everyone wants to be around it', pos: 'adjective' },
    'popularity': { word: 'popularity', definition: 'How many people like you or know about you', pos: 'noun' },
    'possibilities': { word: 'possibilities', definition: 'Things that might happen — all the different ways something could go', pos: 'noun' },
    'practice': { word: 'practice', definition: 'Doing something over and over to get better at it', pos: 'noun' },
    'prefers': { word: 'prefers', definition: 'Likes one thing more than another — that is the one you pick', pos: 'verb' },
    'protection': { word: 'protection', definition: 'Keeping something safe from danger or harm', pos: 'noun' },
    'puzzled': { word: 'puzzled', definition: 'Feeling confused because you cannot figure something out', pos: 'adjective' },
    'realized': { word: 'realized', definition: 'Suddenly understood something you did not know before — aha!', pos: 'verb' },
    'realizes': { word: 'realizes', definition: 'Suddenly understands something — the lightbulb turns on!', pos: 'verb' },
    'recognition': { word: 'recognition', definition: 'When people know who you are and remember you', pos: 'noun' },
    'recognizes': { word: 'recognizes', definition: 'Knows what something is because you have seen it before', pos: 'verb' },
    'satisfied': { word: 'satisfied', definition: 'Happy with how things turned out — feeling good about it', pos: 'adjective' },
    'secretly': { word: 'secretly', definition: 'Doing something without anyone knowing — keeping it hidden', pos: 'adverb' },
    'stylish': { word: 'stylish', definition: 'Looking really cool and fashionable', pos: 'adjective' },
    'trainer': { word: 'trainer', definition: 'Someone who teaches and helps others get better at something', pos: 'noun' },
    'treatment': { word: 'treatment', definition: 'How someone acts toward you — the way they treat you', pos: 'noun' },
    'ultimately': { word: 'ultimately', definition: 'In the end — when everything is said and done', pos: 'adverb' },
    'uncertain': { word: 'uncertain', definition: 'Not sure about something — you do not know yet', pos: 'adjective' },
    'unoriginal': { word: 'unoriginal', definition: 'Not new or creative — something that has been done before', pos: 'adjective' },
    'appreciates': { word: 'appreciates', definition: 'Feels thankful for something — knows it is special', pos: 'verb' },
    'positive': { word: 'positive', definition: 'Good and happy — looking on the bright side', pos: 'adjective' },
    'remember': { word: 'remember', definition: 'When you think about someone or something from before', pos: 'verb' },
    'entertaining': { word: 'entertaining', definition: 'Fun and interesting to watch or listen to — it keeps your attention', pos: 'adjective' }
  };

  // ─── Shuffle answer options so correct answer isn't always B ───
  function shuffleOptions(questions) {
    return questions.map(q => {
      if (!q.options || q.options.length < 2) return q;
      const correctText = q.options[q.correct_answer];
      // Build index array and shuffle using Fisher-Yates
      const indices = q.options.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      const newOptions = indices.map(i => q.options[i]);
      const newCorrect = newOptions.indexOf(correctText);
      return { ...q, options: newOptions, correct_answer: newCorrect };
    });
  }

  // ─── Start a quiz ───
  function start(quizData, student, callback, nextChapterInfo) {
    currentQuiz = { ...quizData, questions: shuffleOptions(quizData.questions || []) };
    currentStudent = student;
    currentQuestion = 0;
    answers = [];
    feedback = [];
    answered = false;
    showingStrategy = false;
    hintShown = [];
    attempts = [];
    wrongPicks = [];
    showRetryModal = false;
    showRevealModal = false;
    quizResults = null;
    quizStartTime = Date.now();
    questionStartTime = Date.now();
    onComplete = callback;
    _nextChapter = nextChapterInfo || null;
    // Tap-away to dismiss vocab tooltips (runs once)
    if (!QuizEngine._tapAwayBound) {
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.vocab-word') && !e.target.closest('.vocab-tooltip')) {
          const tt = document.getElementById('vocab-tooltip');
          if (tt) { tt.style.display = 'none'; tt._currentWord = null; }
        }
      });
      QuizEngine._tapAwayBound = true;
    }
    // Show vocab helper popup once (unless dismissed permanently)
    const vocabDismissed = localStorage.getItem('k2r_vocab_popup_dismissed');
    if (!vocabDismissed) {
      render();
      showVocabHelperPopup();
      return;
    }
    render();
  }

  // ─── Render quiz into a container ───
  function render() {
    const container = document.getElementById('quiz-player-root');
    if (!container) return;

    if (quizResults) {
      container.innerHTML = renderResults();
      return;
    }

    if (currentQuestion === -1) {
      container.innerHTML = renderIntro();
      return;
    }

    const q = currentQuiz.questions[currentQuestion];
    const total = currentQuiz.questions.length;
    const ch = currentQuiz.chapter;
    const stratIcon = STRATEGY_ICONS[q.strategy_type] || '📖';
    const stratName = STRATEGY_NAMES[q.strategy_type] || q.strategy_type;
    const qTypeLabel = QUESTION_TYPE_LABELS[q.question_type] || q.question_type;

    const questionText = q.personalized_text || q.question_text;

    // Merge vocabulary words from question + chapter key_vocabulary + per-question _chapterVocab
    const questionVocab = q.vocabulary_words || [];
    const chapterVocab = getChapterVocabWords();
    const perQuestionVocab = q._chapterVocab ? parseVocabList(q._chapterVocab) : [];

    // For vocabulary questions, suppress tooltips for the tested word(s)
    // so the definition doesn't give away the answer
    const testedWords = q.question_type === 'vocabulary' ? questionVocab.map(w => w.toLowerCase()) : [];
    const vocabWords = [...new Set([...questionVocab, ...chapterVocab, ...perQuestionVocab])]
      .filter(w => !testedWords.includes(w.toLowerCase()));

    let markedText = markContextualVocab(markExplicitVocab(escapeHtml(questionText), vocabWords), testedWords);

    // Mark vocab in passage too
    let markedPassage = '';
    if (q.passage_excerpt) {
      markedPassage = markContextualVocab(markExplicitVocab(escapeHtml(q.passage_excerpt), vocabWords), testedWords);
    }

    const answerForThis = answers[currentQuestion];
    const fbForThis = feedback[currentQuestion];

    container.innerHTML = `
      <div class="quiz-player">
        <div class="quiz-header">
          <div class="quiz-header-left">
            <button class="quiz-back-btn" onclick="QuizEngine.exit()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div class="quiz-book-info">
              <div class="quiz-book-title">${escapeHtml(currentQuiz.book?.title || 'Book Quiz')}</div>
              <div class="quiz-chapter-label">${ch.chapter_number > 0 ? `${/diary|diaries/i.test(currentQuiz.book?.title || '') ? 'Entry' : 'Chapter'} ${ch.chapter_number}: ` : ''}${escapeHtml(ch.title)}</div>
            </div>
          </div>
          <div class="quiz-progress">
            <div class="quiz-progress-text">Question ${currentQuestion + 1} of ${total}</div>
            <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${((currentQuestion + 1) / total) * 100}%"></div></div>
          </div>
        </div>

        <div class="quiz-body">

          <div class="quiz-question-text">${markedText}</div>

          <div class="quiz-options">
            ${(() => {
              // Mark vocab in all options, then ensure at least 2 have underlines
              const opts = q.options || [];
              const markedOpts = opts.map(opt => markContextualVocab(markExplicitVocab(escapeHtml(opt), vocabWords), testedWords));
              const hasVocab = markedOpts.map(m => m.includes('vocab-word'));
              const vocabCount = hasVocab.filter(Boolean).length;

              // If only 1 option has vocab, find a word in another option to also underline
              if (vocabCount === 1) {
                const unmarked = hasVocab.map((v, idx) => v ? -1 : idx).filter(idx => idx >= 0);
                let bestIdx = -1, bestWord = '';
                for (const idx of unmarked) {
                  const words = opts[idx].split(/\s+/);
                  for (const w of words) {
                    const clean = w.replace(/[^a-zA-Z]/g, '');
                    if (clean.length >= 5 && clean.length > bestWord.length) {
                      bestWord = clean; bestIdx = idx;
                    }
                  }
                }
                if (bestIdx >= 0 && bestWord) {
                  markedOpts[bestIdx] = markContextualVocab(
                    markExplicitVocab(escapeHtml(opts[bestIdx]), [...vocabWords, bestWord]), testedWords
                  );
                }
              }

              return opts.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                const wasWrong = wrongPicks[currentQuestion] && wrongPicks[currentQuestion].has(i);
                let cls = 'quiz-option';
                if (answered && answerForThis === i) cls += ' correct';
                if (answered && i === q.correct_answer && answerForThis !== i) cls += ' correct-reveal';
                if (!answered && wasWrong) cls += ' incorrect disabled-wrong';
                if (!answered && !wasWrong && answerForThis === i) cls += ' selected';
                const isDisabled = answered || wasWrong;
                return `<button class="${cls}" onclick="QuizEngine.selectAnswer(${i})" ${isDisabled ? 'disabled' : ''}>
                  <span class="quiz-option-letter">${letter}</span>
                  <span class="quiz-option-text">${markedOpts[i]}</span>
                  ${answered && i === q.correct_answer ? '<svg class="quiz-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                </button>`;
              }).join('');
            })()}
          </div>

          ${!answered && !showRetryModal ? `
            <div class="quiz-hint-area">
              <button class="quiz-hint-btn" onclick="QuizEngine.toggleStrategy()">
                ${showingStrategy ? 'Hide Hint' : '💡 Need a Hint?'}
              </button>
              ${showingStrategy ? `
                <div class="quiz-strategy-card">
                  <p class="quiz-strategy-tip">${escapeHtml(q.strategy_tip || 'Think carefully about the story!')}</p>
                </div>
              ` : ''}
            </div>
          ` : ''}

          ${answered && fbForThis ? `
            <div class="quiz-feedback correct">
              <div class="quiz-feedback-header">
                <span class="quiz-feedback-icon">✅</span> Great Job!
              </div>
              <p class="quiz-feedback-text">${escapeHtml(fbForThis.feedback || q.explanation || '')}</p>
            </div>
          ` : ''}
        </div>

        <div class="quiz-footer">
          ${answered ? `
            <button class="btn btn-primary" onclick="QuizEngine.nextQuestion()">
              ${currentQuestion < total - 1 ? 'Next Question →' : 'See Results →'}
            </button>
          ` : `
            <button class="btn btn-primary" onclick="QuizEngine.submitAnswer()" ${answerForThis === undefined ? 'disabled' : ''}>
              Submit Answer
            </button>
          `}
        </div>
      </div>

      ${showRetryModal ? `
        <div class="quiz-retry-overlay" id="quiz-retry-overlay">
          <div class="quiz-retry-modal">
            <div class="quiz-retry-icon">💪</div>
            <h3 class="quiz-retry-title">Not quite — but you're close!</h3>
            <p class="quiz-retry-message">Read this hint and give it another try.</p>
            <div class="quiz-retry-hint">
              <span class="quiz-retry-hint-label">💡 Hint</span>
              <p>${escapeHtml(q.strategy_tip || 'Think carefully about the story!')}</p>
            </div>
            <button class="btn btn-primary quiz-retry-btn" onclick="QuizEngine.dismissRetryModal()">Try Again</button>
          </div>
        </div>
      ` : ''}

      ${showRevealModal ? `
        <div class="quiz-retry-overlay" id="quiz-reveal-overlay">
          <div class="quiz-retry-modal quiz-reveal-modal">
            <div class="quiz-retry-icon">📖</div>
            <h3 class="quiz-retry-title">The correct answer was:</h3>
            <div class="quiz-reveal-answer">
              <p>"${escapeHtml(q.options[q.correct_answer] || '')}"</p>
            </div>
            <p class="quiz-retry-message">That's okay — every question helps you learn! Let's keep going.</p>
            <button class="btn btn-primary quiz-retry-btn" onclick="QuizEngine.dismissRevealModal()">Next Question →</button>
          </div>
        </div>
      ` : ''}

      <div id="vocab-tooltip" class="vocab-tooltip" style="display:none"></div>
    `;
  }

  function renderIntro() {
    const ch = currentQuiz.chapter;
    const numQuestions = currentQuiz.questions.length;
    const estMinutes = Math.max(5, Math.round(numQuestions * 2));
    const maxKeys = numQuestions * 5 + (numQuestions >= 5 ? 10 : 0);
    return `
      <div class="quiz-player">
        <div class="quiz-intro">
          <div class="quiz-intro-icon">📖</div>
          <h2>${escapeHtml(currentQuiz.book?.title || 'Book Quiz')}</h2>
          <p class="quiz-intro-chapter">${ch.chapter_number > 0 ? `${/diary|diaries/i.test(currentQuiz.book?.title || '') ? 'Entry' : 'Chapter'} ${ch.chapter_number}: ` : ''}${escapeHtml(ch.title)}</p>
          ${currentStudent ? `<p class="quiz-intro-student">Personalized for ${escapeHtml(currentStudent.name)}</p>` : ''}
          <div class="quiz-intro-info">
            <div class="quiz-intro-stat">
              <strong>${numQuestions}</strong><span>Questions</span>
            </div>
            <div class="quiz-intro-stat">
              <strong>~${estMinutes}</strong><span>Minutes</span>
            </div>
            <div class="quiz-intro-stat">
              <strong>${maxKeys}</strong><span>Keys possible</span>
            </div>
          </div>
          <div class="quiz-intro-tip">
            <strong>💡 Tip:</strong> If you get stuck, click "Need a Hint?" for help!
          </div>
          <button class="btn btn-primary btn-lg" onclick="QuizEngine.beginQuiz()">Start Quiz</button>
        </div>
      </div>
    `;
  }

  function renderResults() {
    const r = quizResults;
    const scoreColor = r.score >= 80 ? '#10B981' : r.score >= 60 ? '#F59E0B' : '#EF4444';
    const strategiesUsed = [...new Set(currentQuiz.questions.map(q => q.strategy_type))];

    return `
      <div class="quiz-player">
        <div class="quiz-results">
          <div class="quiz-results-header">
            <div class="quiz-results-score-ring" style="--score-color:${scoreColor};--score-pct:${r.score}">
              <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="none" stroke="var(--g200)" stroke-width="8"/><circle cx="60" cy="60" r="54" fill="none" stroke="${scoreColor}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${(r.score / 100) * 339.3} 339.3" transform="rotate(-90 60 60)"/></svg>
              <div class="quiz-results-score-text">
                <span class="quiz-results-pct">${Math.round(r.score)}%</span>
                <span class="quiz-results-fraction">${r.correctCount}/${r.totalQuestions}</span>
              </div>
            </div>
            <h2>${r.score >= 80 ? '🎉 Excellent Work!' : r.score >= 60 ? '👏 Good Effort!' : '💪 Keep Practicing!'}</h2>
          </div>

          <div class="quiz-results-keys-hero">
            <div class="quiz-results-keys-sparkle quiz-results-keys-sparkle--1">✨</div>
            <div class="quiz-results-keys-sparkle quiz-results-keys-sparkle--2">✨</div>
            <div class="quiz-results-key-icon">🔑</div>
            <div class="quiz-results-key-count">${r.keysEarned}</div>
            <div class="quiz-results-key-label">Keys Earned</div>
            ${!currentStudent
              ? `<button class="btn btn-sm btn-outline" style="margin-top:8px;font-size:0.75rem" onclick="showPersistenceGate('keys')">Keep Keys</button>`
              : ''}
          </div>

          <div class="quiz-results-reading-score">
            <span class="quiz-results-reading-delta" style="color:${r.readingLevelChange >= 0 ? '#10B981' : '#EF4444'}">
              ${r.readingLevelChange >= 0 ? '↑' : '↓'} ${Math.abs(r.readingLevelChange)} pts
            </span>
            <span class="quiz-results-reading-label">Reading Score</span>
            ${currentStudent
              ? `<span class="quiz-results-reading-detail">${r.newReadingScore}L (Level ${r.newReadingLevel})</span>`
              : `<button class="btn btn-sm btn-outline" style="font-size:0.75rem;padding:4px 10px" onclick="showPersistenceGate('save')">Save</button>`}
          </div>

          <div class="quiz-results-breakdown">
            <div class="quiz-results-summary">
              <span class="quiz-results-summary-correct">✅ ${r.correctCount} correct</span>
              <span class="quiz-results-summary-wrong">❌ ${r.totalQuestions - r.correctCount} incorrect</span>
            </div>
            ${(r.totalQuestions - r.correctCount) > 0 ? `
            <button class="quiz-results-expand-btn" onclick="this.parentElement.classList.toggle('expanded');this.textContent=this.parentElement.classList.contains('expanded')?'Hide Details':'See Which Ones'">See Which Ones</button>
            <div class="quiz-results-detail-list">
              ${r.results.map((res, i) => {
                const q = currentQuiz.questions[i];
                return '<div class="quiz-result-item ' + (res.isCorrect ? 'correct' : 'incorrect') + '">' +
                  '<div class="quiz-result-icon">' + (res.isCorrect ? '✅' : '❌') + (res.hintUsed ? ' <span class="quiz-result-retry" title="Used a hint">🔄</span>' : '') + '</div>' +
                  '<div class="quiz-result-info"><div class="quiz-result-text">' + escapeHtml((q.personalized_text || q.question_text).substring(0, 80)) + '...</div></div>' +
                  '</div>';
              }).join('')}
            </div>` : ''}
          </div>

          <div class="quiz-results-actions" style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            <button class="btn btn-outline" onclick="QuizEngine.exit()">Back to Book</button>
            ${r.score < 100 ? `<button class="btn btn-outline" onclick="QuizEngine.retake()">Retake Quiz</button>` : ''}
            ${QuizEngine._nextChapter ? `<button class="btn btn-primary" onclick="QuizEngine.nextChapter()">Next ${/diary|diaries/i.test(currentQuiz.book?.title || '') ? 'Entry' : 'Chapter'} →</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // ─── Actions ───
  function beginQuiz() {
    currentQuestion = 0;
    questionStartTime = Date.now();
    render();
  }

  function showVocabHelperPopup(afterDismiss) {
    const overlay = document.createElement('div');
    overlay.id = 'vocab-helper-popup';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.2s ease';
    overlay.innerHTML = `
      <div style="background:#fff;border-radius:20px;max-width:480px;width:100%;padding:44px 36px 32px;text-align:center;box-shadow:0 24px 48px rgba(0,0,0,0.15);position:relative;animation:scaleIn 0.25s ease">
        <div style="font-size:3rem;margin-bottom:16px">👋</div>
        <h2 style="font-family:var(--font-display,sans-serif);font-size:1.75rem;font-weight:800;color:#1a1a2e;margin-bottom:14px;letter-spacing:-0.02em">Before You Begin!</h2>
        <p style="color:#555;font-size:1.1rem;line-height:1.7;margin-bottom:10px">
          Some words in the quiz may be <span style="text-decoration:underline;text-decoration-color:#7C3AED;text-underline-offset:3px;font-weight:600">underlined</span>. If you tap an underlined word, you'll see a simple explanation to help you understand the question better.
        </p>
        <p style="color:#555;font-size:1.1rem;line-height:1.7;margin-bottom:28px">
          These underlines are here to help you think and solve problems.
        </p>
        <p style="color:#7C3AED;font-weight:700;font-size:1.2rem;margin-bottom:28px">Ready? Let's start!</p>
        <button id="vocab-popup-start" class="btn btn-primary btn-lg" style="width:100%;margin-bottom:16px;font-size:1.125rem;padding:16px 28px">Start Quiz</button>
        <label style="display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;color:#888;font-size:0.8rem">
          <input type="checkbox" id="vocab-popup-dismiss" style="width:16px;height:16px;cursor:pointer">
          Don't show this again
        </label>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('vocab-popup-start').addEventListener('click', function() {
      const dismiss = document.getElementById('vocab-popup-dismiss');
      if (dismiss && dismiss.checked) {
        localStorage.setItem('k2r_vocab_popup_dismissed', '1');
      }
      overlay.remove();
      if (afterDismiss) afterDismiss();
    });

    // Also allow clicking outside to dismiss and start
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        overlay.remove();
        if (afterDismiss) afterDismiss();
      }
    });
  }

  function selectAnswer(idx) {
    if (answered) return;
    if (wrongPicks[currentQuestion] && wrongPicks[currentQuestion].has(idx)) return;
    answers[currentQuestion] = idx;
    render();
  }

  async function submitAnswer() {
    if (answers[currentQuestion] === undefined || answered) return;
    const q = currentQuiz.questions[currentQuestion];
    const opts = q.options || [];
    const isCorrect = answers[currentQuestion] === q.correct_answer;

    // Track attempts
    if (!attempts[currentQuestion]) attempts[currentQuestion] = 0;
    attempts[currentQuestion]++;

    if (isCorrect) {
      // Correct — lock in the answer
      answered = true;
      try {
        const fb = await API.getFeedback({
          question: q.personalized_text || q.question_text,
          studentAnswer: opts[answers[currentQuestion]] || '',
          correctAnswer: opts[q.correct_answer] || '',
          isCorrect: true,
          strategyType: q.strategy_type,
          gradeLevel: currentStudent?.grade || '4th'
        });
        feedback[currentQuestion] = fb;
      } catch(e) {
        const wasHinted = hintShown[currentQuestion];
        feedback[currentQuestion] = {
          isCorrect: true,
          feedback: wasHinted
            ? 'Nice work! The hint helped you figure it out! 🌟'
            : 'Great job! You got it right! ⭐'
        };
      }
    } else {
      // Wrong — record the wrong pick
      if (!wrongPicks[currentQuestion]) wrongPicks[currentQuestion] = new Set();
      wrongPicks[currentQuestion].add(answers[currentQuestion]);
      hintShown[currentQuestion] = true;

      if (attempts[currentQuestion] >= 2) {
        // Second wrong attempt — reveal the correct answer, lock question
        answered = true;
        answers[currentQuestion] = q.correct_answer; // record correct for scoring display
        showRevealModal = true;
        feedback[currentQuestion] = { isCorrect: false, feedback: '', revealed: true };
      } else {
        // First wrong attempt — show hint, let them try again
        showRetryModal = true;
        delete answers[currentQuestion];
      }
    }
    render();
  }

  async function nextQuestion() {
    if (currentQuestion >= currentQuiz.questions.length - 1) {
      // Submit quiz
      const timeTaken = Math.round((Date.now() - quizStartTime) / 1000);
      try {
        if (!currentStudent) {
          // Guest mode: skip API call, use local scoring
          throw new Error('guest-local');
        }
        const hintCount = hintShown.filter(Boolean).length;
        // Map shuffled indices → answer text so server can compare against original options
        const answerTexts = currentQuiz.questions.map((q, i) => {
          const idx = answers[i];
          return idx !== undefined && q?.options ? (q.options[idx] || '') : '';
        });
        quizResults = await API.submitQuiz({
          studentId: currentStudent.id,
          chapterId: currentQuiz.chapter.id,
          answers: answerTexts,
          timeTaken,
          hintCount,
          attemptData: attempts.slice(0, currentQuiz.questions.length),
          vocabLookups: Object.keys(definitionCache)
        });
      } catch(e) {
        // Fallback local scoring
        let correctCount = 0;
        currentQuiz.questions.forEach((q, i) => {
          const wasRevealed = feedback[i]?.revealed;
          if (answers[i] === q.correct_answer && !wasRevealed) {
            correctCount++;
          }
        });
        const score = (correctCount / currentQuiz.questions.length) * 100;
        const localHintCount = hintShown.filter(Boolean).length;
        // 5 keys if pass (>=80%), 4 if used try-again at all, 0 if fail
        let keysEarned = score >= 80 ? (localHintCount > 0 ? 4 : 5) : 0;
        quizResults = {
          score, correctCount, totalQuestions: currentQuiz.questions.length,
          readingLevelChange: Math.round((score / 100 - 0.65) * 20),
          newReadingScore: (currentStudent?.reading_score || 500) + Math.round((score / 100 - 0.65) * 20),
          newReadingLevel: (((currentStudent?.reading_score || 500) + Math.round((score / 100 - 0.65) * 20)) / 160).toFixed(1),
          keysEarned,
          results: currentQuiz.questions.map((q, i) => ({ isCorrect: answers[i] === q.correct_answer && !feedback[i]?.revealed, feedback: feedback[i]?.feedback || '', hintUsed: !!hintShown[i], revealed: !!feedback[i]?.revealed })),
          strategiesUsed: [...new Set(currentQuiz.questions.map(q => q.strategy_type))]
        };
      }
      render();
      if (onComplete) onComplete(quizResults);
      return;
    }
    currentQuestion++;
    answered = false;
    showingStrategy = false;
    showRetryModal = false;
    showRevealModal = false;
    questionStartTime = Date.now();
    render();
  }

  function toggleStrategy() {
    showingStrategy = !showingStrategy;
    if (showingStrategy) hintShown[currentQuestion] = true;
    render();
  }

  function dismissRetryModal() {
    showRetryModal = false;
    feedback[currentQuestion] = null;
    render();
  }

  function dismissRevealModal() {
    showRevealModal = false;
    nextQuestion();
  }

  function exit() {
    const container = document.getElementById('quiz-player-root');
    if (container) container.innerHTML = '';
    // Navigate back to book detail page if we have a book
    if (typeof openBook === 'function' && currentQuiz?.book?.id) {
      openBook(currentQuiz.book.id);
    } else if (typeof navigate === 'function') {
      navigate(typeof userRole !== 'undefined' && userRole === 'guest' ? 'guest-browse' : 'library');
    } else if (typeof renderMain === 'function') {
      renderMain();
    }
  }

  // ─── Hover Definitions ───
  async function showDefinition(el) {
    const word = el.dataset.word;
    if (!word) return;
    const tooltip = document.getElementById('vocab-tooltip');
    if (!tooltip) return;

    // Position tooltip with viewport boundary detection
    const rect = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    tooltip.style.left = rect.left + rect.width / 2 + 'px';
    if (spaceBelow < 140) {
      tooltip.style.top = (rect.top - 8) + 'px';
      tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
      tooltip.classList.add('above');
    } else {
      tooltip.style.top = rect.bottom + 8 + 'px';
      tooltip.style.transform = 'translateX(-50%)';
      tooltip.classList.remove('above');
    }
    tooltip.innerHTML = '<div class="vocab-tooltip-loading">Looking up...</div>';
    tooltip.style.display = 'block';

    // Check cache
    if (definitionCache[word.toLowerCase()]) {
      renderDefinitionTooltip(tooltip, definitionCache[word.toLowerCase()]);
      return;
    }

    // Check chapter vocabulary first (handles both string arrays and object arrays)
    const chapterVocab = currentQuiz?.chapter?.key_vocabulary;
    if (chapterVocab) {
      try {
        let vocabList = typeof chapterVocab === 'string' ? JSON.parse(chapterVocab) : chapterVocab;
        if (Array.isArray(vocabList)) {
          for (const v of vocabList) {
            const vWord = typeof v === 'string' ? v : v.word;
            if (vWord && vWord.toLowerCase() === word.toLowerCase()) {
              const def = typeof v === 'object'
                ? { word: v.word, definition: v.definition || '', part_of_speech: v.pos || '', example: v.example || '', tip: v.tip || '' }
                : { word: vWord, definition: '', part_of_speech: '', example: '', tip: '' };
              // If we have a definition from the vocab data, use it
              if (def.definition) {
                definitionCache[word.toLowerCase()] = def;
                renderDefinitionTooltip(tooltip, def);
                return;
              }
              break; // Word found but no definition — fall through to API
            }
          }
        }
      } catch(e) {}
    }

    // Also check per-question chapter vocab (for full book quiz)
    const q = currentQuiz?.questions?.[currentQuestion];
    if (q?._chapterVocab) {
      try {
        let vocabList = typeof q._chapterVocab === 'string' ? JSON.parse(q._chapterVocab) : q._chapterVocab;
        if (Array.isArray(vocabList)) {
          for (const v of vocabList) {
            const vWord = typeof v === 'string' ? v : v.word;
            if (vWord && vWord.toLowerCase() === word.toLowerCase() && typeof v === 'object' && v.definition) {
              const def = { word: v.word, definition: v.definition, part_of_speech: v.pos || '', example: v.example || '', tip: v.tip || '' };
              definitionCache[word.toLowerCase()] = def;
              renderDefinitionTooltip(tooltip, def);
              return;
            }
          }
        }
      } catch(e) {}
    }

    // Check contextual vocabulary dictionary (instant, no API call)
    const contextDef = CONTEXTUAL_VOCAB[word.toLowerCase()];
    if (contextDef) {
      const def = { word: contextDef.word, definition: contextDef.definition, part_of_speech: contextDef.pos || '', example: contextDef.example || '', tip: contextDef.tip || '' };
      definitionCache[word.toLowerCase()] = def;
      renderDefinitionTooltip(tooltip, def);
      return;
    }

    // Try API, but fall back to a generated definition if API is unavailable or returns a generic message
    try {
      const passage = currentQuiz?.questions?.[currentQuestion]?.passage_excerpt || '';
      const def = await API.defineWord(word, passage, currentStudent?.grade || '4th');
      // Check if the API returned a real definition or a useless fallback
      const defText = (def.definition || '').toLowerCase();
      if (defText.includes('ask a grown-up') || defText.includes('look this word up') || defText.includes('dictionary') || defText.includes('ask your teacher') || !def.definition) {
        // API returned a useless fallback — use our own smart fallback
        const smartDef = generateSmartDefinition(word, passage);
        definitionCache[word.toLowerCase()] = smartDef;
        renderDefinitionTooltip(tooltip, smartDef);
      } else {
        definitionCache[word.toLowerCase()] = def;
        renderDefinitionTooltip(tooltip, def);
      }
    } catch(e) {
      // API failed entirely — use smart fallback
      const passage = currentQuiz?.questions?.[currentQuestion]?.passage_excerpt || '';
      const smartDef = generateSmartDefinition(word, passage);
      definitionCache[word.toLowerCase()] = smartDef;
      renderDefinitionTooltip(tooltip, smartDef);
    }
  }

  // Generate a kid-friendly definition for words not in the dictionary
  function generateSmartDefinition(word, passage) {
    const w = word.toLowerCase();
    // Common suffix patterns to generate meaningful definitions
    const suffixDefs = [
      { suffix: 'ing', hint: 'This is an action word (something you can do)' },
      { suffix: 'ed', hint: 'This describes something that already happened' },
      { suffix: 'ly', hint: 'This word describes HOW something is done' },
      { suffix: 'tion', hint: 'This is a thing or idea' },
      { suffix: 'sion', hint: 'This is a thing or idea' },
      { suffix: 'ment', hint: 'This is a thing or a result of doing something' },
      { suffix: 'ness', hint: 'This describes a quality or feeling' },
      { suffix: 'ful', hint: 'This means full of something' },
      { suffix: 'less', hint: 'This means without something' },
      { suffix: 'able', hint: 'This means something CAN be done' },
      { suffix: 'ible', hint: 'This means something CAN be done' },
      { suffix: 'ous', hint: 'This describes something that has a lot of a quality' },
      { suffix: 'ive', hint: 'This describes a quality or tendency' },
      { suffix: 'al', hint: 'This describes something related to a topic' },
      { suffix: 'er', hint: 'This could be a person who does something, or mean "more" of something' },
      { suffix: 'est', hint: 'This means "the most" of something' },
    ];

    let partOfSpeech = '';
    let defText = '';

    // Try suffix-based smart hints
    for (const { suffix, hint } of suffixDefs) {
      if (w.endsWith(suffix) && w.length > suffix.length + 2) {
        defText = hint;
        if (['ing', 'ed'].includes(suffix)) partOfSpeech = 'verb';
        else if (['ly'].includes(suffix)) partOfSpeech = 'adverb';
        else if (['tion', 'sion', 'ment', 'ness'].includes(suffix)) partOfSpeech = 'noun';
        else if (['ful', 'less', 'able', 'ible', 'ous', 'ive', 'al'].includes(suffix)) partOfSpeech = 'adjective';
        break;
      }
    }

    // If we have passage context, add a helpful tip
    let tip = '';
    if (passage && passage.toLowerCase().includes(w)) {
      tip = 'Read the sentence around this word for clues about what it means!';
    } else {
      tip = 'Look at how this word is used in the answer choice — the other words nearby can help you figure it out!';
    }

    if (!defText) {
      defText = 'This is an important word in the story. Try to figure out what it means from the words around it!';
    }

    return {
      word: word,
      definition: defText,
      part_of_speech: partOfSpeech,
      example: '',
      tip: tip
    };
  }

  function renderDefinitionTooltip(tooltip, def) {
    tooltip.innerHTML = `
      <div class="vocab-tooltip-word">${escapeHtml(def.word)}${def.part_of_speech ? ` <span class="vocab-tooltip-pos">${def.part_of_speech}</span>` : ''}</div>
      <div class="vocab-tooltip-def">${escapeHtml(def.definition)}</div>
      ${def.example ? `<div class="vocab-tooltip-example">"${escapeHtml(def.example)}"</div>` : ''}
      ${def.tip ? `<div class="vocab-tooltip-tip">💡 ${escapeHtml(def.tip)}</div>` : ''}
    `;
  }

  function hideDefinition(el) {
    const tooltip = document.getElementById('vocab-tooltip');
    if (tooltip) tooltip.style.display = 'none';
  }

  // ─── Vocab Marking Helpers ───
  function markExplicitVocab(html, vocabWords) {
    if (!vocabWords || vocabWords.length === 0) return html;
    vocabWords.forEach(w => {
      const re = new RegExp(`\\b(${escapeRegex(w)})\\b`, 'gi');
      html = html.replace(re, '<span class="vocab-word" data-word="$1" onmouseenter="QuizEngine.showDefinition(this)" onmouseleave="QuizEngine.hideDefinition(this)" onclick="QuizEngine.toggleDefinition(this,event)">$1<span class="vocab-dot"></span></span>');
    });
    return html;
  }

  function markContextualVocab(html, skipWords = []) {
    const contextualWords = Object.keys(CONTEXTUAL_VOCAB)
      .filter(w => !skipWords.includes(w.toLowerCase()));
    if (contextualWords.length === 0) return html;
    // Split by existing vocab-word spans to avoid double-wrapping
    const parts = html.split(/(<span class="vocab-word[^"]*"[^>]*>.*?<\/span>)/g);
    // Sort longest-first so phrases match before single words (e.g. "most likely" before "most")
    const sorted = contextualWords.sort((a, b) => b.length - a.length);
    const pattern = sorted.map(w => escapeRegex(w)).join('|');
    const re = new RegExp(`\\b(${pattern})\\b`, 'gi');
    return parts.map(part => {
      if (part.startsWith('<span class="vocab-word')) return part;
      return part.replace(re, (match) => {
        const lower = match.toLowerCase();
        if (!CONTEXTUAL_VOCAB[lower]) return match;
        return `<span class="vocab-word vocab-word-contextual" data-word="${match}" data-contextual="true" onmouseenter="QuizEngine.showDefinition(this)" onmouseleave="QuizEngine.hideDefinition(this)" onclick="QuizEngine.toggleDefinition(this,event)">${match}</span>`;
      });
    }).join('');
  }

  function toggleDefinition(el, event) {
    if (event) event.stopPropagation();
    const tooltip = document.getElementById('vocab-tooltip');
    if (!tooltip) return;
    if (tooltip.style.display === 'block' && tooltip._currentWord === el.dataset.word) {
      tooltip.style.display = 'none';
      tooltip._currentWord = null;
      return;
    }
    tooltip._currentWord = el.dataset.word;
    showDefinition(el);
  }

  // ─── Vocab Helpers ───
  function parseVocabList(vocab) {
    if (!vocab) return [];
    if (typeof vocab === 'string') {
      try { vocab = JSON.parse(vocab); } catch(e) { return []; }
    }
    if (!Array.isArray(vocab)) return [];
    return vocab.map(v => typeof v === 'string' ? v : (v.word || '')).filter(Boolean);
  }

  function getChapterVocabWords() {
    const kv = currentQuiz?.chapter?.key_vocabulary;
    return parseVocabList(kv);
  }

  // ─── Helpers ───
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ─── Reading Level Helpers ───
  function getLexileGrade(lexile) {
    if (lexile < 200) return 'K';
    if (lexile < 300) return '1st';
    if (lexile < 450) return '2nd';
    if (lexile < 550) return '3rd';
    if (lexile < 700) return '4th';
    if (lexile < 850) return '5th';
    if (lexile < 950) return '6th';
    if (lexile < 1050) return '7th';
    if (lexile < 1150) return '8th';
    return '9th+';
  }

  function getReadingLevelColor(level) {
    if (level >= 5.0) return '#10B981';
    if (level >= 4.0) return '#2563EB';
    if (level >= 3.0) return '#F59E0B';
    return '#EF4444';
  }

  function formatReadingLevel(score) {
    const level = (score / 160).toFixed(1);
    const grade = getLexileGrade(score);
    return { score, level, grade, display: `${score}L — Grade ${level}` };
  }

  // Public API
  function nextChapter() {
    if (_nextChapter && typeof launchQuiz === 'function') {
      launchQuiz(_nextChapter.bookId, _nextChapter.chapterNum, _nextChapter.studentId);
    }
  }

  function retake() {
    const bookId = currentQuiz?.book?.id;
    const chapterNum = currentQuiz?.chapter?.chapter_number;
    const sid = currentStudent?.id || null;
    if (!bookId) return;
    if (chapterNum === 0 && typeof launchFullBookQuiz === 'function') {
      launchFullBookQuiz(bookId, sid);
    } else if (typeof launchQuiz === 'function') {
      launchQuiz(bookId, chapterNum, sid);
    }
  }

  return {
    start, render, beginQuiz, selectAnswer, submitAnswer, nextQuestion,
    toggleStrategy, dismissRetryModal, dismissRevealModal, exit, nextChapter, retake, showDefinition, hideDefinition, toggleDefinition,
    formatReadingLevel, getLexileGrade, getReadingLevelColor,
    STRATEGY_ICONS, STRATEGY_NAMES, QUESTION_TYPE_LABELS,
    get _nextChapter() { return _nextChapter; }
  };
})();
