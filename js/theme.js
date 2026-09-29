/**
 * Theme handling.
 *
 * The site always loads matching the visitor's OS/browser color-scheme
 * preference — there's no persisted "remembered" override that would
 * make it diverge from that on a later visit. The in-page toggle still
 * works, but only for the current tab/session: it doesn't get saved,
 * so the next full page load goes back to following the system
 * setting fresh. While the tab stays open, if the OS preference
 * itself changes (e.g. the system switches to dark mode at sunset),
 * the site follows along live — unless the person has manually
 * toggled during this session, in which case their explicit choice
 * wins until they reload.
 */
(function () {
  const root = document.documentElement;
  const darkMediaQuery = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  let manuallySetThisSession = false;

  function systemPrefersDark() {
    return !!(darkMediaQuery && darkMediaQuery.matches);
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    // Keep the browser-chrome theme-color meta tag in sync with the
    // actual active theme.
    const themeColorMeta = document.getElementById('theme-color-meta');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'dark' ? '#0E2A47' : '#E9EEF3');
    }

    // Same idea for the favicon — the two uploaded icons are each
    // designed to stand out against one specific tab-bar color, so
    // this keeps the visible one matching whichever theme is active,
    // including a manual toggle, not just the OS setting.
    const faviconLink = document.getElementById('favicon-link');
    if (faviconLink) {
      faviconLink.setAttribute('href', theme === 'dark' ? 'favicon-dark.png' : 'favicon-light.png');
    }
  }

  function updateToggleUI(theme) {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    const isDark = theme === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  // Apply as early as possible (before DOMContentLoaded) to avoid a
  // flash of the wrong theme.
  applyTheme(systemPrefersDark() ? 'dark' : 'light');

  document.addEventListener('DOMContentLoaded', function () {
    updateToggleUI(systemPrefersDark() ? 'dark' : 'light');

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        manuallySetThisSession = true;
        applyTheme(next);
        updateToggleUI(next);
      });
    }
  });

  // Live-follow the OS setting if it changes while the tab is open,
  // as long as the person hasn't manually overridden it this session.
  if (darkMediaQuery) {
    const handleSystemChange = function (e) {
      if (manuallySetThisSession) return;
      const next = e.matches ? 'dark' : 'light';
      applyTheme(next);
      updateToggleUI(next);
    };
    if (typeof darkMediaQuery.addEventListener === 'function') {
      darkMediaQuery.addEventListener('change', handleSystemChange);
    } else if (typeof darkMediaQuery.addListener === 'function') {
      // Safari < 14 fallback
      darkMediaQuery.addListener(handleSystemChange);
    }
  }
})();
