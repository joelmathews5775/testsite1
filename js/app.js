(function () {
  'use strict';

  // ---------------------------------------------------------
  // Elements
  // ---------------------------------------------------------
  const skillSelect = document.getElementById('skill-select');
  const platformSelect = document.getElementById('platform-select');
  const generatorForm = document.getElementById('generator-form');
  const anotherBtn = document.getElementById('another-btn');
  const resultRegion = document.getElementById('result-region');
  const savedRegion = document.getElementById('saved-region');
  const downloadSavedBtn = document.getElementById('download-saved-btn');
  const toastEl = document.getElementById('toast');

  const FILTER_STORAGE_KEY = 'draftedux_filters';
  const CURRENT_STORAGE_KEY = 'draftedux_current_ticket';
  // Saved briefs live in sessionStorage — there's no login anymore, so
  // this is a single flat list for whoever has this tab open, and it
  // clears when the tab/browser session ends. The "Download saved
  // briefs" button is the way to keep them past that.
  const SAVED_STORAGE_KEY = 'draftedux_saved_briefs';
  // Ticket IDs already generated this session, so "Generate a brief" /
  // "Pull another" work like a shuffle bag: every brief matching the
  // current filter shows once before any of them repeat. Once every
  // matching (and unsaved) brief has been seen, that filter's seen
  // list resets and the cycle starts again.
  const SEEN_STORAGE_KEY = 'draftedux_seen_briefs';

  let currentBrief = null;
  let currentDateStr = null;
  let lastTicketId = null;
  let toastTimer = null;

  // ---------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function todayLabel() {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).format(new Date());
  }

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.hidden = true;
    }, 3200);
  }

  function uniqueSorted(list) {
    return Array.from(new Set(list)).sort();
  }

  // ---------------------------------------------------------
  // Populate platform select from the data itself
  // ---------------------------------------------------------
  function initFilterOptions() {
    const platforms = uniqueSorted(PROJECT_BRIEFS.map(function (b) { return b.platform; }));
    platforms.forEach(function (p) {
      const opt = document.createElement('option');
      opt.value = p;
      opt.textContent = p;
      platformSelect.appendChild(opt);
    });
  }

  function restoreFilters() {
    try {
      const raw = sessionStorage.getItem(FILTER_STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.skill) skillSelect.value = saved.skill;
      if (saved.platform) platformSelect.value = saved.platform;
    } catch (err) {
      /* ignore */
    }
  }

  function persistFilters() {
    try {
      sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify({
        skill: skillSelect.value,
        platform: platformSelect.value
      }));
    } catch (err) {
      /* ignore */
    }
  }

  // ---------------------------------------------------------
  // Brief selection
  // ---------------------------------------------------------
  function getSeenIds() {
    try {
      const raw = sessionStorage.getItem(SEEN_STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch (err) {
      return new Set();
    }
  }

  function setSeenIds(idSet) {
    try {
      sessionStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(Array.from(idSet)));
    } catch (err) {
      /* ignore */
    }
  }

  function markSeen(ticketId) {
    const seen = getSeenIds();
    seen.add(ticketId);
    setSeenIds(seen);
  }

  function getFilteredPool() {
    const skill = skillSelect.value;
    const platform = platformSelect.value;
    const savedIds = new Set(getSavedList().map(function (item) { return item.ticketId; }));

    return PROJECT_BRIEFS.filter(function (b) {
      const skillMatch = skill === 'any' || b.difficulty === skill;
      const platformMatch = platform === 'any' || b.platform === platform;
      return skillMatch && platformMatch && !savedIds.has(b.ticketId);
    });
  }

  // Same filters, but without excluding saved briefs — used only to
  // tell "nothing matches this filter at all" apart from "everything
  // that matches is already saved" for a clearer empty-state message.
  function getFilteredPoolIncludingSaved() {
    const skill = skillSelect.value;
    const platform = platformSelect.value;
    return PROJECT_BRIEFS.filter(function (b) {
      const skillMatch = skill === 'any' || b.difficulty === skill;
      const platformMatch = platform === 'any' || b.platform === platform;
      return skillMatch && platformMatch;
    });
  }

  function pickBrief(pool) {
    if (pool.length === 0) return null;
    if (pool.length === 1) return pool[0];
    let choice;
    let attempts = 0;
    do {
      choice = pool[Math.floor(Math.random() * pool.length)];
      attempts += 1;
    } while (choice.ticketId === lastTicketId && attempts < 10);
    return choice;
  }

  // ---------------------------------------------------------
  // Rendering the ticket
  // ---------------------------------------------------------
  function listItems(items) {
    return items.map(function (item) {
      return '<li>' + escapeHtml(item) + '</li>';
    }).join('');
  }

  function tagList(items) {
    return items.map(function (item) {
      return '<span class="tag">' + escapeHtml(item) + '</span>';
    }).join('');
  }

  function isSaved(ticketId) {
    return getSavedList().some(function (item) { return item.ticketId === ticketId; });
  }

  function renderTicket(brief, dateStr) {
    const saved = isSaved(brief.ticketId);

    resultRegion.innerHTML =
      '<div class="ticket" id="ticket-card" tabindex="-1">' +
        '<div class="ticket__stub">' +
          '<span class="ticket__id">Ticket ' + escapeHtml(brief.ticketId) + ' &middot; opened ' + escapeHtml(dateStr) + '</span>' +
          '<span class="ticket__stamp">Open</span>' +
        '</div>' +
        '<div class="ticket__body">' +
          '<div class="ticket__title-row">' +
            '<h3 class="ticket__title">' + escapeHtml(brief.title) + '</h3>' +
          '</div>' +
          '<div class="ticket__tags">' +
            '<span class="tag">' + escapeHtml(brief.difficulty) + '</span>' +
            '<span class="tag">' + escapeHtml(brief.platform) + '</span>' +
            '<span class="tag">' + escapeHtml(brief.industry) + '</span>' +
          '</div>' +
          '<p class="ticket__overview">' + escapeHtml(brief.overview) + '</p>' +
          '<div class="ticket__grid">' +
            '<div class="ticket__block">' +
              '<h3>Problem to solve</h3>' +
              '<p>' + escapeHtml(brief.problemToSolve) + '</p>' +
            '</div>' +
            '<div class="ticket__block">' +
              '<h3>Target users</h3>' +
              '<p>' + escapeHtml(brief.targetUsers) + '</p>' +
            '</div>' +
            '<div class="ticket__block">' +
              '<h3>Key screens</h3>' +
              '<ol>' + listItems(brief.keyScreens) + '</ol>' +
            '</div>' +
            '<div class="ticket__block">' +
              '<h3>Constraints</h3>' +
              '<ul>' + listItems(brief.constraints) + '</ul>' +
            '</div>' +
          '</div>' +
          '<div class="ticket__block ticket__block--stack">' +
            '<h3>Deliverables</h3>' +
            '<ul>' + listItems(brief.deliverables) + '</ul>' +
          '</div>' +
          '<div class="ticket__block ticket__block--stack">' +
            '<h3>Skills you\u2019ll practice</h3>' +
            '<div class="ticket__tags">' + tagList(brief.skillsPracticed) + '</div>' +
          '</div>' +
          '<div class="ticket__meta-strip">' +
            '<div class="meta-item"><span class="meta-label">Estimated time</span><span class="meta-value">' + escapeHtml(brief.estimatedTime) + '</span></div>' +
          '</div>' +
          '<div class="ticket__actions">' +
            '<button type="button" class="btn btn--primary" id="save-btn" aria-pressed="' + saved + '">' +
              (saved ? 'Saved to your list' : 'Save to my list') +
            '</button>' +
            '<button type="button" class="btn btn--ghost" id="copy-btn">Copy brief as text</button>' +
            '<button type="button" class="btn btn--ghost" id="download-btn">Download brief</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    anotherBtn.hidden = false;

    const saveBtn = document.getElementById('save-btn');
    saveBtn.addEventListener('click', function () { handleSaveClick(brief, dateStr); });

    const copyBtn = document.getElementById('copy-btn');
    copyBtn.addEventListener('click', function () { handleCopyClick(brief, dateStr); });

    const downloadBtn = document.getElementById('download-btn');
    downloadBtn.addEventListener('click', function () { handleDownloadClick(brief, dateStr); });
  }

  function renderEmpty(message) {
    resultRegion.innerHTML =
      '<div class="empty-state" id="empty-state">' +
        '<h3>No matching brief</h3>' +
        '<p>' + escapeHtml(message) + '</p>' +
      '</div>';
    anotherBtn.hidden = true;
  }

  function generate() {
    const pool = getFilteredPool();
    persistFilters();

    if (pool.length === 0) {
      currentBrief = null;
      currentDateStr = null;
      const anyMatchAtAll = getFilteredPoolIncludingSaved().length > 0;
      renderEmpty(
        anyMatchAtAll
          ? 'You\u2019ve already saved every brief that matches this filter \u2014 check your saved list below, or try a different platform or skill level.'
          : 'There\u2019s no brief for that exact combination yet. Try a different platform or skill level.'
      );
      return;
    }

    const seen = getSeenIds();
    let unseen = pool.filter(function (b) { return !seen.has(b.ticketId); });

    if (unseen.length === 0) {
      // Every brief matching this filter has already been shown this
      // session — reset just this filter's slice of the seen list
      // (not the whole session) so its cycle can start over, without
      // touching progress on other filter combinations.
      pool.forEach(function (b) { seen.delete(b.ticketId); });
      setSeenIds(seen);
      unseen = pool;
    }

    const brief = pickBrief(unseen);
    if (!brief) return; // unreachable — unseen is never empty here, but stay defensive

    lastTicketId = brief.ticketId;
    currentBrief = brief;
    currentDateStr = todayLabel();
    markSeen(brief.ticketId);
    renderTicket(brief, currentDateStr);

    try {
      sessionStorage.setItem(CURRENT_STORAGE_KEY, JSON.stringify({
        ticketId: brief.ticketId,
        dateStr: currentDateStr
      }));
    } catch (err) {
      /* ignore */
    }

    const card = document.getElementById('ticket-card');
    if (card) card.focus({ preventScroll: false });
  }

  function restoreCurrentTicket() {
    try {
      const raw = sessionStorage.getItem(CURRENT_STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      const brief = PROJECT_BRIEFS.find(function (b) { return b.ticketId === saved.ticketId; });
      if (!brief) return;
      currentBrief = brief;
      currentDateStr = saved.dateStr;
      lastTicketId = brief.ticketId;
      renderTicket(brief, saved.dateStr);
    } catch (err) {
      /* ignore */
    }
  }

  // ---------------------------------------------------------
  // Saved briefs (sessionStorage — cleared when the session ends)
  // ---------------------------------------------------------
  function getSavedList() {
    try {
      const raw = sessionStorage.getItem(SAVED_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function setSavedList(list) {
    try {
      sessionStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      /* ignore */
    }
  }

  function saveBrief(brief, dateStr) {
    const list = getSavedList();
    if (list.some(function (item) { return item.ticketId === brief.ticketId; })) return;
    list.unshift({
      ticketId: brief.ticketId,
      title: brief.title,
      difficulty: brief.difficulty,
      platform: brief.platform,
      savedDate: dateStr
    });
    setSavedList(list);
  }

  function removeSavedBrief(ticketId) {
    const list = getSavedList().filter(function (item) { return item.ticketId !== ticketId; });
    setSavedList(list);
    renderSavedSection();
    if (currentBrief && currentBrief.ticketId === ticketId) {
      renderTicket(currentBrief, currentDateStr);
    }
    showToast('Removed from your saved list.');
  }

  function handleSaveClick(brief, dateStr) {
    saveBrief(brief, dateStr);
    renderTicket(brief, dateStr);
    renderSavedSection();
    showToast('Saved to your list.');
  }

  function formatBriefAsText(brief, dateStr) {
    return (
      brief.title + ' (' + brief.ticketId + ')\n' +
      brief.difficulty + ' \u00b7 ' + brief.platform + ' \u00b7 ' + brief.industry + '\n' +
      'Opened ' + dateStr + '\n\n' +
      'Overview\n' + brief.overview + '\n\n' +
      'Problem to solve\n' + brief.problemToSolve + '\n\n' +
      'Target users\n' + brief.targetUsers + '\n\n' +
      'Key screens\n' + brief.keyScreens.map(function (s, i) { return (i + 1) + '. ' + s; }).join('\n') + '\n\n' +
      'Constraints\n' + brief.constraints.map(function (s) { return '- ' + s; }).join('\n') + '\n\n' +
      'Deliverables\n' + brief.deliverables.map(function (s) { return '- ' + s; }).join('\n') + '\n\n' +
      'Skills practiced: ' + brief.skillsPracticed.join(', ') + '\n' +
      'Estimated time: ' + brief.estimatedTime + '\n'
    );
  }

  function handleCopyClick(brief, dateStr) {
    copyToClipboard(formatBriefAsText(brief, dateStr)).then(function () {
      showToast('Brief copied to your clipboard.');
    }).catch(function () {
      showToast('Could not copy automatically \u2014 select and copy the text manually.');
    });
  }

  function handleDownloadClick(brief, dateStr) {
    const text = formatBriefAsText(brief, dateStr);
    const ok = downloadTextFile('drafted-ux-brief-' + brief.ticketId + '.txt', text);
    showToast(ok
      ? 'Brief downloaded.'
      : 'Could not start the download in this browser.');
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  function downloadTextFile(filename, text) {
    try {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      return false;
    }
  }

  function handleDownloadSaved() {
    const list = getSavedList();
    if (list.length === 0) return;

    const divider = '\n\n' + '='.repeat(60) + '\n\n';
    const text = list.map(function (item) {
      const brief = PROJECT_BRIEFS.find(function (b) { return b.ticketId === item.ticketId; });
      return brief ? formatBriefAsText(brief, item.savedDate) : null;
    }).filter(Boolean).join(divider);

    const ok = downloadTextFile('drafted-ux-saved-briefs.txt', text);
    showToast(ok
      ? 'Downloaded ' + list.length + ' saved brief' + (list.length === 1 ? '' : 's') + '.'
      : 'Could not start the download in this browser.');
  }

  // ---------------------------------------------------------
  // Saved section rendering
  // ---------------------------------------------------------
  function renderSavedSection() {
    const list = getSavedList();

    downloadSavedBtn.hidden = list.length === 0;

    if (list.length === 0) {
      savedRegion.innerHTML =
        '<div class="empty-state">' +
          '<h3>Nothing saved yet</h3>' +
          '<p>Generate a brief above and select "Save to my list" to add it here.</p>' +
        '</div>';
      return;
    }

    savedRegion.innerHTML = '<div class="saved-list">' +
      list.map(function (item) {
        return '<div class="saved-item">' +
          '<div class="saved-item__info">' +
            '<span class="saved-item__title">' + escapeHtml(item.title) + '</span>' +
            '<span class="saved-item__meta">' + escapeHtml(item.ticketId) + ' \u00b7 ' + escapeHtml(item.difficulty) + ' \u00b7 ' + escapeHtml(item.platform) + ' \u00b7 saved ' + escapeHtml(item.savedDate) + '</span>' +
          '</div>' +
          '<div class="saved-item__actions">' +
            '<button type="button" class="btn btn--ghost btn--small" data-view="' + escapeHtml(item.ticketId) + '">View</button>' +
            '<button type="button" class="btn btn--ghost btn--small btn--danger" data-remove="' + escapeHtml(item.ticketId) + '">Remove</button>' +
          '</div>' +
        '</div>';
      }).join('') +
      '</div>';

    savedRegion.querySelectorAll('[data-view]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const ticketId = btn.getAttribute('data-view');
        const brief = PROJECT_BRIEFS.find(function (b) { return b.ticketId === ticketId; });
        const item = list.find(function (i) { return i.ticketId === ticketId; });
        if (!brief) return;
        currentBrief = brief;
        currentDateStr = item ? item.savedDate : todayLabel();
        lastTicketId = brief.ticketId;
        renderTicket(brief, currentDateStr);
        const heading = document.getElementById('result-heading');
        if (heading && typeof heading.scrollIntoView === 'function') {
          heading.scrollIntoView({ block: 'start' });
        }
      });
    });

    savedRegion.querySelectorAll('[data-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        removeSavedBrief(btn.getAttribute('data-remove'));
      });
    });
  }

  // ---------------------------------------------------------
  // Wire everything up
  // ---------------------------------------------------------
  function init() {
    initFilterOptions();
    restoreFilters();
    renderSavedSection();
    restoreCurrentTicket();

    const copyrightYearEl = document.getElementById('copyright-year');
    if (copyrightYearEl) copyrightYearEl.textContent = new Date().getFullYear();

    generatorForm.addEventListener('submit', function (e) {
      e.preventDefault();
      generate();
    });

    anotherBtn.addEventListener('click', generate);
    downloadSavedBtn.addEventListener('click', handleDownloadSaved);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
