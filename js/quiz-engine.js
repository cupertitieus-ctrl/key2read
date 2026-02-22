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

  // ─── Start a quiz ───
  function start(quizData, student, callback) {
    currentQuiz = quizData;
    currentStudent = student;
    currentQuestion = 0;
    answers = [];
    feedback = [];
    answered = false;
    showingStrategy = false;
    quizResults = null;
    quizStartTime = Date.now();
    questionStartTime = Date.now();
    onComplete = callback;
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

    // Mark vocabulary words in question text
    const vocabWords = q.vocabulary_words || [];
    let markedText = escapeHtml(questionText);
    vocabWords.forEach(w => {
      const re = new RegExp(`\\b(${escapeRegex(w)})\\b`, 'gi');
      markedText = markedText.replace(re, '<span class="vocab-word" data-word="$1" onmouseenter="QuizEngine.showDefinition(this)" onmouseleave="QuizEngine.hideDefinition(this)">$1<span class="vocab-dot"></span></span>');
    });

    // Mark vocab in passage too
    let markedPassage = '';
    if (q.passage_excerpt) {
      markedPassage = escapeHtml(q.passage_excerpt);
      vocabWords.forEach(w => {
        const re = new RegExp(`\\b(${escapeRegex(w)})\\b`, 'gi');
        markedPassage = markedPassage.replace(re, '<span class="vocab-word" data-word="$1" onmouseenter="QuizEngine.showDefinition(this)" onmouseleave="QuizEngine.hideDefinition(this)">$1<span class="vocab-dot"></span></span>');
      });
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
              <div class="quiz-chapter-label">Chapter ${ch.chapter_number}: ${escapeHtml(ch.title)}</div>
            </div>
          </div>
          <div class="quiz-progress">
            <div class="quiz-progress-text">Question ${currentQuestion + 1} of ${total}</div>
            <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${((currentQuestion + 1) / total) * 100}%"></div></div>
          </div>
        </div>

        <div class="quiz-body">
          <div class="quiz-strategy-badge">
            <span class="quiz-strategy-icon">${stratIcon}</span>
            <span class="quiz-strategy-label">Strategy: ${stratName}</span>
          </div>

          <div class="quiz-question-type-badge">${qTypeLabel}</div>

          ${q.passage_excerpt ? `
            <div class="quiz-passage">
              <div class="quiz-passage-label">From the text:</div>
              <blockquote>${markedPassage}</blockquote>
            </div>
          ` : ''}

          <div class="quiz-question-text">${markedText}</div>

          <div class="quiz-options">
            ${(q.options || []).map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              let cls = 'quiz-option';
              if (answered && answerForThis === i) cls += fbForThis?.isCorrect ? ' correct' : ' incorrect';
              if (answered && i === q.correct_answer && answerForThis !== i) cls += ' correct-reveal';
              if (!answered && answerForThis === i) cls += ' selected';
              return `<button class="${cls}" onclick="QuizEngine.selectAnswer(${i})" ${answered ? 'disabled' : ''}>
                <span class="quiz-option-letter">${letter}</span>
                <span class="quiz-option-text">${escapeHtml(opt)}</span>
                ${answered && i === q.correct_answer ? '<svg class="quiz-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
              </button>`;
            }).join('')}
          </div>

          ${!answered ? `
            <div class="quiz-hint-area">
              <button class="quiz-hint-btn" onclick="QuizEngine.toggleStrategy()">
                ${showingStrategy ? 'Hide Strategy Tip' : '💡 Need a Hint? Learn the Strategy'}
              </button>
              ${showingStrategy ? `
                <div class="quiz-strategy-card">
                  <div class="quiz-strategy-card-header">
                    <span>${stratIcon}</span> ${stratName}
                  </div>
                  <p class="quiz-strategy-tip">${escapeHtml(q.strategy_tip || 'Think carefully about the text.')}</p>
                </div>
              ` : ''}
            </div>
          ` : ''}

          ${answered && fbForThis ? `
            <div class="quiz-feedback ${fbForThis.isCorrect ? 'correct' : 'incorrect'}">
              <div class="quiz-feedback-header">
                ${fbForThis.isCorrect
                  ? '<span class="quiz-feedback-icon">✅</span> Great Job!'
                  : '<span class="quiz-feedback-icon">💪</span> Keep Trying!'}
              </div>
              <p class="quiz-feedback-text">${escapeHtml(fbForThis.feedback || q.explanation || '')}</p>
              ${fbForThis.strategy_reminder ? `
                <div class="quiz-feedback-strategy">
                  <span>${stratIcon}</span> <strong>Strategy Reminder:</strong> ${escapeHtml(fbForThis.strategy_reminder)}
                </div>
              ` : ''}
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

      <div id="vocab-tooltip" class="vocab-tooltip" style="display:none"></div>
    `;
  }

  function renderIntro() {
    const ch = currentQuiz.chapter;
    const strategies = [...new Set(currentQuiz.questions.map(q => q.strategy_type))];
    return `
      <div class="quiz-player">
        <div class="quiz-intro">
          <div class="quiz-intro-icon">📖</div>
          <h2>${escapeHtml(currentQuiz.book?.title || 'Book Quiz')}</h2>
          <p class="quiz-intro-chapter">Chapter ${ch.chapter_number}: ${escapeHtml(ch.title)}</p>
          ${currentStudent ? `<p class="quiz-intro-student">Personalized for ${escapeHtml(currentStudent.name)}</p>` : ''}
          <div class="quiz-intro-info">
            <div class="quiz-intro-stat">
              <strong>5</strong><span>Questions</span>
            </div>
            <div class="quiz-intro-stat">
              <strong>~10</strong><span>Minutes</span>
            </div>
            <div class="quiz-intro-stat">
              <strong>25</strong><span>Keys possible</span>
            </div>
          </div>
          <div class="quiz-intro-strategies">
            <h4>Strategies You'll Practice</h4>
            <div class="quiz-intro-strategy-list">
              ${strategies.map(s => `
                <div class="quiz-intro-strategy-item">
                  <span>${STRATEGY_ICONS[s] || '📖'}</span> ${STRATEGY_NAMES[s] || s}
                </div>
              `).join('')}
            </div>
          </div>
          <div class="quiz-intro-tip">
            <strong>💡 Tip:</strong> Hover over <span class="vocab-word-demo">highlighted words</span> to see their definitions!
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

          <div class="quiz-results-stats">
            <div class="quiz-results-stat">
              <div class="quiz-results-stat-value" style="color:${r.readingLevelChange >= 0 ? '#10B981' : '#EF4444'}">
                ${r.readingLevelChange >= 0 ? '↑' : '↓'} ${Math.abs(r.readingLevelChange)} pts
              </div>
              <div class="quiz-results-stat-label">Reading Score</div>
              <div class="quiz-results-stat-sub">${r.newReadingScore}L (Level ${r.newReadingLevel})</div>
            </div>
            <div class="quiz-results-stat">
              <div class="quiz-results-stat-value" style="color:#F59E0B">🔑 ${r.keysEarned}</div>
              <div class="quiz-results-stat-label">Keys Earned</div>
            </div>
          </div>

          <div class="quiz-results-strategies">
            <h4>Strategies Practiced</h4>
            ${strategiesUsed.map(s => `
              <div class="quiz-results-strategy">
                <span>${STRATEGY_ICONS[s] || '📖'}</span> ${STRATEGY_NAMES[s] || s}
              </div>
            `).join('')}
          </div>

          <div class="quiz-results-breakdown">
            <h4>Question Breakdown</h4>
            ${r.results.map((res, i) => {
              const q = currentQuiz.questions[i];
              return `
                <div class="quiz-result-item ${res.isCorrect ? 'correct' : 'incorrect'}">
                  <div class="quiz-result-icon">${res.isCorrect ? '✅' : '❌'}</div>
                  <div class="quiz-result-info">
                    <div class="quiz-result-type">${QUESTION_TYPE_LABELS[q.question_type] || ''}</div>
                    <div class="quiz-result-text">${escapeHtml((q.personalized_text || q.question_text).substring(0, 80))}...</div>
                  </div>
                  <div class="quiz-result-strategy">${STRATEGY_ICONS[q.strategy_type] || ''}</div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="quiz-results-actions">
            <button class="btn btn-primary" onclick="QuizEngine.exit()">Back to Dashboard</button>
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

  function selectAnswer(idx) {
    if (answered) return;
    answers[currentQuestion] = idx;
    render();
  }

  async function submitAnswer() {
    if (answers[currentQuestion] === undefined || answered) return;
    answered = true;
    const q = currentQuiz.questions[currentQuestion];
    const opts = q.options || [];
    const isCorrect = answers[currentQuestion] === q.correct_answer;

    // Get AI feedback
    try {
      const fb = await API.getFeedback({
        question: q.personalized_text || q.question_text,
        studentAnswer: opts[answers[currentQuestion]] || '',
        correctAnswer: opts[q.correct_answer] || '',
        isCorrect,
        strategyType: q.strategy_type,
        gradeLevel: currentStudent?.grade || '4th'
      });
      feedback[currentQuestion] = fb;
    } catch(e) {
      feedback[currentQuestion] = {
        isCorrect,
        feedback: isCorrect ? 'Great job! You got it right!' : (q.explanation || 'The correct answer was different. Try the strategy tip to understand why.'),
        strategy_reminder: q.strategy_tip || ''
      };
    }
    render();
  }

  async function nextQuestion() {
    if (currentQuestion >= currentQuiz.questions.length - 1) {
      // Submit quiz
      const timeTaken = Math.round((Date.now() - quizStartTime) / 1000);
      try {
        quizResults = await API.submitQuiz({
          studentId: currentStudent?.id || 1,
          chapterId: currentQuiz.chapter.id,
          answers,
          timeTaken
        });
      } catch(e) {
        // Fallback local scoring
        let correctCount = 0;
        currentQuiz.questions.forEach((q, i) => { if (answers[i] === q.correct_answer) correctCount++; });
        const score = (correctCount / currentQuiz.questions.length) * 100;
        quizResults = {
          score, correctCount, totalQuestions: currentQuiz.questions.length,
          readingLevelChange: Math.round((score / 100 - 0.65) * 20),
          newReadingScore: (currentStudent?.reading_score || 500) + Math.round((score / 100 - 0.65) * 20),
          newReadingLevel: (((currentStudent?.reading_score || 500) + Math.round((score / 100 - 0.65) * 20)) / 160).toFixed(1),
          keysEarned: correctCount * 5 + (score === 100 ? 10 : 0),
          results: currentQuiz.questions.map((q, i) => ({ isCorrect: answers[i] === q.correct_answer, feedback: feedback[i]?.feedback || '' })),
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
    questionStartTime = Date.now();
    render();
  }

  function toggleStrategy() {
    showingStrategy = !showingStrategy;
    render();
  }

  function exit() {
    const container = document.getElementById('quiz-player-root');
    if (container) container.innerHTML = '';
    if (typeof renderMain === 'function') renderMain();
  }

  // ─── Hover Definitions ───
  async function showDefinition(el) {
    const word = el.dataset.word;
    if (!word) return;
    const tooltip = document.getElementById('vocab-tooltip');
    if (!tooltip) return;

    // Position tooltip
    const rect = el.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 + 'px';
    tooltip.style.top = rect.bottom + 8 + 'px';
    tooltip.innerHTML = '<div class="vocab-tooltip-loading">Looking up...</div>';
    tooltip.style.display = 'block';

    // Check cache
    if (definitionCache[word.toLowerCase()]) {
      renderDefinitionTooltip(tooltip, definitionCache[word.toLowerCase()]);
      return;
    }

    // Check chapter vocabulary first
    if (currentQuiz?.chapter?.key_vocabulary) {
      try {
        const vocabList = JSON.parse(currentQuiz.chapter.key_vocabulary);
        const found = vocabList.find(v => v.word.toLowerCase() === word.toLowerCase());
        if (found) {
          const def = { word: found.word, definition: found.definition, part_of_speech: found.pos || '', example: '', tip: '' };
          definitionCache[word.toLowerCase()] = def;
          renderDefinitionTooltip(tooltip, def);
          return;
        }
      } catch(e) {}
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
  return {
    start, render, beginQuiz, selectAnswer, submitAnswer, nextQuestion,
    toggleStrategy, exit, showDefinition, hideDefinition,
    formatReadingLevel, getLexileGrade, getReadingLevelColor,
    STRATEGY_ICONS, STRATEGY_NAMES, QUESTION_TYPE_LABELS
  };
})();
