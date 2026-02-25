// ============================================================
// key2read — Real Page Numbers from Published PDF Files
// ============================================================
// DO NOT EDIT unless you have re-verified against the physical PDF.
// Each book maps to an array of { chapter_number, page_start, page_end }
// extracted directly from the actual published PDF files.
//
// To add a new book:
// 1. Open the PDF and find where each chapter/entry starts
// 2. Add an entry below with the exact book title (must match DB title)
// 3. Include ALL chapters with their real start/end page numbers
// ============================================================

const BOOK_PAGES = {
  'Charlie Picasso: And The Magic Pencil': [
    { chapter: 1, start: 5, end: 21 },
    { chapter: 2, start: 22, end: 31 },
    { chapter: 3, start: 32, end: 39 },
    { chapter: 4, start: 40, end: 51 },
    { chapter: 5, start: 52, end: 67 },
    { chapter: 6, start: 68, end: 73 },
    { chapter: 7, start: 74, end: 78 },
    { chapter: 8, start: 79, end: 120 },
  ],
  "Charlie Picasso: Don't Draw Robots": [
    { chapter: 1, start: 5, end: 13 },
    { chapter: 2, start: 14, end: 28 },
    { chapter: 3, start: 29, end: 32 },
    { chapter: 4, start: 33, end: 52 },
    { chapter: 5, start: 53, end: 67 },
    { chapter: 6, start: 68, end: 76 },
    { chapter: 7, start: 77, end: 86 },
    { chapter: 8, start: 87, end: 95 },
    { chapter: 9, start: 96, end: 103 },
  ],
  'Purple Space Chickens': [
    { chapter: 1, start: 5, end: 11 },
    { chapter: 2, start: 12, end: 21 },
    { chapter: 3, start: 22, end: 29 },
    { chapter: 4, start: 30, end: 43 },
    { chapter: 5, start: 44, end: 52 },
    { chapter: 6, start: 53, end: 64 },
    { chapter: 7, start: 65, end: 80 },
    { chapter: 8, start: 81, end: 96 },
    { chapter: 9, start: 97, end: 109 },
  ],
  'Diary of a Famous Cat: Now I Have A Name': [
    { chapter: 1, start: 5, end: 10 },
    { chapter: 2, start: 11, end: 16 },
    { chapter: 3, start: 17, end: 23 },
    { chapter: 4, start: 24, end: 30 },
    { chapter: 5, start: 31, end: 41 },
    { chapter: 6, start: 42, end: 48 },
    { chapter: 7, start: 49, end: 54 },
    { chapter: 8, start: 55, end: 59 },
    { chapter: 9, start: 60, end: 66 },
    { chapter: 10, start: 67, end: 70 },
    { chapter: 11, start: 71, end: 74 },
    { chapter: 12, start: 75, end: 79 },
    { chapter: 13, start: 80, end: 101 },
  ],
  'Diary of a Famous Cat: Lost And Found': [
    { chapter: 1, start: 5, end: 11 },
    { chapter: 2, start: 12, end: 18 },
    { chapter: 3, start: 19, end: 27 },
    { chapter: 4, start: 28, end: 34 },
    { chapter: 5, start: 35, end: 39 },
    { chapter: 6, start: 40, end: 45 },
    { chapter: 7, start: 46, end: 51 },
    { chapter: 8, start: 52, end: 57 },
    { chapter: 9, start: 58, end: 66 },
    { chapter: 10, start: 67, end: 74 },
    { chapter: 11, start: 75, end: 83 },
    { chapter: 12, start: 84, end: 103 },
  ],
  'Dragon Diaries': [
    { chapter: 1, start: 3, end: 11 },
    { chapter: 2, start: 12, end: 18 },
    { chapter: 3, start: 19, end: 23 },
    { chapter: 4, start: 24, end: 28 },
    { chapter: 5, start: 29, end: 35 },
    { chapter: 6, start: 36, end: 40 },
    { chapter: 7, start: 41, end: 46 },
    { chapter: 8, start: 47, end: 51 },
    { chapter: 9, start: 52, end: 58 },
    { chapter: 10, start: 59, end: 62 },
    { chapter: 11, start: 63, end: 68 },
    { chapter: 12, start: 69, end: 73 },
    { chapter: 13, start: 74, end: 77 },
    { chapter: 14, start: 78, end: 80 },
    { chapter: 15, start: 81, end: 85 },
    { chapter: 16, start: 86, end: 89 },
    { chapter: 17, start: 90, end: 109 },
  ],
  'Dragon Diaries: BIG Time': [
    { chapter: 1, start: 5, end: 9 },
    { chapter: 2, start: 10, end: 27 },
    { chapter: 3, start: 28, end: 34 },
    { chapter: 4, start: 35, end: 41 },
    { chapter: 5, start: 42, end: 46 },
    { chapter: 6, start: 47, end: 54 },
    { chapter: 7, start: 55, end: 62 },
    { chapter: 8, start: 63, end: 71 },
    { chapter: 9, start: 72, end: 80 },
    { chapter: 10, start: 81, end: 87 },
    { chapter: 11, start: 88, end: 103 },
  ],
  'The Life of a Sparkly Turtle: The Big Sneeze': [
    { chapter: 1, start: 5, end: 12 },
    { chapter: 2, start: 13, end: 18 },
    { chapter: 3, start: 19, end: 25 },
    { chapter: 4, start: 26, end: 34 },
    { chapter: 5, start: 35, end: 41 },
    { chapter: 6, start: 42, end: 48 },
    { chapter: 7, start: 49, end: 54 },
    { chapter: 8, start: 55, end: 61 },
    { chapter: 9, start: 62, end: 69 },
    { chapter: 10, start: 70, end: 79 },
    { chapter: 11, start: 80, end: 85 },
    { chapter: 12, start: 86, end: 91 },
    { chapter: 13, start: 92, end: 98 },
    { chapter: 14, start: 99, end: 105 },
    { chapter: 15, start: 106, end: 120 },
  ],
  'Tryouts: Tall Doesn\'t Mean Talent': [
    { chapter: 1, start: 6, end: 12 },
    { chapter: 2, start: 13, end: 19 },
    { chapter: 3, start: 20, end: 28 },
    { chapter: 4, start: 29, end: 37 },
    { chapter: 5, start: 38, end: 47 },
    { chapter: 6, start: 48, end: 55 },
    { chapter: 7, start: 56, end: 63 },
    { chapter: 8, start: 64, end: 75 },
    { chapter: 9, start: 76, end: 88 },
    { chapter: 10, start: 89, end: 94 },
    { chapter: 11, start: 95, end: 105 },
    { chapter: 12, start: 106, end: 119 },
  ],
  "Don't Trust the Nacho Hamster": [
    { chapter: 1, start: 6, end: 13 },
    { chapter: 2, start: 14, end: 17 },
    { chapter: 3, start: 18, end: 23 },
    { chapter: 4, start: 24, end: 29 },
    { chapter: 5, start: 30, end: 37 },
    { chapter: 6, start: 38, end: 48 },
    { chapter: 7, start: 49, end: 58 },
    { chapter: 8, start: 59, end: 66 },
    { chapter: 9, start: 67, end: 76 },
    { chapter: 10, start: 77, end: 82 },
    { chapter: 11, start: 83, end: 89 },
    { chapter: 12, start: 90, end: 95 },
    { chapter: 13, start: 96, end: 104 },
  ],
  'Sprinkles and Unicorn: Surprise Visit': [
    { chapter: 1, start: 6, end: 26 },
    { chapter: 2, start: 27, end: 41 },
    { chapter: 3, start: 42, end: 54 },
    { chapter: 4, start: 55, end: 65 },
    { chapter: 5, start: 66, end: 91 },
    { chapter: 6, start: 92, end: 104 },
    { chapter: 7, start: 105, end: 117 },
  ],
  'Fluff and Robodog': [
    { chapter: 1, start: 6, end: 13 },
    { chapter: 2, start: 14, end: 20 },
    { chapter: 3, start: 21, end: 28 },
    { chapter: 4, start: 29, end: 38 },
    { chapter: 5, start: 39, end: 47 },
    { chapter: 6, start: 48, end: 53 },
    { chapter: 7, start: 54, end: 62 },
    { chapter: 8, start: 63, end: 68 },
    { chapter: 9, start: 69, end: 74 },
    { chapter: 10, start: 75, end: 82 },
    { chapter: 11, start: 83, end: 90 },
    { chapter: 12, start: 91, end: 100 },
    { chapter: 13, start: 101, end: 110 },
  ],
};

/**
 * Look up page range for a specific book + chapter number.
 * Tries exact title match first, then case-insensitive partial match.
 * Returns { start, end } or null if not found.
 */
function getChapterPages(bookTitle, chapterNumber) {
  // Direct match
  const chapters = BOOK_PAGES[bookTitle];
  if (chapters) {
    const ch = chapters.find(c => c.chapter === chapterNumber);
    return ch ? { start: ch.start, end: ch.end } : null;
  }

  // Case-insensitive partial match
  const lower = bookTitle.toLowerCase().trim();
  for (const [key, val] of Object.entries(BOOK_PAGES)) {
    if (key.toLowerCase() === lower || lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      const ch = val.find(c => c.chapter === chapterNumber);
      return ch ? { start: ch.start, end: ch.end } : null;
    }
  }

  return null;
}

module.exports = { BOOK_PAGES, getChapterPages };
