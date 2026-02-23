// ─── Landing Page Predictive Search ───
// Self-contained search for the homepage hero section.
// Fetches books from API, shows autocomplete dropdown with thumbnails.

(function() {
  let books = [];
  const input = document.getElementById('landing-search-input');
  const resultsContainer = document.getElementById('hero-search-results');
  if (!input || !resultsContainer) return;

  // Fetch books on page load
  fetch('/api/books')
    .then(r => r.json())
    .then(data => { books = data || []; })
    .catch(e => console.warn('Could not load books for search:', e));

  // Debounced input handler
  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(handleSearch, 150);
  });

  function handleSearch() {
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
          <div class="search-result-meta">${escapeHtml(b.author || '')}${b.grade_level ? ' &middot; ' + escapeHtml(b.grade_level) : ''}${b.genre ? ' &middot; ' + escapeHtml(b.genre) : ''}</div>
        </div>
        <svg class="search-result-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </a>
    `).join('');
    resultsContainer.style.display = 'block';
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#hero-search')) {
      resultsContainer.style.display = 'none';
    }
  });

  // Re-open on focus if there's text
  input.addEventListener('focus', () => {
    if (input.value.trim().length >= 2) {
      handleSearch();
    }
  });

  // Keyboard navigation (Arrow Up/Down + Enter)
  input.addEventListener('keydown', (e) => {
    const items = resultsContainer.querySelectorAll('.search-result-item');
    if (items.length === 0) return;
    const active = resultsContainer.querySelector('.search-result-item.active');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!active) {
        items[0].classList.add('active');
      } else if (active.nextElementSibling?.classList.contains('search-result-item')) {
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

  // Highlight matching text in results
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
