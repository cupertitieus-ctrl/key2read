#!/usr/bin/env node
// Fix PSC Book 1, Chapter 1, Question 4 (id=1594)
// Correct answer: "He wants to protect his identity and his friend from NASA"
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function fixQ4() {
  console.log('🔧 Fixing PSC Book 1, Ch1, Q4 (id=1594)...\n');

  // First read current state
  const { data: current } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('id', 1594)
    .single();

  if (!current) {
    console.log('❌ Question 1594 not found!');
    process.exit(1);
  }

  console.log('Current Q4:');
  console.log(`  Question: ${current.question_text}`);
  console.log(`  Options: ${JSON.stringify(current.options)}`);
  console.log(`  Correct: ${current.correct_answer} → "${current.options[current.correct_answer]}"`);

  // Update with correct answer
  const newOptions = [
    'He wants to protect his identity and his friend from NASA',
    'He thinks it sounds cooler than his real name',
    'His teacher told him to pick a new name for class',
    'He forgot what his real name was'
  ];

  const { error } = await supabase
    .from('quiz_questions')
    .update({
      options: newOptions,
      correct_answer: 0,
      explanation: 'Bear uses a "code name" because he wants to keep himself and Sprinkles safe from NASA. He believes NASA might be looking for purple space chickens, so using a secret name helps protect both his identity and his special friend.'
    })
    .eq('id', 1594);

  if (error) {
    console.log(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }

  // Verify
  const { data: updated } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('id', 1594)
    .single();

  console.log('\n✅ Updated Q4:');
  console.log(`  Options: ${JSON.stringify(updated.options)}`);
  console.log(`  Correct: ${updated.correct_answer} → "${updated.options[updated.correct_answer]}"`);
  console.log(`  Explanation: ${updated.explanation}`);
}

fixQ4().catch(e => { console.error(e); process.exit(1); });
