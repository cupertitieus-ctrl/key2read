const Anthropic = require('@anthropic-ai/sdk');

let client = null;

function getClient() {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
  }
  return client;
}

function isConfigured() {
  return process.env.CLAUDE_API_KEY && process.env.CLAUDE_API_KEY !== 'your-claude-api-key-here';
}

// ═══════════════════════════════════════════════════════════════
// UNIVERSAL QUESTION GENERATION FRAMEWORK
// Applies to ALL books, ALL quizzes, Ages 6-8 Default
// ═══════════════════════════════════════════════════════════════

const FIVE_QUESTION_CATEGORIES = `Generate exactly 5 multiple-choice questions. Each question MUST be a specific type in this exact order:

Question 1 — LITERAL COMPREHENSION: "What happened?"
  Tests recall of specific events, characters, or settings from the chapter.
  question_type: "literal"
  strategy_type: "finding-details"

Question 2 — CAUSE/EFFECT OR MOTIVATION: "Why did it happen?"
  Tests reasoning about WHY something happened or WHY a character made a choice.
  question_type: "cause-effect"
  strategy_type: "cause-and-effect"

Question 3 — VOCABULARY IN CONTEXT: How a word is used in the story
  NEVER ask "What does [word] mean?" — students already have a vocabulary helper for definitions.
  Instead, test HOW a word is used in context. Good question formats:
    - "When the author says the cat was 'determined,' what does that tell us about the cat?"
    - "Why did the author use the word 'furiously' to describe how the character ran?"
    - "Which sentence uses the word 'ordinary' the same way it is used in the chapter?"
    - "What does the word 'hesitant' tell us about how the character was feeling?"
  The answer choices should be about meaning IN THE STORY, not dictionary definitions.
  question_type: "vocabulary"
  strategy_type: "context-clues"

Question 4 — INFERENCE OR FEELING: "What can we figure out?"
  Tests reading between the lines — what clues tell us about characters' feelings, motivations, or what might happen next.
  question_type: "inference"
  strategy_type: "making-inferences"

Question 5 — BEST ANSWER REASONING: "Which is the BEST answer?"
  Exactly ONE per quiz. The question text MUST include the word "BEST". All 4 answer choices should be somewhat reasonable, but ONE must be clearly the strongest and most supported by the text. This teaches decision-making and evidence-based reasoning.
  question_type: "best-answer"
  strategy_type: "best-answer-reasoning"`;

const SEVEN_QUESTION_CATEGORIES = `Generate exactly 7 multiple-choice questions. Each question MUST be a specific type in this exact order:

Question 1 — LITERAL COMPREHENSION (What): "What happened?"
  Tests recall of a specific event or action from the chapter.
  question_type: "literal"
  strategy_type: "finding-details"

Question 2 — LITERAL COMPREHENSION (Who/Where/When): Tests recall of characters, settings, or timing.
  question_type: "literal"
  strategy_type: "finding-details"

Question 3 — CAUSE/EFFECT OR MOTIVATION: "Why did it happen?"
  Tests reasoning about causes, effects, or character decisions.
  question_type: "cause-effect"
  strategy_type: "cause-and-effect"

Question 4 — VOCABULARY IN CONTEXT: How a word is used in the story
  NEVER ask "What does [word] mean?" — students already have a vocabulary helper for definitions.
  Instead, test HOW a word is used in context. Good formats:
    - "When the author says [word], what does that tell us about the character?"
    - "Why did the author use the word [word] to describe what happened?"
    - "What does the word [word] tell us about how the character was feeling?"
  Answer choices should be about meaning IN THE STORY, not dictionary definitions.
  question_type: "vocabulary"
  strategy_type: "context-clues"

Question 5 — INFERENCE OR FEELING: "What can we figure out?"
  Tests reading between the lines about feelings or motivations.
  question_type: "inference"
  strategy_type: "making-inferences"

Question 6 — CRITICAL THINKING / PROBLEM SOLVING: "What should happen next?" or "What would be the best thing to do?"
  Tests the student's ability to think about solutions or predict outcomes based on story clues.
  question_type: "inference"
  strategy_type: "character-analysis"

Question 7 — BEST ANSWER REASONING: "Which is the BEST answer?"
  Exactly ONE per quiz. The question text MUST include the word "BEST". All 4 choices somewhat reasonable, one clearly strongest.
  question_type: "best-answer"
  strategy_type: "best-answer-reasoning"`;

const VOCABULARY_FRAMEWORK = `
═══ VOCABULARY FRAMEWORK (MANDATORY) ═══

WORD TIERS — Classify every vocabulary candidate:
• Tier 1 — Everyday words (dog, run, big, said, went) → NEVER underline these
• Tier 2 — Academic words (extremely, investigate, suspicious, convinced, deliberately) → PRIORITIZE these
• Tier 3 — Story-specific content words (alley, telescope, mayor, hibernate) → Use ONLY if important to understanding the story

WORD VALUE TEST — Only underline a word if AT LEAST 2 of these are true:
1. Affects understanding of the passage
2. Likely unfamiliar to a 7-year-old
3. Useful beyond this story (transferable)
4. Represents a reading skill (adjective, strong verb, tone word, thinking word)
If fewer than 2 → do NOT include it in vocabulary_words.

NEVER underline: pronouns (someone, something, everyone, anything, nobody, nothing, somewhere, it, they, them),
compound everyday words (sunglasses, playground, backyard, birthday, homework, bedroom, outside, inside, without, flashlight, lunchbox, treehouse, rainstorm),
filler words, words clearly below grade level, proper nouns.

COMMON MISTAKES — These are NOT vocabulary words, NEVER include them:
someone, something, everyone, anything, nobody, nothing, somewhere,
sunglasses, playground, backyard, birthday, homework, bedroom, flashlight,
outside, inside, without, lunchbox, treehouse.

IMPORTANT: Each quiz MUST include vocabulary words spread across MULTIPLE questions (at least 2 different questions must have vocabulary_words). Not every question needs vocab, but if one question has underlined words, at least one other question must also have them. Choose Tier 2 academic words or Tier 3 story-specific words that help build reading skills.

DEFINITION RULE: Any vocabulary word MUST have a definition simpler than the word itself. If you can't explain it in words a 7-year-old understands → pick a different word.

SKILL TARGETING — Prefer these word types:
• Adjectives (enormous, peculiar, determined)
• Strong verbs (lunged, scrambled, investigated)
• Tone words (nervous, confident, suspicious)
• Intensifiers (extremely, barely, suddenly)
• Thinking words (decide, realize, notice, discover)`;

const ANSWER_RULES = `
═══ ANSWER CHOICE RULES ═══

Every question must have exactly 4 answer choices following these rules:
1. ONE clearly correct or BEST answer
2. NO obvious throwaway wrong answers — every wrong answer must be plausible
3. Wrong answers should be based on common misunderstandings children make (misreading, confusing characters, surface-level thinking)
4. All 4 choices must be within ~20% of each other in character length
5. Correct answer position MUST be varied — spread across 0, 1, 2, 3 across the quiz. Never put the correct answer at the same position more than twice.
6. Each answer choice must start with DIFFERENT words — never 3+ options starting with the same phrase
7. When vocabulary words appear in answer choices, at least 2 choices must contain vocabulary-level words (so underlines don't give away the answer)`;

const BEST_ANSWER_RULES = `
═══ BEST ANSWER QUESTION (Special Rules) ═══

For the BEST answer question:
• Question text MUST contain the word "BEST" (e.g., "Which is the BEST reason..." or "What is the BEST way to describe...")
• All 4 options should seem somewhat reasonable on the surface
• ONE must be clearly the strongest, most complete, and best supported by the text
• The explanation MUST:
  1. State why the best answer is the strongest
  2. Briefly explain why each other option is weaker
  3. Use age-appropriate language (ages 6-8)
• NEVER say "all answers are correct"
• This question teaches children to evaluate evidence and make supported choices`;

const QUALITY_GATE = `
═══ QUALITY TEST (Every Question Must Pass) ═══

Before including a question, verify it passes AT LEAST ONE:
□ Does it require THINKING? (not just remembering a word from the text)
□ Does it test UNDERSTANDING of the story?
□ Does it BUILD VOCABULARY skills?
□ Does it BUILD REASONING skills?
If a question passes NONE of these → REJECT it and write a better one.

HARD RULES — Never include:
✗ Trivial detail questions ("What color was the shirt?")
✗ Memory-only questions that test nothing
✗ Meaningless underlining of common words
✗ Trick questions or "gotcha" wording
✗ Sarcasm or abstract language inappropriate for ages 6-8
✗ Questions where only ONE sentence of the chapter matters
✗ Definitions harder than the target word`;

// Generate quiz questions for a book chapter using the Universal Framework
async function generateChapterQuiz(bookTitle, bookAuthor, chapterNumber, chapterTitle, chapterSummary, gradeLevel, questionCount = 5, pageStart = null, pageEnd = null) {
  if (!isConfigured()) return fallbackQuiz(chapterTitle, questionCount);
  const c = getClient();
  const categories = questionCount === 7 ? SEVEN_QUESTION_CATEGORIES : FIVE_QUESTION_CATEGORIES;
  const maxTokens = questionCount === 7 ? 5500 : 4000;

  // Build page range instruction
  const hasPages = pageStart && pageEnd;
  const pageInfo = hasPages
    ? `\nThis chapter spans pages ${pageStart} to ${pageEnd} in the physical book.`
    : '';
  const pageTip = hasPages
    ? `• strategy_tip: Must reference a REAL page number from this chapter (pages ${pageStart}-${pageEnd}) AND a specific moment. Format: "Go back to page [number] and reread the part where [specific detail]..." or "Look at page [number] where [character] does [action]..." ALWAYS include a real page number between ${pageStart} and ${pageEnd}. Early chapter events happen closer to page ${pageStart}, later events closer to page ${pageEnd}. Do NOT use generic hints like "Reread this chapter" or "Think about the story." Do NOT make up page numbers outside the range ${pageStart}-${pageEnd}.`
    : `• strategy_tip: Must reference a specific moment from the chapter with as much detail as possible. Format: "Go back and reread the part where [specific detail]..." or "Think about the part where [character] does [action]..." Be as specific as possible about which moment in the chapter to revisit.`;

  const prompt = `You are creating a reading comprehension quiz for children ages 6-8 (${gradeLevel || '2nd-3rd'} grade) about "${bookTitle}" by ${bookAuthor}.
Chapter ${chapterNumber}: "${chapterTitle}"
Chapter summary: ${chapterSummary}${pageInfo}

═══ CORE MISSION ═══
Create quiz questions that: measure comprehension accurately, build vocabulary intentionally, develop critical thinking, strengthen problem-solving skills, and teach reasoning (not guessing). Every question must serve a learning purpose — no filler.

${categories}

${VOCABULARY_FRAMEWORK}

${ANSWER_RULES}

${BEST_ANSWER_RULES}

${QUALITY_GATE}

═══ ADDITIONAL RULES ═══
${pageTip}
• explanation: 2-3 sentences, friendly and encouraging tone. For the BEST answer question, also explain why the other options are weaker.
• passage_excerpt: A short relevant quote from the chapter (1-2 sentences). May be empty if the question is about the whole chapter.
• vocabulary_words: Array of 0-3 Tier 2/3 words from the answer choices. At least 2 out of ${questionCount} questions MUST have vocabulary_words.
• At least 2 questions must require thinking beyond a single sentence of the chapter.

═══ OUTPUT FORMAT ═══
Respond in valid JSON only. No text before or after the JSON.
{
  "questions": [
    {
      "question_number": 1,
      "question_type": "literal",
      "question_text": "...",
      "passage_excerpt": "...",
      "options": ["A", "B", "C", "D"],
      "correct_answer": 0,
      "strategy_type": "finding-details",
      "strategy_tip": "Think about the part where [specific detail from chapter]...",
      "explanation": "...",
      "vocabulary_words": ["word1"]
    }
  ]
}`;

  const resp = await c.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }]
  });
  try {
    const text = resp.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      // Basic validation
      if (parsed.questions && parsed.questions.length === questionCount) {
        return parsed;
      }
      console.warn(`Quiz generation returned ${parsed.questions?.length || 0} questions, expected ${questionCount}`);
      if (parsed.questions && parsed.questions.length > 0) return parsed;
    }
  } catch (e) { console.error('Quiz generation parse error:', e); }
  return fallbackQuiz(chapterTitle, questionCount);
}

// Personalize a question for a specific student based on their interests
async function personalizeQuestion(question, student) {
  if (!isConfigured()) return { ...question, personalized_text: question.question_text, personalized: false };
  const interests = JSON.parse(student.interest_tags || '[]');
  const hobbies = JSON.parse(student.hobbies || '[]');
  const animals = JSON.parse(student.favorite_animals || '[]');
  if (interests.length === 0 && hobbies.length === 0) return { ...question, personalized_text: question.question_text, personalized: false };

  const c = getClient();
  const resp = await c.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 600,
    messages: [{ role: 'user', content: `You are personalizing a reading comprehension question for a student. Keep the same reading skill being tested but make it more engaging for this specific student.

ORIGINAL QUESTION: ${question.question_text}

STUDENT INTERESTS: ${interests.join(', ')}
STUDENT HOBBIES: ${hobbies.join(', ')}
FAVORITE ANIMALS: ${animals.join(', ')}
READING STYLE: ${student.reading_style || 'detailed'}
FAVORITE GENRE: ${student.favorite_genre || ''}

Rewrite the question to subtly incorporate the student's interests where natural. For example, if the question asks about friendship and the student likes animals, you might frame it in terms of animal friendships. Keep the core comprehension skill the same. Keep it at the same reading level.

If the question type is "personal", make the personal connection specifically about their interests.

Return ONLY the rewritten question text, nothing else.` }]
  });
  return {
    ...question,
    personalized_text: resp.content[0].text.trim(),
    personalized: true
  };
}

// Get a contextual word definition for a student
async function defineWord(word, context, gradeLevel) {
  if (!isConfigured()) return fallbackDefinition(word);
  const c = getClient();
  const resp = await c.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [{ role: 'user', content: `Define the word "${word}" for a ${gradeLevel || '4th'} grade student.

${context ? `Context: "${context}"` : ''}

Respond in JSON:
{
  "word": "${word}",
  "definition": "Simple, kid-friendly definition (1 sentence)",
  "part_of_speech": "noun/verb/adjective/adverb",
  "example": "A simple example sentence using the word",
  "tip": "A quick memory trick or way to remember this word (1 sentence)"
}` }]
  });
  try {
    const text = resp.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) { console.error('Definition parse error:', e); }
  return fallbackDefinition(word);
}

// Get a reading strategy explanation
async function getStrategyHelp(strategyType, question, passage, gradeLevel) {
  if (!isConfigured()) return fallbackStrategy(strategyType);
  const c = getClient();
  const resp = await c.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [{ role: 'user', content: `You are a friendly reading tutor helping a ${gradeLevel || '4th'} grade student understand how to answer a comprehension question. The student is stuck and needs help with the reading strategy, NOT the answer.

STRATEGY TYPE: ${strategyType}
QUESTION: ${question}
${passage ? `PASSAGE: "${passage}"` : ''}

Teach the student the strategy step by step. Be encouraging, use simple language, and give them a process to follow. Do NOT give away the answer — teach them HOW to find it themselves.

Respond in JSON:
{
  "strategy_name": "A friendly name for this strategy",
  "steps": ["Step 1...", "Step 2...", "Step 3..."],
  "example": "A brief example of using this strategy with different text",
  "encouragement": "A short encouraging message"
}` }]
  });
  try {
    const text = resp.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) { console.error('Strategy parse error:', e); }
  return fallbackStrategy(strategyType);
}

// Get feedback on a student's answer
async function getAnswerFeedback(question, studentAnswer, correctAnswer, isCorrect, strategyType, gradeLevel) {
  if (!isConfigured()) return { feedback: isCorrect ? 'Great job!' : 'Not quite — try reading the passage again carefully.', isCorrect };
  const c = getClient();
  const resp = await c.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 400,
    messages: [{ role: 'user', content: `You are a friendly reading tutor giving feedback to a ${gradeLevel || '4th'} grade student.

QUESTION: ${question}
STUDENT'S ANSWER: ${studentAnswer}
CORRECT ANSWER: ${correctAnswer}
IS CORRECT: ${isCorrect}
STRATEGY USED: ${strategyType}

${isCorrect
  ? 'The student got it right! Give brief positive feedback explaining WHY their answer is correct. Connect it to the reading strategy they used.'
  : 'The student got it wrong. Be kind and encouraging. Explain why the correct answer is right WITHOUT making them feel bad. Guide them to understand using the reading strategy. Say "The answer is..." and explain why.'}

Respond in JSON:
{
  "feedback": "Your feedback message (2-3 sentences, friendly and encouraging)",
  "strategy_reminder": "A brief reminder about the reading strategy (1 sentence)"
}` }]
  });
  try {
    const text = resp.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return { ...JSON.parse(jsonMatch[0]), isCorrect };
  } catch (e) { console.error('Feedback parse error:', e); }
  return { feedback: isCorrect ? 'Great job! You got it right!' : `The correct answer was: ${correctAnswer}. Try using the ${strategyType} strategy next time!`, isCorrect };
}

// Calculate reading level change based on quiz performance
function calculateReadingLevelChange(currentScore, bookLexile, correctCount, totalQuestions) {
  const pct = correctCount / totalQuestions;
  const difficulty = bookLexile - currentScore;
  const difficultyBonus = difficulty > 0 ? Math.min(difficulty / 100, 0.5) : Math.max(difficulty / 200, -0.3);
  let change = (pct - 0.65) * 20 + difficultyBonus * 8;
  change = Math.round(change);
  if (pct >= 0.8 && difficulty > 50) change = Math.max(change, 8);
  if (pct < 0.4) change = Math.max(change, -10);
  if (pct === 1.0) change += 5;
  return change;
}

// Fallbacks when Claude API is not configured
function fallbackQuiz(chapterTitle, questionCount = 5) {
  const fiveQuestions = [
    { question_number: 1, question_type: 'literal', question_text: `What happened in "${chapterTitle}"?`, passage_excerpt: '', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answer: 0, strategy_type: 'finding-details', strategy_tip: 'Reread this chapter to find the answer.', explanation: 'Check the chapter for key events.', vocabulary_words: [] },
    { question_number: 2, question_type: 'cause-effect', question_text: 'Why did the main event in this chapter happen?', passage_excerpt: '', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answer: 0, strategy_type: 'cause-and-effect', strategy_tip: 'Reread this chapter to find the answer.', explanation: 'Look for words like "because" or "so" to find the reason.', vocabulary_words: [] },
    { question_number: 3, question_type: 'vocabulary', question_text: 'What does the key vocabulary word mean in context?', passage_excerpt: '', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answer: 0, strategy_type: 'context-clues', strategy_tip: 'Reread this chapter to find the answer.', explanation: 'Context clues help you understand new words.', vocabulary_words: [] },
    { question_number: 4, question_type: 'inference', question_text: 'What can you figure out from reading between the lines?', passage_excerpt: '', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answer: 0, strategy_type: 'making-inferences', strategy_tip: 'Reread this chapter to find the answer.', explanation: 'Use clues in the text to make your best guess.', vocabulary_words: [] },
    { question_number: 5, question_type: 'best-answer', question_text: 'Which is the BEST way to describe what this chapter is about?', passage_excerpt: '', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answer: 0, strategy_type: 'best-answer-reasoning', strategy_tip: 'Reread this chapter to find the answer.', explanation: 'Think about which answer is the strongest and most complete.', vocabulary_words: [] }
  ];

  if (questionCount === 7) {
    return { questions: [
      { question_number: 1, question_type: 'literal', question_text: `What happened in "${chapterTitle}"?`, passage_excerpt: '', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answer: 0, strategy_type: 'finding-details', strategy_tip: 'Reread this chapter to find the answer.', explanation: 'Check the chapter for key events.', vocabulary_words: [] },
      { question_number: 2, question_type: 'literal', question_text: 'Who was involved in this chapter, and where did it take place?', passage_excerpt: '', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answer: 0, strategy_type: 'finding-details', strategy_tip: 'Reread this chapter to find the answer.', explanation: 'Look for character names and settings.', vocabulary_words: [] },
      { question_number: 3, question_type: 'cause-effect', question_text: 'Why did the main event in this chapter happen?', passage_excerpt: '', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answer: 0, strategy_type: 'cause-and-effect', strategy_tip: 'Reread this chapter to find the answer.', explanation: 'Look for words like "because" or "so" to find the reason.', vocabulary_words: [] },
      { question_number: 4, question_type: 'vocabulary', question_text: 'What does the key vocabulary word mean in context?', passage_excerpt: '', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answer: 0, strategy_type: 'context-clues', strategy_tip: 'Reread this chapter to find the answer.', explanation: 'Context clues help you understand new words.', vocabulary_words: [] },
      { question_number: 5, question_type: 'inference', question_text: 'What can you figure out from reading between the lines?', passage_excerpt: '', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answer: 0, strategy_type: 'making-inferences', strategy_tip: 'Reread this chapter to find the answer.', explanation: 'Use clues in the text to make your best guess.', vocabulary_words: [] },
      { question_number: 6, question_type: 'inference', question_text: 'What would be the best thing for the character to do next?', passage_excerpt: '', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answer: 0, strategy_type: 'character-analysis', strategy_tip: 'Reread this chapter to find the answer.', explanation: 'Think about what the character has learned and how they might act.', vocabulary_words: [] },
      { question_number: 7, question_type: 'best-answer', question_text: 'Which is the BEST way to describe what this chapter is about?', passage_excerpt: '', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answer: 0, strategy_type: 'best-answer-reasoning', strategy_tip: 'Reread this chapter to find the answer.', explanation: 'Think about which answer is the strongest and most complete.', vocabulary_words: [] }
    ]};
  }

  return { questions: fiveQuestions };
}

function fallbackDefinition(word) {
  // Return a signal that the client should use its own smart definition generator
  return { word, definition: '', part_of_speech: '', example: '', tip: '' };
}

function fallbackStrategy(type) {
  const strategies = {
    'finding-details': { strategy_name: 'Detail Detective', steps: ['Read the question carefully', 'Scan the passage for key words from the question', 'Find the sentence that answers the question'], example: 'If the question asks "What color was the house?", look for color words in the text.', encouragement: 'You can do this! The answer is hiding in the text.' },
    'making-inferences': { strategy_name: 'Reading Between the Lines', steps: ['Read the passage carefully', 'Think about what the author is SUGGESTING but not saying directly', 'Use clues from the text plus what you already know'], example: 'If a character is crying and packing a suitcase, you can infer they are sad about leaving.', encouragement: 'Great detectives look for hidden clues — you can too!' },
    'context-clues': { strategy_name: 'Word Detective', steps: ['Find the unknown word in the sentence', 'Read the words BEFORE and AFTER it', 'Think about what word would make sense in that spot'], example: 'In "The famished dog gobbled his food," the words around "famished" tell us it means very hungry.', encouragement: 'You don\'t need a dictionary — the clues are right there!' },
    'identifying-theme': { strategy_name: 'Big Idea Finder', steps: ['Think about what the main character learned', 'Ask yourself: "What lesson does the author want me to learn?"', 'Choose the answer that fits the WHOLE chapter, not just one part'], example: 'If a character learns to be honest after lying, the theme might be "honesty is important."', encouragement: 'Think big! The theme is the life lesson hiding in the story.' },
    'personal-connection': { strategy_name: 'Connect to You', steps: ['Think about a time you felt the same way as a character', 'Remember a similar experience from your life', 'Connect YOUR feelings to the character\'s feelings'], example: 'If a character is nervous about a test, think about when YOU felt nervous.', encouragement: 'Your experiences make you a better reader!' },
    'cause-and-effect': { strategy_name: 'Why Did It Happen?', steps: ['Find the event the question is asking about', 'Ask "WHY did this happen?" or "WHAT happened because of this?"', 'Look for signal words like "because," "so," "therefore"'], example: 'The ice cream melted (effect) BECAUSE it was left in the sun (cause).', encouragement: 'Everything happens for a reason — find the connection!' },
    'character-analysis': { strategy_name: 'Character Explorer', steps: ['Look at what the character SAYS and DOES', 'Think about WHY they act that way', 'Consider how their feelings change during the chapter'], example: 'If a character shares their lunch, that action tells us they are kind and generous.', encouragement: 'Characters are like real people — their actions reveal who they are!' },
    'best-answer-reasoning': { strategy_name: 'Best Answer Finder', steps: ['Read ALL the answer choices carefully', 'Think about which one is the STRONGEST or MOST complete', 'Ask yourself: "Why is this answer better than the others?"'], example: 'If one answer covers more of the story while another only mentions one small part, the bigger answer is usually the BEST.', encouragement: 'You\'re learning to think like a detective — weighing the evidence!' }
  };
  return strategies[type] || strategies['finding-details'];
}

module.exports = { generateChapterQuiz, personalizeQuestion, defineWord, getStrategyHelp, getAnswerFeedback, calculateReadingLevelChange, isConfigured };
