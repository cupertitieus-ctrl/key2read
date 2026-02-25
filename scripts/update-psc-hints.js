#!/usr/bin/env node
// ============================================================
// Update Purple Space Chickens quiz hints with page references
// ============================================================
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Page ranges per chapter (from the original seed data)
// Ch1: pages 6-11, Ch2: pages 13-20, Ch3: pages 24-29
// Ch4: pages 32-43, Ch5: pages 45-52, Ch6: pages 56-64
// Ch7: pages 65-76, Ch8: pages 83-96, Ch9: pages 99-104

const HINTS = {
  // Chapter 1: Code Names (chapter_id = 13)
  1591: 'Go to page 10 — Bear shares something surprising about himself!',
  1592: 'Go to page 8 — Bear introduces a furry family member!',
  1593: 'Go to page 7 — something funny happened with ice cream!',
  1594: 'Go to page 6 — Bear explains why he uses a secret name!',
  1595: 'Look at pages 8–11 — notice what Bear enjoys and how he talks about things!',
  1596: 'Look at pages 6–11 — think about how Bear reacts to things around him!',
  1597: 'Look at pages 6–11 — think about what we learn about the characters!',

  // Chapter 2: Extraordinary Garden (chapter_id = 14)
  1620: 'Go to page 14 — Bear sees something very unusual in the dirt!',
  1621: 'Go to page 18 — see who picks up the little chicken!',
  1622: 'Go to page 17 — Bear thinks about what to do with her!',
  1623: 'Go to page 14 — the author describes the helmet compared to the chicken!',
  1624: 'Go to pages 14–16 — watch how Bear reacts when he first sees her!',
  1625: 'Look at pages 17–20 — think about what a good pet owner would do!',
  1626: 'Look at pages 13–20 — think about the big events from start to finish!',

  // Chapter 3: Morning Walk (chapter_id = 15)
  1642: 'Go to page 24 — the chapter starts with them heading somewhere!',
  1643: 'Go to page 25 — Bear keeps thinking about something in his bag!',
  1645: 'Go to page 26 — Bear is worried about someone finding out!',
  1647: 'Go to page 24 — notice what Sprinkles keeps talking about!',
  1649: 'Look at pages 25–28 — watch how Bear acts the whole time!',
  1651: 'Look at pages 25–29 — think about what would make things easier for Bear!',
  1653: 'Look at pages 24–29 — notice how Bear and Sprinkles interact!',

  // Chapter 4: Nugget Goes to School (chapter_id = 16)
  1664: 'Go to page 40 — Nugget does something amazing with her feathers!',
  1665: 'Go to page 39 — someone notices something moving in Bear\'s stuff!',
  1666: 'Go to page 40 — Nugget\'s trick makes her look like something else!',
  1667: 'Go to page 40 — the author shows how Nugget suddenly stops moving!',
  1668: 'Go to pages 39–41 — think about what happened from Nugget\'s point of view!',
  1669: 'Look at pages 39–43 — think about what almost went wrong!',
  1670: 'Look at pages 32–43 — think about the biggest moment in this chapter!',

  // Chapter 5: Bathroom Stall (chapter_id = 17)
  1681: 'Go to page 49 — something big happens the second Bear grabs her!',
  1682: 'Go to pages 45–46 — Bear needs a private place to check on Nugget!',
  1683: 'Go to page 46 — Bear wants to make sure the little chicken is okay!',
  1684: 'Go to page 49 — the light goes off in a big, sudden way!',
  1685: 'Go to pages 50–52 — notice how everything looks and feels different!',
  1686: 'Go to page 52 — think about the strange place they ended up!',
  1687: 'Look at pages 45–52 — think about the biggest discovery in this chapter!',

  // Chapter 6: Bob's Burger Barn (chapter_id = 18)
  1693: 'Go to page 57 — Bear is hungry after the wild ride!',
  1694: 'Go to page 56 — Bear tucks Nugget somewhere cozy!',
  1695: 'Go to page 60 — Bear sees someone who needs help outside!',
  1696: 'Go to page 63 — the author describes how Bear travels back!',
  1697: 'Go to pages 56–58 — think about how risky it is to have a chicken in public!',
  1698: 'Look at pages 56–64 — think about all the close calls in this chapter!',
  1699: 'Look at pages 56–64 — think about everything Bear does from start to finish!',

  // Chapter 7: Rescue Homework (chapter_id = 19)
  1705: 'Go to page 65 — Bear searches his backpack and panics!',
  1706: 'Go to page 72 — Bear asks his little friend for a big favor!',
  1707: 'Go to page 72 — Bear figures out he needs to explain WHY it helps!',
  1708: 'Go to page 72 — Bear talks to Nugget in a special way!',
  1709: 'Go to pages 68–71 — see what happens when nothing works at first!',
  1710: 'Look at pages 65–76 — think about what lesson Bear learns!',
  1711: 'Look at pages 65–76 — think about the problem and how it got solved!',

  // Chapter 8: The Spill (chapter_id = 20)
  1722: 'Go to page 84 — Strawberry\'s elbow knocks something over!',
  1723: 'Go to page 88 — Strawberry needs something to wear!',
  1724: 'Go to page 92 — think about what Nugget does when someone gets close!',
  1725: 'Go to page 92 — Strawberry recognizes something from before!',
  1728: 'Go to page 88 — Bear suddenly remembers what\'s hidden in the pocket!',
  1730: 'Look at pages 88–96 — think about how Bear can keep his secret safe!',
  1732: 'Look at pages 83–96 — think about what the biggest problem was!',

  // Chapter 9: How Will I Get Home? (chapter_id = 21)
  1741: 'Go to page 99 — something bright green goes everywhere!',
  1743: 'Go to page 102 — Bear looks around and sees something very different!',
  1744: 'Go to page 100 — Bear needs to wash something off his hands!',
  1746: 'Go to page 102 — notice that Nugget didn\'t mean to do it this time!',
  1748: 'Go to pages 102–103 — think about how different this place is from school!',
  1749: 'Look at page 104 — Bear has some big questions to figure out!',
  1750: 'Look at pages 99–104 — think about the biggest surprise in the chapter!',
};

async function updateHints() {
  console.log('🔧 Updating Purple Space Chickens quiz hints with page references...\n');

  let updated = 0;
  let errors = 0;

  for (const [idStr, hint] of Object.entries(HINTS)) {
    const id = parseInt(idStr);
    const { error } = await supabase
      .from('quiz_questions')
      .update({ strategy_tip: hint })
      .eq('id', id);

    if (error) {
      console.log(`  ❌ id=${id}: ${error.message}`);
      errors++;
    } else {
      updated++;
    }
  }

  console.log(`\n✅ Updated ${updated} hints (${errors} errors)`);

  // Verify a sample
  const { data: sample } = await supabase
    .from('quiz_questions')
    .select('id, question_number, strategy_tip')
    .eq('chapter_id', 13)
    .order('question_number')
    .limit(3);

  console.log('\n📋 Sample (Chapter 1):');
  sample?.forEach(q => {
    console.log(`  Q${q.question_number}: ${q.strategy_tip}`);
  });
}

updateHints().catch(e => { console.error(e); process.exit(1); });
