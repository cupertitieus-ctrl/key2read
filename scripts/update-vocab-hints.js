#!/usr/bin/env node
// Updates Famous Cat quiz questions to:
// 1. Add vocabulary_words to questions that are missing them (at least 2 per chapter)
// 2. Add page number references to strategy_tip hints

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const DRY_RUN = process.argv.includes('--dry-run');

// Diary of a Famous Cat: Now I Have A Name (book 66, chapters 103-115)
// Vocab + hint updates per question
// Page ranges from the actual book PDF:
// Entry 1: pp 5-10, Entry 2: pp 11-16, Entry 3: pp 17-23, Entry 4: pp 24-30,
// Entry 5: pp 31-41, Entry 6: pp 42-48, Entry 7: pp 49-54, Entry 8: pp 55-59,
// Entry 9: pp 60-66, Entry 10: pp 67-70, Entry 11: pp 71-74, Entry 12: pp 75-79,
// Entry 13: pp 80-85

const UPDATES = {
  // Entry 1 (ch 103) pages 5-10
  '103-1': { vocabulary_words: ['stray'], strategy_tip: 'Go to page 5 where Gray explains WHY she is writing a diary. What does she say her reason is?' },
  '103-2': { vocabulary_words: ['viral'], strategy_tip: 'Go back to page 6 where Gray talks about her video blowing up. Reread that part carefully.' },
  '103-3': { strategy_tip: 'On page 5, Gray compares "feral" to "free range" — both describe a cat without a home, but which one sounds nicer?' },
  '103-4': { vocabulary_words: ['stumbled'], strategy_tip: 'Follow the events on page 9 carefully — what happened between Gray slipping and landing? Put the events in order.' },
  '103-5': { strategy_tip: 'On page 10, read what Gray says about T-shirts and action figures — why would she bring that up?' },

  // Entry 2 (ch 104) pages 11-16
  '104-1': { strategy_tip: 'Go to page 11 where Gray hears the word "upload" for the first time. What does the girl explain it means?' },
  '104-2': { vocabulary_words: ['alley'], strategy_tip: 'On page 12, think about where the girl comes from and who works near that alley. What clues does that give you?' },
  '104-3': { vocabulary_words: ['stray'], strategy_tip: 'On page 16, think about what it means for a stray cat to finally get a name from a human. Why is that a big deal?' },
  '104-4': { strategy_tip: 'On page 13, the author describes how excited the girl looked. Think about what she is being compared to.' },
  '104-5': { vocabulary_words: ['announced'], strategy_tip: 'On page 14, find what happens right after the girl says "I\'m going to call you Gray." What does Gray do next?' },

  // Entry 3 (ch 105) pages 17-23
  '105-1': { vocabulary_words: ['crashed'], strategy_tip: 'Go to page 17 and think about what goes wrong for Gray once the sun goes down.' },
  '105-2': { strategy_tip: 'On page 18, look for the word "First" to find what Gray crashed into at the start of her nighttime adventure.' },
  '105-3': { vocabulary_words: ['drifted'], strategy_tip: 'On page 23, read Gray\'s thoughts before she falls asleep — what is she really worried about deep down?' },
  '105-4': { strategy_tip: 'On page 19, look at the words around "bolted" — "full speed" and "straight into" help you figure out what bolted means.' },
  '105-5': { strategy_tip: 'On page 23, find the part where Gray crawls into her cardboard box and read what she does next.' },

  // Entry 4 (ch 106) pages 24-30
  '106-1': { vocabulary_words: ['experiments'], strategy_tip: 'Go to page 24 and think about what Gray is trying to figure out in this entry. What is her big question?' },
  '106-2': { strategy_tip: 'On page 25, find Experiment #1 about the pigeons and see what the result was.' },
  '106-3': { strategy_tip: 'On page 28, look at the order of the three experiments — which one is Experiment #3 and what happened?' },
  '106-4': { vocabulary_words: ['connection'], strategy_tip: 'On page 30, read Gray\'s final thoughts — what connection does she make between the girl and her daily visits?' },
  '106-5': { strategy_tip: 'On page 29, imagine a cat tapping something small with her paw — that is what "nudged" looks like.' },

  // Entry 5 (ch 107) pages 31-41
  '107-1': { strategy_tip: 'Go to page 31 where the girl explains what viral means — look for when she says "Millions of people watched your video!"' },
  '107-2': { vocabulary_words: ['compared'], strategy_tip: 'On page 34, find the part where the girl compares Gray to other famous animal videos. What does she say?' },
  '107-3': { vocabulary_words: ['performing'], strategy_tip: 'On page 36, read Gray\'s thoughts about WHY she stops performing — what question is she trying to answer?' },
  '107-4': { strategy_tip: 'On page 37, what does Gray figure out about the girl and why she keeps coming back?' },
  '107-5': { strategy_tip: 'Go through pages 31 to 41 and track when each event happens. What comes first, second, third?' },

  // Entry 6 (ch 108) pages 42-48
  '108-1': { vocabulary_words: ['sprinted'], strategy_tip: 'Go to page 42 and read what Gray does that morning — how does she start her day?' },
  '108-2': { vocabulary_words: ['recognized'], strategy_tip: 'On page 44, think about why kids at a school would already know the name of a stray cat. What made her famous?' },
  '108-3': { strategy_tip: 'On pages 44-45, think about the biggest thing that changes for Gray when she visits the school.' },
  '108-4': { strategy_tip: 'On page 45, this is a comparison using the word "like" — think about how people act when a celebrity shows up.' },
  '108-5': { strategy_tip: 'On page 47, read what Gray thinks about once the cheering fades and she leaves the school.' },

  // Entry 7 (ch 109) pages 49-54
  '109-1': { vocabulary_words: ['experiment'], strategy_tip: 'Go to page 50 and find the part where the girl talks about her science experiment with a flower.' },
  '109-2': { vocabulary_words: ['slouched'], strategy_tip: 'On page 51, compare how the girl sounded yesterday versus today — what changed in her voice and body language?' },
  '109-3': { strategy_tip: 'On page 52, think about what "melting" looks like — losing your shape and going soft. How would a heart "melt"?' },
  '109-4': { strategy_tip: 'On page 53, read the part where the girl announces a plan that upsets Gray. What is it?' },
  '109-5': { strategy_tip: 'On page 53, find the part where the boy shows up and see how the girl reacts differently than before.' },

  // Entry 8 (ch 110) pages 55-59
  '110-1': { vocabulary_words: ['library'], strategy_tip: 'Go to page 55 and find the part where Gray remembers her first library visit from last winter. What happened?' },
  '110-2': { vocabulary_words: ['confident'], strategy_tip: 'On page 56, read what Gray says about herself now compared to last winter — what has changed about how she feels?' },
  '110-3': { strategy_tip: 'On page 55, think about WHY Gray is going to the library — it is not about books! What is her real reason?' },
  '110-4': { strategy_tip: 'On page 58, think about how someone would react if they saw a raccoon on roller skates — that is the level of surprise "shrieked" shows!' },
  '110-5': { strategy_tip: 'On page 59, find the very end of the entry — what does Gray do right before leaving the library?' },

  // Entry 9 (ch 111) pages 60-66
  '111-1': { vocabulary_words: ['recognized'], strategy_tip: 'Go to page 60 and find the part where the librarian appears — does she react the same way as before or differently?' },
  '111-2': { strategy_tip: 'On page 62, look for the strange event that makes Gray question what is happening around the library.' },
  '111-3': { vocabulary_words: ['suspicious'], strategy_tip: 'On page 66, read Gray\'s final thoughts — she lists all the strange events and asks a big question. What is it?' },
  '111-4': { strategy_tip: 'On page 61, strutting means walking in a proud, confident way — picture how a famous person walks down a red carpet.' },
  '111-5': { strategy_tip: 'On page 63, follow what Gray does right after she sees the books perfectly stacked — where does she go next?' },

  // Entry 10 (ch 112) pages 67-70
  '112-1': { vocabulary_words: ['filmed'], strategy_tip: 'Go to page 67 and look for who was holding the camera when the library video was filmed. Who does Gray notice?' },
  '112-2': { vocabulary_words: ['excuses'], strategy_tip: 'On page 68, pay attention to how Gray denies missing the girl but lists funny excuses — does she really mean them?' },
  '112-3': { strategy_tip: 'On page 70, think about what the girl says AND what Gray does — what does this tell you about how they both feel?' },
  '112-4': { strategy_tip: 'On page 69, Gray is bragging about how she looked — "flawless" is the opposite of having flaws or mistakes.' },
  '112-5': { strategy_tip: 'Go to page 67 and read the beginning of the entry — what is the girl doing when she arrives at the alley?' },

  // Entry 11 (ch 113) pages 71-74
  '113-1': { vocabulary_words: ['chaotic'], strategy_tip: 'Go to page 72 and find where the girl describes the snack machine — what crazy thing happened with it?' },
  '113-2': { vocabulary_words: ['nervous'], strategy_tip: 'On page 73, think about what the girl says about not being nervous anymore — what role does Gray play in helping her?' },
  '113-3': { strategy_tip: 'On page 74, read the very last paragraph — what does Gray decide her new job might be?' },
  '113-4': { strategy_tip: 'On page 73, think about what "sticky" and "glitter" would look like together — would it be a mess or organized?' },
  '113-5': { strategy_tip: 'On page 72, look for the word "First" — that tells you which story comes before the glitter incident.' },

  // Entry 12 (ch 114) pages 75-79
  '114-1': { vocabulary_words: ['revealed'], strategy_tip: 'Go to page 76 and find where the girl pulls something out of her backpack — what is the surprise?' },
  '114-2': { vocabulary_words: ['proud'], strategy_tip: 'On page 77, think about what it means for someone to proudly wear your picture — what message does that send?' },
  '114-3': { strategy_tip: 'On page 78, look for the part where the girl leans closer and shares a secret plan. What is her big idea?' },
  '114-4': { strategy_tip: 'On page 77, Gray is looking at the shirt and saying it is her — so "likeness" must mean something that looks just like you.' },
  '114-5': { strategy_tip: 'On page 79, after the girl shows the shirt, what is the next exciting thing she tells Gray about her plan?' },

  // Entry 13 (ch 115) pages 80-85
  '115-1': { vocabulary_words: ['whispered'], strategy_tip: 'Go to page 81 and find the part where the girl lowers her voice and shares something that was not part of the original plan.' },
  '115-2': { vocabulary_words: ['teased', 'confident'], strategy_tip: 'On page 82, compare how the girl used to act around people to how she handles the teasing now. What changed about her?' },
  '115-3': { strategy_tip: 'On page 85, think about Gray\'s whole journey — from stray cat to famous cat with a name. What is the big message?' },
  '115-4': { strategy_tip: 'On page 82, think about what the girl said when kids teased her about the shirt — that was a "comeback," a clever reply.' },
  '115-5': { strategy_tip: 'On page 85, read the last few paragraphs — what two things is Gray thinking about for her future?' },
};

async function main() {
  console.log('Updating Famous Cat quiz questions (vocab + hints)');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

  let updated = 0;
  for (const [key, updates] of Object.entries(UPDATES)) {
    const [chapterId, qNum] = key.split('-').map(Number);

    // Get current question
    const { data: q } = await sb.from('quiz_questions')
      .select('id, vocabulary_words, strategy_tip')
      .eq('chapter_id', chapterId)
      .eq('question_number', qNum)
      .single();

    if (!q) { console.log(`  SKIP ${key}: not found`); continue; }

    const patch = {};
    if (updates.vocabulary_words) {
      // Merge existing + new vocab, deduplicate
      const existing = q.vocabulary_words || [];
      const merged = [...new Set([...existing, ...updates.vocabulary_words])];
      if (JSON.stringify(merged) !== JSON.stringify(existing)) {
        patch.vocabulary_words = merged;
      }
    }
    if (updates.strategy_tip) {
      patch.strategy_tip = updates.strategy_tip;
    }

    if (Object.keys(patch).length === 0) {
      if (!DRY_RUN) console.log(`  SKIP ${key}: no changes`);
      continue;
    }

    if (DRY_RUN) {
      console.log(`  UPDATE ${key} (id=${q.id}):`, JSON.stringify(patch).substring(0, 100));
      updated++;
    } else {
      const { error } = await sb.from('quiz_questions').update(patch).eq('id', q.id);
      if (error) console.error(`  ERROR ${key}:`, error.message);
      else { updated++; }
    }
  }

  console.log(`\nTotal: ${updated} questions ${DRY_RUN ? 'would be' : ''} updated.`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
