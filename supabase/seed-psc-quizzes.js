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
    summary: 'Bear introduces himself and his code name, explains how his sister Sprinkles got her nickname, describes his golden retriever Fluff, and reveals his love for gardening. He hints that something in his garden changed everything.',
    key_vocabulary: ['code name', 'document', 'obsessed', 'enclosure', 'extraordinary'],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'Why does Bear use a code name instead of his real name?', passage_excerpt: "I don't want you knowing who I really am because the last thing I need is NASA asking a dozen questions—or worse, taking my little friend.", options: ['He thinks code names sound cool', 'He wants to protect his identity and his friend from NASA', 'His teacher told him to use one', 'He forgot his real name'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look for the reason Bear gives for hiding his identity.', explanation: 'Bear says he uses a code name because he does not want NASA asking questions or taking his little friend.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'How did Sprinkles get her code name?', passage_excerpt: 'One day, while trying to impress her crush, a bowl of sprinkle-covered ice cream somehow landed on her face.', options: ['She loves rainbow sprinkles on pancakes', 'She spilled sprinkle-covered ice cream on her face', 'Her mom named her that as a baby', 'She won a sprinkle-eating contest'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Find the specific event that led to the nickname.', explanation: 'Sprinkles got her name when she spilled a bowl of sprinkle-covered ice cream on her face trying to impress her crush.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What is special about Bear compared to most kids his age?', passage_excerpt: "One personal thing I will tell you about me is that I have a green thumb—not an actual green thumb, of course. But that's what they call people that love to garden.", options: ['He is really tall for his age', 'He loves gardening and has a green thumb', 'He can run faster than anyone', 'He speaks three languages'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look for what Bear says makes him different.', explanation: 'Bear says he has a green thumb, meaning he loves to garden, which he admits is unusual for a kid.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What can you infer about the relationship between Bear and Sprinkles?', passage_excerpt: "It's funny, though; even with all our differences, we somehow always seem to agree on the big stuff.", options: ['They do not get along at all', 'They are close despite being very different from each other', 'They never talk to each other', 'They are exactly alike in every way'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Think about what Bear says about their differences AND similarities.', explanation: 'Even though Bear and Sprinkles are opposites in many ways, Bear says they always agree on the big stuff, showing they are close.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'Why did Bear\'s mom build an enclosure around the garden?', passage_excerpt: 'Surrounded by a pretty cool enclosure my mom built to stop Fluff from burying things everywhere and to keep out the sneaky stray cat that loves to eat my blueberries.', options: ['To make the garden look pretty', 'To stop Fluff from burying things and keep the stray cat out', 'To protect the garden from rain', 'To give Bear a place to play'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Find the two reasons the enclosure was built.', explanation: 'The enclosure was built to stop Fluff from burying things and to keep the stray cat from eating the blueberries.' }
    ]
  },
  {
    chapter_number: 2,
    title: 'Extraordinary Garden',
    summary: 'On a Monday morning, Bear checks his garden and finds a cage door open. Behind a bush he discovers a tiny, purple, tennis-ball-sized chicken wearing a miniature astronaut helmet. He carefully places her in his backpack using a sock as a nest and names her Nugget.',
    key_vocabulary: ['rustling', 'miniature', 'ironically', 'hesitated', 'astronaut'],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'What was the first sign that something was wrong in the garden?', passage_excerpt: 'From a distance, everything looked normal—until I noticed something strange. One of the cage doors was wide open!', options: ['The plants were all dead', 'One of the cage doors was wide open', 'Fluff was barking at the fence', 'There was a strange noise from the sky'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look for what Bear noticed first.', explanation: 'Bear noticed that one of the cage doors on the garden enclosure was wide open.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'How big was the chicken Bear found?', passage_excerpt: 'There, hiding among the blueberries, was a miniature version of a full-grown chicken…and it was purple! It was the size of a tennis ball.', options: ['The size of a basketball', 'The size of a tennis ball', 'The size of a watermelon', 'The size of a golf ball'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Find the comparison Bear uses to describe the size.', explanation: 'The chicken was the size of a tennis ball.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'Why did Bear hesitate before touching the chicken?', passage_excerpt: 'I wanted to reach out and touch her, but then I hesitated. What if she bites me? No hospital knows how to handle a purple chicken bite!', options: ['He was afraid she might fly away', 'He was worried she might bite him and no hospital could treat it', 'He thought she was a robot', 'He did not want to get his hands dirty'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Think about what worried Bear about touching something unknown.', explanation: 'Bear hesitated because he was afraid the chicken might bite him and no hospital would know how to treat a purple chicken bite.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'How did Bear convince the chicken to get into his backpack?', passage_excerpt: 'Then I got the idea to place the tiny helmet inside the sock nest, hoping that would encourage her.', options: ['He put food inside the pocket', 'He placed the chicken\'s tiny helmet inside the sock nest', 'He pushed her in with his hand', 'He asked Sprinkles to help'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look for what clever idea Bear had.', explanation: 'Bear placed the tiny helmet inside the sock nest in his backpack pocket, which encouraged the chicken to hop in.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'Why did Bear name the chicken Nugget?', passage_excerpt: "That's when I decided to name her Nugget. It just seemed perfect for this tiny space-exploring chicken.", options: ['Because she was golden colored', 'Because the name seemed perfect for a tiny space-exploring chicken', 'Because she liked to eat chicken nuggets', 'Because his sister suggested the name'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Think about why Nugget is a fitting name.', explanation: 'Bear chose the name Nugget because it seemed perfect for such a tiny, space-exploring chicken.' }
    ]
  },
  {
    chapter_number: 3,
    title: 'Morning Walk',
    summary: 'Bear and Sprinkles walk to school together. Sprinkles complains about her math test while Bear worries about keeping Nugget hidden. When Nugget chirps, Bear covers it with a loud cough. Sprinkles is suspicious but they make it to school without the secret being discovered.',
    key_vocabulary: ['suspicion', 'skeptical', 'casual', 'frantically', 'doomed'],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'What subject is Sprinkles worried about?', passage_excerpt: "We're talking long division, fractions, decimals, and—oh yeah—those weird squiggly lines.", options: ['Science', 'English', 'Math', 'History'], correct_answer: 2, strategy_type: 'finding-details', strategy_tip: 'Look for the school subject Sprinkles mentions.', explanation: 'Sprinkles is worried about her math test, mentioning long division, fractions, and decimals.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'How did Bear cover up Nugget\'s chirp?', passage_excerpt: 'Nugget gave a tiny chirp. My eyes widened, and I immediately started coughing loudly to mask the sound.', options: ['He turned on loud music', 'He started coughing loudly to cover the sound', 'He told Sprinkles it was a bird outside', 'He pretended to sneeze'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Find what Bear did right after Nugget chirped.', explanation: 'Bear started coughing loudly to mask the sound of Nugget chirping.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What does Sprinkles threaten to do if she gets sick from Bear?', passage_excerpt: "If I wake up tomorrow feeling horrible, you're doing my math test for me.", options: ['Tell their mom on him', 'Make him do her math test for her', 'Never walk to school with him again', 'Take his backpack'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look for what Sprinkles says will happen if she catches his sickness.', explanation: 'Sprinkles says if she gets sick, Bear has to do her math test for her.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What was Bear really thinking about during the walk?', passage_excerpt: 'All I could think about was the tiny little alien bird in my bag. Was Nugget bored? Was she plotting her escape? Did she understand long division better than me?', options: ['His own homework that was due', 'Whether Nugget was okay and what she was thinking', 'What he wanted for lunch', 'How to run faster to school'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Think about what was really on Bear\'s mind versus what he showed Sprinkles.', explanation: 'While pretending to listen to Sprinkles, Bear was really thinking about Nugget and wondering if she was bored or planning an escape.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'What does Bear worry about at the end of the chapter?', passage_excerpt: 'Could I really keep a chicken in my backpack ALL day and no one notice?', options: ['Whether Sprinkles will pass her test', 'Whether he can keep Nugget hidden in his backpack all day', 'Whether Fluff is okay at home', 'Whether it will rain during recess'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look at the last lines of the chapter for Bear\'s main concern.', explanation: 'Bear worries whether he can keep a chicken hidden in his backpack the entire school day without anyone noticing.' }
    ]
  },
  {
    chapter_number: 4,
    title: 'Nugget Goes to School',
    summary: 'At school, Bear meets his friends Red, Numbers, and Strawberry. Nugget pokes her head out of the backpack and Strawberry sees her, but Nugget freezes into a puffed-up toy-like form. Strawberry thinks Nugget is just a strange toy. Bear narrowly keeps his secret.',
    key_vocabulary: ['obsession', 'crimson', 'suspicious', 'mechanism', 'convinced'],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'Why is Red called Red?', passage_excerpt: 'Red got his nickname because of his obsession with red shoelaces—he wears them no matter what shoes he has on.', options: ['He has red hair', 'He always wears red shoelaces', 'His favorite food is red apples', 'He blushes a lot'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look for the specific reason behind Red\'s code name.', explanation: 'Red got his nickname because he is obsessed with red shoelaces and wears them on every pair of shoes.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What special ability does Nugget show when Strawberry spots her?', passage_excerpt: 'Her whole body expanded like she was channeling her inner pufferfish! Her helmet popped off, and her feathers transformed into soft, cloud-like fuzz that made her look more like a... fluffy chicken toy!', options: ['She turned invisible', 'She expanded and transformed to look like a fluffy toy', 'She flew up to the ceiling', 'She started talking'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look for how Nugget\'s body changed when she was spotted.', explanation: 'When spotted, Nugget puffed up like a pufferfish and her feathers turned into cloud-like fuzz, making her look like a toy.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What excuse does Bear give for having Nugget?', passage_excerpt: '"Oh, my dad brought it back for me... you know, from one of his trips."', options: ['He says he won it at a fair', 'He says his dad brought it from one of his trips', 'He says he made it in art class', 'He says he found it on the bus'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Find the specific lie Bear tells Strawberry.', explanation: 'Bear tells Strawberry that his dad brought the toy back from one of his trips.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'Why is Bear especially worried about Strawberry finding out?', passage_excerpt: "She knew me better than anyone. If I so much as moved the wrong way, she'd start asking questions. I always told her everything—how was I going to keep this a secret?", options: ['Because Strawberry is a tattletale', 'Because Strawberry knows him better than anyone and he always tells her everything', 'Because Strawberry is scared of animals', 'Because Strawberry is a teacher\'s pet'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Think about what makes Strawberry different from his other friends.', explanation: 'Bear worries because Strawberry knows him better than anyone and he always tells her everything, making it hard to keep secrets from her.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'What does Strawberry always bring Bear at lunch?', passage_excerpt: 'She always brings me an extra bag of strawberries at lunch, Every. Single. Day.', options: ['A sandwich', 'An extra bag of strawberries', 'A juice box', 'Cookies'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look for what Strawberry shares with Bear daily.', explanation: 'Strawberry brings Bear an extra bag of strawberries at lunch every single day.' }
    ]
  },
  {
    chapter_number: 5,
    title: 'Bathroom Stall',
    summary: 'At lunchtime, Bear takes Nugget to the school bathroom to check on her. When he grabs Nugget, a burst of purple light teleports them both to a different bathroom — at Bob\'s Burger Barn, Bear\'s favorite restaurant!',
    key_vocabulary: ['teleportation', 'weightless', 'vengeance', 'teleporting', 'unmistakable'],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'Why did Bear choose the bathroom to check on Nugget?', passage_excerpt: "That left only one place that offered some privacy... the school bathroom.", options: ['It was the closest room', 'It was the only place private enough where nobody would bother him', 'He needed to wash his hands', 'His teacher told him to go there'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Think about why Bear ruled out every other option.', explanation: 'Bear ruled out the janitor\'s closet, classrooms, and the gym because none were private enough. The bathroom was the only place that offered privacy.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What triggered the first teleportation?', passage_excerpt: 'The second I touched her, the world exploded into a burst of purple light, like someone had fired glittery confetti out of a cannon.', options: ['Bear said a magic word', 'Bear touched Nugget with both hands', 'Nugget pressed a button on her helmet', 'Bear flushed the toilet'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look for what happened right before the teleportation started.', explanation: 'The teleportation happened the second Bear touched Nugget, causing an explosion of purple light.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'How did the teleportation feel to Bear?', passage_excerpt: 'My stomach flipped like I was on the world\'s worst roller coaster, and everything around me blurred into swirling streaks of color.', options: ['It felt calm and relaxing', 'It felt like the worst roller coaster with his stomach flipping', 'He did not feel anything at all', 'It felt like falling asleep'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Find how Bear describes the physical sensation.', explanation: 'Bear says his stomach flipped like being on the worst roller coaster and everything blurred into swirling colors.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'Where did Bear and Nugget end up after teleporting?', passage_excerpt: 'The air was thick with the unmistakable smell of crispy fries, sizzling burgers, and warm, buttery buns.', options: ['At their house', 'At a restaurant called Bob\'s Burger Barn', 'At the park', 'At NASA headquarters'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Use the smell clues to figure out where they landed.', explanation: 'The smell of fries and burgers told Bear they had teleported to Bob\'s Burger Barn, his favorite restaurant.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'How did Nugget react after teleporting Bear?', passage_excerpt: 'She looked as cute as ever, like this was just another day in her wild chicken life... completely unbothered, as if teleporting me was no big deal.', options: ['She was scared and shaking', 'She was completely unbothered, like it was no big deal', 'She fell asleep immediately', 'She started clucking loudly'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Look at how Nugget acted compared to Bear after the teleportation.', explanation: 'Unlike Bear who was shocked, Nugget was completely unbothered, acting like teleportation was just a normal thing.' }
    ]
  },
  {
    chapter_number: 6,
    title: "Bob's Burger Barn",
    summary: 'Bear hides Nugget in his hoodie hood and orders a burger. He helps an elderly woman step up onto a curb. Then he goes back to the bathroom, grabs Nugget, thinks about the school bathroom, and teleports back to school just in time.',
    key_vocabulary: ['circumstances', 'transaction', 'satisfaction', 'coincidence', 'polite'],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'Where did Bear hide Nugget inside the restaurant?', passage_excerpt: 'I carefully placed Nugget into the hood of my hoodie, adjusting it so she fit snugly like a fluffy little pillow.', options: ['In his pants pocket', 'In the hood of his hoodie', 'Under a table', 'Inside a burger bag'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Find where Bear put Nugget before entering the dining area.', explanation: 'Bear placed Nugget in the hood of his hoodie so she would be hidden while he walked through the restaurant.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What kind act did Bear do at the restaurant?', passage_excerpt: '"Do you need some help?" I asked politely. I offered my arm, giving her something to lean on as she made her way up the step.', options: ['He cleaned up a spill', 'He helped an elderly woman step up onto the curb', 'He gave his food to a hungry kid', 'He picked up trash outside'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look for the moment Bear helps someone.', explanation: 'Bear helped an elderly woman who was struggling to step up onto the curb outside the restaurant.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'How was the second teleportation different from the first?', passage_excerpt: "The world gave a lazy spin, like a carnival ride on half power... No blinding light show this time—just a gentle pop.", options: ['It was much scarier and louder', 'It was gentler and smoother than the first time', 'It did not work at all', 'It took them to the wrong place'], correct_answer: 1, strategy_type: 'comparing-contrasting', strategy_tip: 'Compare how the second teleportation felt versus the first.', explanation: 'The second teleportation was much gentler than the first, described as a lazy spin with just a gentle pop instead of an explosion of light.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What does Bear wonder about the teleportation pattern?', passage_excerpt: "Was Nugget's power guiding me to help people? Or was it just a coincidence?", options: ['He wonders if it only works on Mondays', 'He wonders if the teleportation is connected to helping people', 'He wonders if it only works with food nearby', 'He wonders if Sprinkles can teleport too'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Think about what Bear noticed happening before the teleportation worked.', explanation: 'Bear wonders if Nugget\'s power is connected to helping people, since the teleportation happened after he helped the elderly woman.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'What pattern does Bear notice about WHERE the teleportation works?', passage_excerpt: "Teleporting with a chicken? Twice in one day?... bathroom teleportation was both amazing and gross.", options: ['It only works outdoors', 'It only works from one bathroom to another bathroom', 'It only works at school', 'It works anywhere Nugget wants'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Think about where Bear started and ended up both times.', explanation: 'Bear notices that both teleportations went from one bathroom to another, suggesting the power only works bathroom to bathroom.' }
    ]
  },
  {
    chapter_number: 7,
    title: 'Rescue Homework',
    summary: 'Bear realizes he forgot his homework at home. He sneaks to the bathroom with Nugget and tries to teleport home. It fails at first, but when Bear explains how much getting his homework would help him, Nugget teleports them to his home bathroom. He grabs the homework, avoids his mom, and teleports back to school just in time.',
    key_vocabulary: ['frantically', 'emphasizing', 'concentrating', 'beeline', 'grateful'],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'Why was Bear panicking at the start of English class?', passage_excerpt: 'I had forgotten my homework! My heart started pounding as I frantically searched through my backpack.', options: ['He lost his pencil', 'He realized he forgot his homework at home', 'He was late to class', 'He could not find Nugget'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look for what Bear discovers is missing.', explanation: 'Bear panicked because he realized his homework was still sitting on his desk at home.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'Why did the first teleportation attempt fail?', passage_excerpt: 'But nothing happened! I opened my eyes, only to see Nugget staring back at me, completely confused.', options: ['Bear was not in a bathroom', 'Nugget was asleep', 'Bear had not explained how it would help him', 'The helmet was broken'], correct_answer: 2, strategy_type: 'making-inferences', strategy_tip: 'Think about what Bear did differently the second time that made it work.', explanation: 'The first attempt failed because Bear just concentrated on the location. The second time he explained to Nugget how getting his homework would really help him, connecting to the helping-others pattern.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What did Bear say to convince Nugget to teleport?', passage_excerpt: '"Getting my homework would really help me. I worked hard on it, and if I don\'t turn it in, my grade will go down."', options: ['He promised Nugget extra blueberries', 'He explained how getting his homework would really help him', 'He threatened to leave Nugget at school', 'He showed Nugget a picture of his house'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Find what Bear said differently on his second attempt.', explanation: 'Bear told Nugget that getting his homework would really help him and that his grade would go down without it.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What almost went wrong at Bear\'s house?', passage_excerpt: '"Bear? Is that you? Did you come home early?" I froze.', options: ['Fluff started barking at Nugget', 'His mom heard him and called out to him', 'Sprinkles was already home', 'He could not find his homework'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look for the moment of danger at Bear\'s house.', explanation: 'Bear\'s mom heard him and called out, almost catching him at home when he should have been at school.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'What important lesson did Bear learn about Nugget\'s teleportation?', passage_excerpt: "Was her teleportation tied to me helping people? Maybe she needed to understand how much this could help me.", options: ['The teleportation only works once per day', 'The teleportation seems connected to helping — Nugget needs to understand how it helps', 'The teleportation only works when Nugget is hungry', 'The teleportation gets weaker each time'], correct_answer: 1, strategy_type: 'identifying-theme', strategy_tip: 'Think about the pattern Bear is starting to figure out.', explanation: 'Bear learns that Nugget\'s teleportation seems tied to helping people — Nugget needs to understand how the trip will help someone before she will teleport.' }
    ]
  },
  {
    chapter_number: 8,
    title: 'The Spill',
    summary: 'In art class, Bear takes off his hoodie with Nugget in the pocket. Strawberry spills paint on her sweatshirt and borrows Bear\'s hoodie — with Nugget still inside! Strawberry finds Nugget in the pocket but since Nugget is in toy mode again, she thinks it is the same strange toy from earlier. Bear manages to get Nugget back.',
    key_vocabulary: ['abstract', 'splatters', 'furiously', 'obsession', 'embarrassed'],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'Why did Bear take off his hoodie in art class?', passage_excerpt: 'Before I got too caught up in painting, I decided to take off my hoodie to avoid getting paint on it.', options: ['He was too hot', 'He wanted to avoid getting paint on it', 'The teacher told him to', 'Nugget was making it move'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look for Bear\'s reason for removing his hoodie.', explanation: 'Bear took off his hoodie so he would not get paint on it during art class.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'What happened to Strawberry\'s sweatshirt?', passage_excerpt: 'Her elbow knocking over a full cup of paint. The vibrant blue liquid spilled everywhere, splattering across her canvas, desk, and—worst of all—her favorite sweatshirt.', options: ['She ripped it on a nail', 'Blue paint spilled all over it when she knocked over a cup', 'She forgot it at home', 'Someone stole it from her chair'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Find exactly what happened to ruin the sweatshirt.', explanation: 'Strawberry accidentally knocked over a cup of blue paint which splattered all over her favorite sweatshirt.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'Why was Bear panicking when Strawberry put on his hoodie?', passage_excerpt: '"Sure, no problem," I managed to say, forgetting about one important detail…. Nugget\'s in the pocket!', options: ['He did not want anyone wearing his clothes', 'He forgot Nugget was hidden in the hoodie pocket', 'The hoodie had a hole in it', 'He had money hidden in the pocket'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Think about what Bear forgot when he said yes.', explanation: 'Bear panicked because he forgot that Nugget was still hidden in the hoodie pocket when Strawberry put it on.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'How did Nugget save herself from being discovered again?', passage_excerpt: 'She pulled Nugget out, holding her up with a mix of curiosity and confusion. "This is that toy you had earlier…"', options: ['She turned invisible', 'She froze into toy mode again so Strawberry thought she was just a toy', 'She ran away and hid under a desk', 'Bear distracted Strawberry with a joke'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look for how Nugget protected herself.', explanation: 'Nugget froze into her puffed-up toy mode again, so Strawberry just thought it was the same weird toy from earlier.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'What does Strawberry now think about Bear after this chapter?', passage_excerpt: "Now Strawberry thinks I have a stomach issue from the emergency bathroom trip and an odd obsession with a chicken toy…", options: ['She thinks he is hiding something serious', 'She thinks he has a stomach issue and a weird obsession with a chicken toy', 'She thinks he is totally normal', 'She thinks he is playing a prank on her'], correct_answer: 1, strategy_type: 'making-inferences', strategy_tip: 'Think about what Strawberry has seen Bear do throughout the day.', explanation: 'After the bathroom trips and finding the toy twice, Strawberry now thinks Bear has stomach issues and a strange obsession with a chicken toy.' }
    ]
  },
  {
    chapter_number: 9,
    title: 'How Will I Get Home?',
    summary: 'In science class, Bear spills green food coloring on his hands and goes to the bathroom to wash up. While rinsing, Nugget accidentally teleports them again — but this time they do not land in a bathroom. They end up in the woods, surrounded by tall trees, with no idea how to get home.',
    key_vocabulary: ['instinctively', 'sensation', 'substances', 'unbearable', 'teleport'],
    questions: [
      { question_number: 1, question_type: 'multiple-choice', question_text: 'What went wrong in science class?', passage_excerpt: 'Splat!—The whole cup tipped over, spilling bright green liquid all over my hands.', options: ['Bear broke a beaker', 'Bear spilled green food coloring all over his hands', 'Bear mixed the wrong chemicals', 'Bear dropped his notebook in the experiment'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look for the specific accident that happened.', explanation: 'Bear accidentally tipped over his cup and spilled bright green food coloring all over his hands.' },
      { question_number: 2, question_type: 'multiple-choice', question_text: 'Why did Bear go to the bathroom instead of using the classroom sink?', passage_excerpt: 'The line was moving slower than a sloth on a rainy day. No way was I waiting in that line.', options: ['The classroom sink was broken', 'The line for the classroom sink was way too long', 'The teacher told him to use the bathroom', 'He wanted to check on Nugget'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Find why Bear chose the bathroom over the classroom sink.', explanation: 'The line for the classroom sink was moving so slowly that Bear decided to just go to the bathroom instead.' },
      { question_number: 3, question_type: 'multiple-choice', question_text: 'What was different about this teleportation?', passage_excerpt: 'When the light dimmed, I found myself not in another bathroom. Tall trees towered over me.', options: ['It was faster than before', 'They did not land in a bathroom — they ended up in the woods', 'Nothing was different', 'They went back in time'], correct_answer: 1, strategy_type: 'comparing-contrasting', strategy_tip: 'Compare where they ended up this time versus the previous teleportations.', explanation: 'Unlike every other teleportation which went bathroom to bathroom, this time they ended up in the woods surrounded by tall trees.' },
      { question_number: 4, question_type: 'multiple-choice', question_text: 'What does Bear notice about where they landed?', passage_excerpt: 'I could feel a cool breeze on my face. And it smelled earthy with a touch of pine.', options: ['They are on a beach', 'They are in a forest with trees, leaves, and dirt', 'They are inside a mall', 'They are in another school'], correct_answer: 1, strategy_type: 'finding-details', strategy_tip: 'Look for the details Bear notices about his surroundings.', explanation: 'Bear notices tall trees, crunchy leaves, dirt, a cool breeze, and the earthy smell of pine — they are in a forest.' },
      { question_number: 5, question_type: 'multiple-choice', question_text: 'Why is the ending of this chapter a cliffhanger?', passage_excerpt: 'Did Nugget teleport me to the woods? Seriously? Why am I here? And how do I get home?', options: ['Bear falls asleep in the woods', 'Bear is stuck in the woods with no idea why or how to get home', 'Bear finds another purple chicken', 'Bear wakes up and it was all a dream'], correct_answer: 1, strategy_type: 'identifying-theme', strategy_tip: 'Think about what questions are left unanswered at the end.', explanation: 'The chapter ends with Bear stranded in an unknown forest, not knowing why Nugget brought him there or how he will get home — leaving the reader wanting to know what happens next.' }
    ]
  }
];

async function seedQuizzes() {
  console.log('📝 Seeding Purple Space Chickens — Chapters & Quizzes\n');

  // Find the Purple Space Chickens book
  const { data: bookRows } = await supabase.from('books').select('id, title').eq('title', 'Purple Space Chickens');
  if (!bookRows || bookRows.length === 0) {
    console.error('❌ Book "Purple Space Chickens" not found. Run seed.js first.');
    process.exit(1);
  }
  const bookId = bookRows[0].id;
  console.log(`📖 Found book: ${bookRows[0].title} (id: ${bookId})\n`);

  // Clear existing chapters and questions for this book
  const { data: existingChapters } = await supabase.from('chapters').select('id').eq('book_id', bookId);
  if (existingChapters && existingChapters.length > 0) {
    const chapterIds = existingChapters.map(c => c.id);
    await supabase.from('quiz_questions').delete().in('chapter_id', chapterIds);
    await supabase.from('chapters').delete().eq('book_id', bookId);
    console.log('⚠️  Cleared existing chapters & questions for this book.\n');
  }

  let totalQuestions = 0;

  for (const ch of chapters) {
    // Insert chapter
    const { data: inserted, error: chErr } = await supabase.from('chapters').insert({
      book_id: bookId,
      chapter_number: ch.chapter_number,
      title: ch.title,
      summary: ch.summary,
      key_vocabulary: ch.key_vocabulary
    }).select().single();

    if (chErr) { console.error(`❌ Chapter ${ch.chapter_number}:`, chErr.message); continue; }
    console.log(`  ✅ Ch ${ch.chapter_number}: ${ch.title}`);

    // Insert questions
    for (const q of ch.questions) {
      const { error: qErr } = await supabase.from('quiz_questions').insert({
        chapter_id: inserted.id,
        question_number: q.question_number,
        question_type: q.question_type,
        question_text: q.question_text,
        passage_excerpt: q.passage_excerpt,
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
