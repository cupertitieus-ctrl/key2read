require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const summaries = {
  1: "On his birthday, the narrator goes garage sale shopping with his mom, a yearly tradition where he gets twenty dollars to buy other people's junk. At the last house on the street, an old man lets him take a dusty aquarium for free, which contains a giant stick, a weird egg-shaped rock, and a leather-bound notebook with the word DRAGON burned into the spine. The notebook has only one entry from a previous owner who believed the rock was a dragon egg. The narrator decides to keep watching the rock and document everything in the notebook, beginning Entry One.",

  2: "On Sunday, the narrator spends the afternoon staring at the rock in the aquarium, wondering if it could actually be a dragon egg. He thinks about how dragons are the ultimate pet because they can fly, breathe fire, and appear in stories from cultures all over the world. After researching his dragon books, he learns that dragon eggs might look like polished river stones, hatch only for the right person, and require volcano-level heat. He grabs his mom's fancy blow-dryer and aims it at the rock on the warm setting, hoping to simulate volcanic heat to hatch the egg.",

  3: "On Monday, day two of blow-drying the rock, the narrator notices it is slightly warmer but otherwise unchanged. He realizes school starts in two weeks and worries the egg might hatch while he is gone. He explains that his family moves frequently because his dad works in tech and keeps getting promoted to places with bad Wi-Fi. They recently moved to a small town where the internet is so slow that video games constantly glitch and freeze, making him even more eager for the rock to hatch into something exciting.",

  4: "On Tuesday, the narrator's mom catches him blow-drying the rock but is too tired to ask questions. She suggests they go out for fresh air and a haircut in town. While driving, the narrator spots real LOST BULL signs warning that a bull is on the loose, described as not friendly with a one-hundred-dollar reward. At the barbershop, they see a kid getting an actual bowl cut with a cereal bowl on his head, and they silently agree to skip the haircut and go home.",

  5: "On Wednesday, the narrator finds a lizard hiding behind boxes in his bedroom while unpacking. The lizard does not run or flinch and looks like a pet, not a wild animal. He names the lizard Ziggy and places him in the aquarium with the rock. Ziggy immediately walks over to the rock and curls up around it like he has been waiting for it his whole life. The narrator is about eighty-nine percent sure Ziggy is a bearded dragon, which feels like a sign.",

  6: "On Thursday, the narrator introduces Ziggy to his parents. His dad is anti-reptile but has a weakness for animals that find you, having previously nursed a pigeon, kept a pet squirrel that wore a cowboy hat, and secretly fed a stray cat at his office for a year. His mom is relieved Ziggy is not a snake, since she has a huge fear of snakes and once made the narrator release a garden snake he named Slinky. His mom agrees to go to the pet store the next day to get proper food and a heat lamp for Ziggy.",

  7: "On Friday, the narrator and his mom visit the pet store where they meet Carl, an employee with an unusually deep passion for bearded dragons. Carl gives an exhaustive lecture on feeding tips, habitat temperatures, UVB light requirements, and even how to throw a lizard birthday party. When Carl hands them a container of live bugs and explains that bearded dragons need live insects to hunt, the narrator's mom nearly throws up. They quickly buy a heat lamp, crickets, a ledge rock, and a proper lid for the tank before Carl can finish talking.",

  8: "On Saturday morning, the narrator wakes to thumping noises and discovers the rock is bouncing and jumping inside the aquarium while Ziggy sleeps peacefully. When he removes the lid to look closer, the rock launches out of the tank, hits the floor, and starts to glow. In a panic, the narrator kicks the glowing rock into his closet, slams the door shut, and pushes a chair in front of it. He puts the lid back on the tank to keep Ziggy safe, then watches the mysterious glow pulsing under the closet door until he falls asleep.",

  9: "On Sunday morning, everything is eerily quiet with no thumps or glowing. The narrator confirms the rock is gone from the tank and the chair is still blocking the closet door, so it was not a dream. He opens the closet and something flies out at high speed, zipping past his head, hitting the lamp, ricocheting off the ceiling fan, and crash-landing on the carpet. It is a tiny dragon the size of an apple, with small claws, a spiky tail, and shimmering green and blue scales. The dragon lets out a tiny puff of smoke from its nose, and the narrator gently scoops it up in his hoodie.",

  10: "On Monday morning, the narrator discovers the baby dragon has vanished from the hoodie where it was sleeping. After frantically searching everywhere and nearly making LOST DRAGON signs, he finds the dragon sleeping on the rock ledge inside the aquarium with the lid still on, right next to Ziggy. He realizes the dragon can somehow escape and re-enter a closed tank. He names the dragon Tiny because of its small size, and notes that Tiny and Ziggy seem to be getting along like best friends.",

  11: "On Tuesday, Tiny escapes from the closed tank again while the narrator tries to do homework. The narrator finally sees how Tiny does it: the dragon stands on his hind legs, spreads his wings, and lifts the plastic lid with his claws like a tiny helicopter carrying something five times its size. Tiny then flies over and lands directly on the math homework, puffing out little clouds of smoke that toast the paper to a golden brown. The narrator has to reprint his math packet because Tiny dragon-toasted it.",

  12: "On Wednesday, inspired by Tiny toasting his homework, the narrator decides to test if Tiny can roast marshmallows. He holds a marshmallow on a pencil like a torch, but Tiny ignores it completely. Then Tiny spots the plate of marshmallows on the desk, hovers above it, and breathes out the tiniest flame, perfectly toasting all of them golden brown at once without burning a single one. The narrator eats five marshmallows and plans to try making s'mores with chocolate and graham crackers the next day.",

  13: "On Thursday, the narrator tries to figure out what dragons eat since Tiny has been around for almost a week but has not grown at all. Tiny refuses crickets and did not eat the marshmallows from yesterday. The dragon books suggest gold coins, sheep, or chicken, so the narrator tries chicken nuggets. Tiny sniffs them, blasts them with a quick flame to toast them properly, and then gobbles up five whole nuggets. The narrator now has to figure out how to explain to his mom why they suddenly need a lifetime supply of chicken nuggets.",

  14: "On Friday, the narrator discovers that Tiny's scales change to bright, glowing neon green and blue colors. When his mom blasts her cleaning playlist in the kitchen, Tiny starts bobbing his head, flapping his wings, and zooming around the room in loops and zigzags. The faster Tiny flies, the brighter his scales glow, switching from regular dragon mode to what the narrator calls glowing party mode. Ziggy watches from the tank, amazed or possibly confused, while the narrator wonders if the type of music matters and whether dragons can actually dance.",

  15: "On Saturday, with school starting Monday, the narrator tries to figure out what to do with Tiny while he is away. He attempts to get Tiny into his backpack, but the dragon refuses and flies straight back to the tank with Ziggy every time. While tossing a baseball at his desk, his mom bursts into the room and suddenly everything freezes: his mom stops mid-sentence, the baseball hangs in mid-air, and even the dust particles pause. Tiny hovers near the ceiling in slow motion, then hides behind the bookshelf, and time snaps back to normal. The narrator realizes his dragon just stopped time.",

  16: "On Sunday, the day before his first day at a new school mid-year, the narrator is completely terrified. He tries again to get Tiny into the backpack for school, but the dragon refuses. Then a stack of boxes crashes in the closet and Tiny squeaks, jumps three feet into the air, and hides behind Ziggy. The narrator tests this with a handheld vacuum and gets the same scared reaction. He realizes that while Tiny loves loud music, unexpected sudden noises terrify him, making school with its bells, slamming doors, and yelling kids definitely not dragon-friendly.",

  17: "On his first Monday at the new school, the narrator has an epic day. Every teacher introduces him as the new kid who needs help feeling welcomed, which is embarrassing. In music class with Mrs. Lizard (a code name), he is seated next to a girl he calls Sprinkles. He notices a tiny sparkly horn poking out of her bright-pink backpack and realizes she has a miniature unicorn named Unicorn. Sprinkles is shocked because no one else can see her unicorn, but the narrator can. They bond over their magical creatures, and the narrator writes Sprinkles a note suggesting they introduce Tiny and Unicorn at the library since it is quiet enough for Tiny."
};

(async () => {
  const { data: chapters, error: fetchError } = await supabase
    .from('chapters')
    .select('id, chapter_number')
    .eq('book_id', 68)
    .order('chapter_number');

  if (fetchError) {
    console.log('Error fetching chapters:', fetchError);
    return;
  }

  console.log('Found', chapters.length, 'chapters for book 68');

  for (const ch of chapters) {
    if (summaries[ch.chapter_number]) {
      const { error } = await supabase
        .from('chapters')
        .update({ summary: summaries[ch.chapter_number] })
        .eq('id', ch.id);
      console.log('Ch ' + ch.chapter_number + ': ' + (error ? 'ERROR - ' + error.message : 'OK'));
    } else {
      console.log('Ch ' + ch.chapter_number + ': No summary provided');
    }
  }

  console.log('Done!');
})();
