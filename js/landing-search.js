// ─── Landing Page: Predictive Search + Book Library Grid ───
// Self-contained module for the homepage.
// Fetches books once, powers both search autocomplete and visual library.

(function() {
  let books = [];
  const BOOKS_PER_PAGE = 12;
  let currentPage = 0;
  let shuffledBooks = [];

  // ─── Shared: fetch books once ───
  fetch('/api/books')
    .then(r => r.json())
    .then(data => {
      books = data || [];
      initSearch();
      initLibrary();
    })
    .catch(e => console.warn('Could not load books:', e));

  // ════════════════════════════════════
  //  SEARCH AUTOCOMPLETE
  // ════════════════════════════════════
  function initSearch() {
    const input = document.getElementById('landing-search-input');
    const resultsContainer = document.getElementById('hero-search-results');
    if (!input || !resultsContainer) return;

    let debounceTimer;
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => handleSearch(input, resultsContainer), 150);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#hero-search')) resultsContainer.style.display = 'none';
    });

    input.addEventListener('focus', () => {
      if (input.value.trim().length >= 2) handleSearch(input, resultsContainer);
    });

    input.addEventListener('keydown', (e) => {
      const items = resultsContainer.querySelectorAll('.search-result-item');
      if (items.length === 0) return;
      const active = resultsContainer.querySelector('.search-result-item.active');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!active) items[0].classList.add('active');
        else if (active.nextElementSibling?.classList.contains('search-result-item')) {
          active.classList.remove('active');
          active.nextElementSibling.classList.add('active');
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (active && active.previousElementSibling?.classList.contains('search-result-item')) {
          active.classList.remove('active');
          active.previousElementSibling.classList.add('active');
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const target = active || items[0];
        if (target) window.location.href = target.getAttribute('href');
      } else if (e.key === 'Escape') {
        resultsContainer.style.display = 'none';
        input.blur();
      }
    });
  }

  function handleSearch(input, resultsContainer) {
    const q = input.value.toLowerCase().trim();
    if (q.length < 2) {
      resultsContainer.innerHTML = '';
      resultsContainer.style.display = 'none';
      return;
    }

    const matches = books.filter(b =>
      (b.title || '').toLowerCase().includes(q) ||
      (b.author || '').toLowerCase().includes(q) ||
      (b.genre || '').toLowerCase().includes(q)
    ).slice(0, 6);

    if (matches.length === 0) {
      resultsContainer.innerHTML = '<div class="search-no-results">No books found. <a href="pages/dashboard.html">Browse all books</a></div>';
      resultsContainer.style.display = 'block';
      return;
    }

    resultsContainer.innerHTML = matches.map(b => `
      <a class="search-result-item" href="pages/dashboard.html?book=${b.id}">
        <div class="search-result-thumb">
          ${b.cover_url
            ? `<img src="${escapeAttr(b.cover_url)}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
            : ''}
          <div class="search-result-thumb-fallback" ${b.cover_url ? 'style="display:none"' : ''}>${escapeHtml((b.title || '').charAt(0))}</div>
        </div>
        <div class="search-result-info">
          <div class="search-result-title">${highlightMatch(escapeHtml(b.title), q)}</div>
          <div class="search-result-meta">${escapeHtml(b.author || '')}${b.grade_level ? ' &middot; ' + escapeHtml(mapGradeLevel(b.grade_level)) : ''}${b.genre ? ' &middot; ' + escapeHtml(b.genre) : ''}</div>
        </div>
        <svg class="search-result-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </a>
    `).join('');
    resultsContainer.style.display = 'block';
  }

  // ════════════════════════════════════
  //  BOOK LIBRARY GRID
  // ════════════════════════════════════
  // Sort: Book 1 first (randomized), then rest (randomized)
  function sortBooksForDisplay(bookList) {
    const book1 = bookList.filter(b => b.book_number === 1);
    const rest = bookList.filter(b => b.book_number !== 1);
    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
    return [...shuffle(book1), ...shuffle(rest)];
  }

  function initLibrary() {
    const grid = document.getElementById('library-grid');
    const paginationEl = document.getElementById('library-pagination');
    if (!grid || !paginationEl) return;
    if (books.length === 0) return;

    // Book 1 titles first (randomized), then rest (randomized)
    shuffledBooks = sortBooksForDisplay([...books]);

    currentPage = 0;
    renderLibraryPage(grid, paginationEl);
  }

  function renderLibraryPage(grid, paginationEl) {
    const totalPages = Math.ceil(shuffledBooks.length / BOOKS_PER_PAGE);
    const start = currentPage * BOOKS_PER_PAGE;
    const pageBooks = shuffledBooks.slice(start, start + BOOKS_PER_PAGE);

    grid.innerHTML = pageBooks.map(b => {
      const comingSoon = b.has_quizzes === false;
      if (comingSoon) {
        return `
      <div class="library-book library-book-coming-soon">
        <div class="coming-soon-overlay">Coming Soon</div>
        <div class="library-book-cover">
          ${b.cover_url
            ? `<img src="${escapeAttr(b.cover_url)}" alt="${escapeAttr(b.title)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
            : ''}
          <div class="library-book-cover-fallback" ${b.cover_url ? 'style="display:none"' : ''}>${escapeHtml((b.title || '').charAt(0))}</div>
        </div>
        <div class="library-book-info">
          <div class="library-book-title">${escapeHtml(b.title)}</div>
          <div class="library-book-author">${escapeHtml(b.author || '')}</div>
        </div>
      </div>`;
      }
      return `
      <a class="library-book" href="pages/dashboard.html?book=${b.id}">
        <div class="library-book-cover">
          ${b.cover_url
            ? `<img src="${escapeAttr(b.cover_url)}" alt="${escapeAttr(b.title)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
            : ''}
          <div class="library-book-cover-fallback" ${b.cover_url ? 'style="display:none"' : ''}>${escapeHtml((b.title || '').charAt(0))}</div>
        </div>
        <div class="library-book-info">
          <div class="library-book-title">${escapeHtml(b.title)}</div>
          <div class="library-book-author">${escapeHtml(b.author || '')}</div>
        </div>
      </a>`;
    }).join('');

    // Pagination controls
    const chevronLeft = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
    const chevronRight = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>';

    paginationEl.innerHTML = `
      <button class="library-page-btn" id="lib-prev" ${currentPage === 0 ? 'disabled' : ''}>${chevronLeft} Previous</button>
      <span class="library-page-info">${currentPage + 1} / ${totalPages}</span>
      <button class="library-page-btn" id="lib-next" ${currentPage >= totalPages - 1 ? 'disabled' : ''}>Next Page ${chevronRight}</button>
    `;

    document.getElementById('lib-prev')?.addEventListener('click', () => {
      if (currentPage > 0) {
        currentPage--;
        renderLibraryPage(grid, paginationEl);
        scrollToLibrary();
      }
    });

    document.getElementById('lib-next')?.addEventListener('click', () => {
      if (currentPage < totalPages - 1) {
        currentPage++;
        renderLibraryPage(grid, paginationEl);
        scrollToLibrary();
      }
    });
  }

  function scrollToLibrary() {
    const el = document.getElementById('library');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ════════════════════════════════════
  //  UTILITIES
  // ════════════════════════════════════
  function mapGradeLevel(level) {
    if (!level) return '';
    const map = { 'K-2': 'Ages 6\u201310', 'k-2': 'Ages 6\u201310', 'K\u20132': 'Ages 6\u201310' };
    return map[level] || level;
  }

  function highlightMatch(text, query) {
    if (!query) return text;
    const re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return text.replace(re, '<strong>$1</strong>');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    if (!str) return '';
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
})();
