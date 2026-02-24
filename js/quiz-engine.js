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
    'character-analysis': '🎭'
  };

  const STRATEGY_NAMES = {
    'finding-details': 'Detail Detective',
    'making-inferences': 'Reading Between the Lines',
    'context-clues': 'Word Detective',
    'identifying-theme': 'Big Idea Finder',
    'personal-connection': 'Connect to You',
    'cause-and-effect': 'Cause & Effect',
    'character-analysis': 'Character Explorer'
  };

  const QUESTION_TYPE_LABELS = {
    'recall': 'Recall',
    'inference': 'Inference',
    'vocabulary': 'Vocabulary',
    'theme': 'Theme & Analysis',
    'personal': 'Personal Connection'
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
    'make sense': { word: 'make sense', definition: 'Easy to understand — it all adds up', pos: 'phrase' }
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
    const vocabWords = [...new Set([...questionVocab, ...chapterVocab, ...perQuestionVocab])];

    let markedText = markContextualVocab(markExplicitVocab(escapeHtml(questionText), vocabWords));

    // Mark vocab in passage too
    let markedPassage = '';
    if (q.passage_excerpt) {
      markedPassage = markContextualVocab(markExplicitVocab(escapeHtml(q.passage_excerpt), vocabWords));
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
            ${(q.options || []).map((opt, i) => {
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
                <span class="quiz-option-text">${markContextualVocab(markExplicitVocab(escapeHtml(opt), vocabWords))}</span>
                ${answered && i === q.correct_answer ? '<svg class="quiz-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
              </button>`;
            }).join('')}
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
        quizResults = await API.submitQuiz({
          studentId: currentStudent.id,
          chapterId: currentQuiz.chapter.id,
          answers,
          timeTaken,
          hintCount
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
        // Per-quiz keys: pass (>=80%) + 0 hints = 3, <=3 hints = 2, >3 hints = 1, fail = 0
        let keysEarned = 0;
        if (score >= 80) {
          if (localHintCount === 0) keysEarned = 3;
          else if (localHintCount <= 3) keysEarned = 2;
          else keysEarned = 1;
        }
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

    // Fetch from API
    try {
      const passage = currentQuiz?.questions?.[currentQuestion]?.passage_excerpt || '';
      const def = await API.defineWord(word, passage, currentStudent?.grade || '4th');
      definitionCache[word.toLowerCase()] = def;
      renderDefinitionTooltip(tooltip, def);
    } catch(e) {
      tooltip.innerHTML = `<div class="vocab-tooltip-word">${escapeHtml(word)}</div><div class="vocab-tooltip-def">Definition not available</div>`;
    }
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

  function markContextualVocab(html) {
    const contextualWords = Object.keys(CONTEXTUAL_VOCAB);
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
