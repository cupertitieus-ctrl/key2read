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

// Generate 5 quiz questions for a book chapter
async function generateChapterQuiz(bookTitle, bookAuthor, chapterNumber, chapterTitle, chapterSummary, gradeLevel) {
  if (!isConfigured()) return fallbackQuiz(chapterTitle);
  const c = getClient();
  const resp = await c.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    messages: [{ role: 'user', content: `You are creating a reading comprehension quiz for ${gradeLevel} grade students about "${bookTitle}" by ${bookAuthor}, Chapter ${chapterNumber}: "${chapterTitle}".

Chapter summary: ${chapterSummary}

Generate exactly 5 multiple-choice questions. Each question must be a different type:
1. RECALL - Tests memory of specific details from the chapter
2. INFERENCE - Requires reading between the lines
3. VOCABULARY - Tests understanding of a key word from the chapter in context
4. THEME - Asks about the big idea, lesson, or theme
5. PERSONAL - Connects the chapter to the student's own life/experience

For each question, provide:
- question_text: The question
- passage_excerpt: A short relevant quote or passage (1-2 sentences). Leave empty for personal questions.
- options: Exactly 4 answer choices (array of strings)
- correct_answer: Index of correct answer (0-3). IMPORTANT: Vary the position of the correct answer across questions — do NOT always put the correct answer at the same index. Spread correct answers roughly evenly across 0, 1, 2, and 3.
- strategy_type: One of "finding-details", "making-inferences", "context-clues", "identifying-theme", "personal-connection", "cause-and-effect", "character-analysis"
- strategy_tip: A helpful tip teaching students HOW to find the answer (2-3 sentences, written for a child). Focus on the reading STRATEGY, not the answer itself. IMPORTANT: Always reference a specific page number from the chapter (e.g., "Go back to page 12 and look for..." or "On page 8, the author describes..."). If you don't know the exact page, reference the position in the entry (e.g., "Look at the very first page of this entry..." or "Near the end of this entry on the last page...").
- explanation: Why the correct answer is right (2-3 sentences, friendly tone)
- vocabulary_words: Array of important/descriptive words in the answer choices that students might need defined (0-3 words). IMPORTANT: At least 2 out of 5 questions MUST have vocabulary_words. Include descriptive action words (like "dangling", "crouched", "swooped"), vivid adjectives, or any word a 6-8 year old might not know.

CRITICAL — ANSWER LENGTH BALANCE: The correct answer must NOT be consistently longer than the wrong answers. Follow these rules strictly:
- All 4 answer choices for each question should be similar in length (within ~20% of each other).
- If the correct answer needs more detail, add similar detail to at least 2 wrong answers so they are equally long.
- Vary which option is longest across questions — sometimes a wrong answer should be the longest.
- Never make the correct answer the only one with a full sentence while wrong answers are short phrases.
- Wrong answers (distractors) must be plausible and well-crafted, not obviously short throwaway options.

IMPORTANT: When answer choices contain vocabulary words that will be underlined, ensure at least 2 answer choices include vocabulary-level words — never just the correct answer alone. Distribute vocabulary naturally so students cannot identify the correct answer by vocabulary highlighting alone.

IMPORTANT — SENTENCE VARIETY: Vary the sentence starters across answer choices. Do NOT begin all 4 options with the same words. In particular:
- NEVER start 3+ answer choices with "The narrator" — use the character's name, pronouns ("He", "She"), or rephrase entirely.
- Mix up phrasing: use action-first ("Running to the door, he..."), reason-first ("Because the egg was glowing..."), or emotion-first ("Excited by the discovery...") structures.
- Each of the 4 options should begin with different words.

Respond in valid JSON format:
{ "questions": [ { "question_number": 1, "question_type": "recall", "question_text": "...", "passage_excerpt": "...", "options": ["A","B","C","D"], "correct_answer": 0, "strategy_type": "...", "strategy_tip": "...", "explanation": "...", "vocabulary_words": ["word1"] } ] }` }]
  });
  try {
    const text = resp.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) { console.error('Quiz generation parse error:', e); }
  return fallbackQuiz(chapterTitle);
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
function fallbackQuiz(chapterTitle) {
  return { questions: [
    { question_number: 1, question_type: 'recall', question_text: `What happened in "${chapterTitle}"?`, passage_excerpt: '', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answer: 0, strategy_type: 'finding-details', strategy_tip: 'Look for specific details mentioned in the text.', explanation: 'Check the chapter for key events.', vocabulary_words: [] },
    { question_number: 2, question_type: 'inference', question_text: 'What can you figure out from reading between the lines?', passage_excerpt: '', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answer: 0, strategy_type: 'making-inferences', strategy_tip: 'Think about what the author implies but doesn\'t say directly.', explanation: 'Use clues in the text to make your best guess.', vocabulary_words: [] },
    { question_number: 3, question_type: 'vocabulary', question_text: 'What does the key vocabulary word mean in context?', passage_excerpt: '', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answer: 0, strategy_type: 'context-clues', strategy_tip: 'Look at the words around the unfamiliar word for clues.', explanation: 'Context clues help you understand new words.', vocabulary_words: [] },
    { question_number: 4, question_type: 'theme', question_text: 'What is the main lesson or theme of this chapter?', passage_excerpt: '', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answer: 0, strategy_type: 'identifying-theme', strategy_tip: 'Think about the big idea — what does the author want you to learn?', explanation: 'The theme is the message the author wants to share.', vocabulary_words: [] },
    { question_number: 5, question_type: 'personal', question_text: 'How does this chapter connect to your own life?', passage_excerpt: '', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct_answer: 0, strategy_type: 'personal-connection', strategy_tip: 'Think about your own experiences that are similar.', explanation: 'Making personal connections helps you understand the story better.', vocabulary_words: [] }
  ]};
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
    'character-analysis': { strategy_name: 'Character Explorer', steps: ['Look at what the character SAYS and DOES', 'Think about WHY they act that way', 'Consider how their feelings change during the chapter'], example: 'If a character shares their lunch, that action tells us they are kind and generous.', encouragement: 'Characters are like real people — their actions reveal who they are!' }
  };
  return strategies[type] || strategies['finding-details'];
}

module.exports = { generateChapterQuiz, personalizeQuestion, defineWord, getStrategyHelp, getAnswerFeedback, calculateReadingLevelChange, isConfigured };
