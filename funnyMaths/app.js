/**
 * Funny Maths - landing page
 * Clean Vanilla ES6 JavaScript for the interactive demo and the theme toggle.
 * Zero external dependencies.
 */

const icon = (id, size = 'icon icon-lg') => `<svg class="${size}" aria-hidden="true"><use href="#${id}"/></svg>`;
const TILE_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/* ---------- Interactive sum (the same rules as the app) ---------- */

const sum = { a: 47, b: 25, answer: [], placed: [], status: 'idle' };

function slotCount() {
  return String(sum.a + sum.b).length;
}

function resetAnswer() {
  sum.answer = Array(slotCount()).fill(null);
  sum.placed = [];
  sum.status = 'idle';
}

function newSum() {
  sum.a = randomBetween(11, 59);
  sum.b = randomBetween(11, 59);
  resetAnswer();
}

/** Like the app: tapped tiles fill the boxes from the units, right to left. */
function placeDigit(digit) {
  const slot = sum.answer.lastIndexOf(null);
  if (slot === -1) return;
  sum.answer[slot] = digit;
  sum.placed.push(slot);
}

function undoDigit() {
  const slot = sum.placed.pop();
  if (slot !== undefined) sum.answer[slot] = null;
}

let retryTimer = null;

function checkIfComplete() {
  if (sum.answer.includes(null)) return;
  const attempt = Number(sum.answer.join(''));
  if (attempt === sum.a + sum.b) {
    sum.status = 'ok';
    return;
  }
  sum.status = 'retry';
  clearTimeout(retryTimer);
  retryTimer = setTimeout(() => {
    resetAnswer();
    updateDemo();
  }, 1100);
}

/* ---------- Demo screens ---------- */

const screens = {
  home: {
    tab: 'Home',
    render: () => `
      <div class="screen screen--top">
        <div>
          <h4 class="screen-title">Funny Maths</h4>
          <p class="screen-subtitle">Mental maths training</p>
        </div>
        <div class="chalk-menu">
          <button class="chalk-card" data-action="go" data-screen="tables">
            ${icon('icon-table')}<span><strong>Tables</strong><small>Practise the tables from 0 to 9</small></span>
          </button>
          <button class="chalk-card" data-action="go" data-screen="sums">
            ${icon('icon-plus')}<span><strong>Additions</strong><small>Column sums, with or without carries</small></span>
          </button>
          <div class="chalk-card">
            ${icon('icon-x')}<span><strong>Multiplications</strong><small>Long multiplication by one digit</small></span><span class="chalk-pill">Pro</span>
          </div>
          <div class="chalk-card">
            ${icon('icon-timer')}<span><strong>Trainer</strong><small>Timed practice with your own settings</small></span>
          </div>
          <button class="chalk-card" data-action="go" data-screen="progress">
            ${icon('icon-chart')}<span><strong>My Progress</strong><small>See what you know and what is tricky</small></span>
          </button>
        </div>
      </div>
    `
  },
  tables: {
    tab: 'Tables',
    render: () => `
      <div class="screen screen--top">
        <h4 class="screen-title">Tables</h4>
        <p class="screen-subtitle">The table of 7, multiplication</p>
        <div class="times-table" role="list">
          ${Array.from({ length: 10 }, (_, n) => `
            <span role="listitem">7 × ${n}</span><span role="listitem">= ${7 * n}</span>
          `).join('')}
        </div>
      </div>
    `
  },
  sums: {
    tab: 'Sums',
    render: () => {
      const message = {
        idle: '',
        ok: 'Well done!',
        retry: 'Not quite, try again'
      }[sum.status];
      const slots = sum.answer.map(digit =>
        `<span class="slot ${digit === null ? '' : 'slot--full'}">${digit === null ? '' : digit}</span>`
      ).join('');
      const tiles = TILE_ORDER.map(digit =>
        `<button class="tile" data-tile="${digit}" data-action="tile" data-digit="${digit}" aria-label="${digit}">${digit}</button>`
      ).join('');
      const controls = sum.status === 'ok'
        ? '<button class="btn-chalk btn-chalk--prime" data-action="next">Next</button>'
        : `<button class="btn-chalk" data-action="undo" ${sum.placed.length === 0 ? 'disabled' : ''}>Delete</button>`;
      return `
        <div class="screen screen--top">
          <h4 class="screen-title">Additions</h4>
          <div class="sum" role="img" aria-label="${sum.a} plus ${sum.b}">
            <span>${sum.a}</span>
            <span><span class="sum-op">+</span>&nbsp;${sum.b}</span>
            <div class="sum-slots">${slots}</div>
          </div>
          <p class="feedback feedback--${sum.status}" aria-live="polite">${message}</p>
          ${sum.status === 'ok' ? '' : `<div class="tile-grid">${tiles}</div>`}
          <div class="stack">${controls}</div>
        </div>
      `;
    }
  },
  progress: {
    tab: 'My Progress',
    render: () => `
      <div class="screen screen--top">
        <div>
          <h4 class="screen-title">My Progress</h4>
          <p class="screen-subtitle">Example data</p>
        </div>
        <div class="stack">
          ${[
            ['Addition', 62],
            ['Subtraction', 41],
            ['Multiplication', 28],
            ['Division', 12]
          ].map(([name, percent]) => `
            <div class="stack">
              <span class="list-label">${name} · ${percent} of 100 mastered</span>
              <div class="chalk-bar"><span class="chalk-bar-track"><span class="chalk-bar-fill" style="width: ${percent}%"></span></span></div>
            </div>
          `).join('')}
        </div>
        <div class="chalk-card">
          ${icon('icon-timer')}<span><strong>Time to review</strong><small>6 operations ready</small></span>
        </div>
      </div>
    `
  },
  parents: {
    tab: 'Parents',
    render: () => `
      <div class="screen screen--top">
        <div>
          <h4 class="screen-title">Parent Dashboard <span class="chalk-pill">Pro</span></h4>
          <p class="screen-subtitle">Example data</p>
        </div>
        <div class="stack">
          <span class="list-label">Answers in the last 7 days</span>
          <div class="chalk-bars" aria-hidden="true">
            ${[30, 55, 20, 70, 45, 85, 60].map(height => `<span style="height: ${height}%"></span>`).join('')}
          </div>
        </div>
        <div class="stack">
          <span class="list-label">Accuracy by operation</span>
          <div class="list-group">
            <div class="list-row"><span>Addition</span><span>94 %</span></div>
            <div class="list-row"><span>Subtraction</span><span>88 %</span></div>
            <div class="list-row"><span>Multiplication</span><span>71 %</span></div>
          </div>
        </div>
      </div>
    `
  }
};

const appState = {
  currentScreen: 'home',
  isDarkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
};

/* ---------- Actions triggered from inside the mockup ---------- */

const actions = {
  go: ({ screen }) => {
    if (screens[screen]) appState.currentScreen = screen;
  },
  tile: ({ digit }) => {
    if (sum.status !== 'idle') return;
    placeDigit(Number(digit));
    checkIfComplete();
  },
  undo: () => {
    if (sum.status === 'idle') undoDigit();
  },
  next: () => newSum()
};

/* ---------- Theme ---------- */

function applyTheme(isDark) {
  appState.isDarkMode = isDark;
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  try {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  } catch (_) {}
}

/* ---------- Rendering ---------- */

function renderScreenTabs() {
  const container = document.getElementById('screen-tabs');
  if (!container) return;

  container.innerHTML = Object.entries(screens).map(([key, data]) => {
    const isSelected = key === appState.currentScreen;
    return `
      <button
        class="tab"
        role="tab"
        aria-selected="${isSelected}"
        data-screen="${key}"
      >
        ${data.tab}
      </button>
    `;
  }).join('');

  container.querySelectorAll('button[data-screen]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-screen');
      if (target && screens[target]) {
        appState.currentScreen = target;
        updateDemo();
      }
    });
  });
}

function updateDemo() {
  renderScreenTabs();
  const viewport = document.getElementById('demo-viewport');
  if (!viewport || !screens[appState.currentScreen]) return;
  viewport.innerHTML = screens[appState.currentScreen].render();
}

function setUpDemoActions() {
  const viewport = document.getElementById('demo-viewport');
  if (!viewport) return;

  viewport.addEventListener('click', event => {
    const target = event.target.closest('[data-action]');
    if (!target || target.disabled) return;
    const { action, digit } = target.dataset;
    actions[action]?.(target.dataset);
    updateDemo();

    // The clicked button is replaced when the screen re-renders: keep the keyboard focus on its twin.
    const selector = digit === undefined
      ? `[data-action="${action}"]`
      : `[data-action="${action}"][data-digit="${digit}"]`;
    viewport.querySelector(selector)?.focus();
  });
}

function updateClock() {
  const clock = document.getElementById('demo-clock');
  if (clock) {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    clock.textContent = `${h}:${m}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Theme initialization
  const saved = (function() {
    try { return localStorage.getItem('theme'); } catch (_) { return null; }
  })();
  if (saved === 'dark' || (saved === null && appState.isDarkMode)) {
    applyTheme(true);
  } else {
    applyTheme(false);
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      applyTheme(!appState.isDarkMode);
    });
  }

  // Live preview clock
  updateClock();
  setInterval(updateClock, 10000);

  // Initial mockup render
  resetAnswer();
  setUpDemoActions();
  updateDemo();
});
