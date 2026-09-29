(function () {
  'use strict';

  const KNOWN_TIERS = [
    'Infrastructure Backer',
    'Visionary Partner',
    'Buy the Dev a Coffee',
  ];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderNames(names) {
    return '<div class="ticket__tags">' +
      names.map(function (name) {
        return '<span class="tag">' + escapeHtml(name) + '</span>';
      }).join('') +
      '</div>';
  }

  function renderEmpty(message) {
    return '<div class="empty-state"><h3>No one here yet</h3><p>' + escapeHtml(message) + '</p></div>';
  }

  function renderNotConfigured() {
    return '<div class="empty-state"><h3>Supporter list isn\u2019t connected yet</h3>' +
      '<p>This site hasn\u2019t been wired up to Patreon yet \u2014 check back soon.</p></div>';
  }

  function renderError() {
    return '<div class="empty-state"><h3>Couldn\u2019t load supporters right now</h3>' +
      '<p>Please try refreshing the page in a bit.</p></div>';
  }

  function fillTier(elementId, names, state) {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (state === 'not-configured') {
      el.innerHTML = renderNotConfigured();
    } else if (state === 'error') {
      el.innerHTML = renderError();
    } else if (!names || names.length === 0) {
      el.innerHTML = renderEmpty('Be the first supporter in this tier.');
    } else {
      el.innerHTML = renderNames(names);
    }
  }

  function renderExtraTiers(tiers) {
    const section = document.getElementById('extra-tiers-section');
    if (!section) return;
    const extraNames = Object.keys(tiers).filter(function (t) { return KNOWN_TIERS.indexOf(t) === -1; });
    if (extraNames.length === 0) return;

    section.hidden = false;
    section.innerHTML = extraNames.map(function (tier, i) {
      const names = tiers[tier];
      const body = names && names.length
        ? renderNames(names)
        : renderEmpty('Be the first supporter in this tier.');
      return (
        '<div class="result-section"><div class="wrap">' +
          '<div class="section-head"><div>' +
            '<h2 id="extra-tier-heading-' + i + '">' + escapeHtml(tier) + '</h2>' +
          '</div></div>' +
          '<div class="supporter-list">' + body + '</div>' +
        '</div></div>'
      );
    }).join('');
  }

  function formatUpdatedAt(iso) {
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
      }).format(new Date(iso));
    } catch (err) {
      return '';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/patrons')
      .then(function (res) {
        if (!res.ok) throw new Error('Bad response');
        return res.json();
      })
      .then(function (data) {
        const tiers = data.tiers || {};

        if (data.configured === false) {
          KNOWN_TIERS.forEach(function (tier, i) {
            fillTier('tier-list-' + i, null, 'not-configured');
          });
          return;
        }

        if (data.error) {
          KNOWN_TIERS.forEach(function (tier, i) {
            fillTier('tier-list-' + i, null, 'error');
          });
          return;
        }

        KNOWN_TIERS.forEach(function (tier, i) {
          fillTier('tier-list-' + i, tiers[tier] || []);
        });
        renderExtraTiers(tiers);

        const updatedEl = document.getElementById('last-updated');
        if (updatedEl && data.updatedAt) {
          const formatted = formatUpdatedAt(data.updatedAt);
          if (formatted) updatedEl.textContent = 'Supporter list last refreshed ' + formatted + '.';
        }
      })
      .catch(function () {
        KNOWN_TIERS.forEach(function (tier, i) {
          fillTier('tier-list-' + i, null, 'error');
        });
      });
  });
})();
