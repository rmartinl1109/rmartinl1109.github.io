/**
 * Scoreboard Anywhere - Official App Showcase
 * Clean Vanilla ES6 JavaScript for the interactive demo & theme controls.
 * Zero external dependencies. Demo data is local and illustrative only.
 */

// ---- Demo state ----------------------------------------------------------
const demo = {
  rounds: [
    { name: 'Ana', points: [10, 30] },
    { name: 'Luis', points: [20, 5] },
    { name: 'Marta', points: [15, 12] },
  ],
  countdownStart: 301,
  countdown: [
    { name: 'Ana', turns: [60, 45] },
    { name: 'Luis', turns: [100, 20] },
  ],
  counter: [
    { name: 'Ana', value: 3 },
    { name: 'Luis', value: 5 },
  ],
  sets: [
    { name: 'Ana', sets: [6, 3] },
    { name: 'Luis', sets: [4, 6] },
  ],
  shareStep: 'request', // request -> connected
};

const randomPoints = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sum = list => list.reduce((a, b) => a + b, 0);

function countdownRemaining(player) {
  // A turn that would go below zero is a bust and does not count.
  return player.turns.reduce((left, turn) => (turn <= left ? left - turn : left), demo.countdownStart);
}

function setsWon(index) {
  return demo.sets[index].sets.filter((v, i) => v > demo.sets[1 - index].sets[i]).length;
}

const actions = {
  addRound() { demo.rounds.forEach(p => p.points.push(randomPoints(0, 30))); },
  addTurn() {
    demo.countdown.forEach(p => p.turns.push(randomPoints(20, 120)));
  },
  count(arg) {
    const [index, delta] = arg.split(':').map(Number);
    demo.counter[index].value = Math.max(0, demo.counter[index].value + delta);
  },
  addSet() { demo.sets.forEach(p => p.sets.push(randomPoints(0, 7))); },
  approve() { demo.shareStep = 'connected'; },
  resetShare() { demo.shareStep = 'request'; },
};

const avatar = name => `<span class="avatar" aria-hidden="true">${name[0]}</span>`;

// ---- Screens -------------------------------------------------------------
const screens = {
  rounds: {
    tab: 'Points by Rounds',
    render: () => {
      const rows = demo.rounds
        .map(p => ({ ...p, total: sum(p.points) }))
        .sort((a, b) => b.total - a.total);
      const roundNumber = demo.rounds[0].points.length + 1;
      return `
        <div class="screen screen--top">
          <h4 class="screen-title">Points by rounds</h4>
          <p class="screen-subtitle">Round ${roundNumber} · Most points</p>
          <div class="list-group">
            ${rows.map((p, i) => `
              <div class="list-row">
                <span class="score-name">${avatar(p.name)} ${i === 0 ? '👑 ' : ''}${p.name}</span>
                <span class="score-value">${p.total}</span>
              </div>`).join('')}
          </div>
          <button class="btn btn-primary btn-block" data-action="addRound">
            <span>Add round</span>
          </button>
        </div>`;
    },
  },
  countdown: {
    tab: 'Darts Countdown',
    render: () => {
      const rows = demo.countdown
        .map(p => ({ ...p, left: countdownRemaining(p) }))
        .sort((a, b) => a.left - b.left);
      const winner = rows[0].left === 0 ? rows[0].name : null;
      return `
        <div class="screen screen--top">
          <h4 class="screen-title">Countdown</h4>
          <p class="screen-subtitle">From ${demo.countdownStart} · Exact zero wins</p>
          <div class="list-group">
            ${rows.map((p, i) => `
              <div class="list-row">
                <span class="score-name">${avatar(p.name)} ${i === 0 ? '👑 ' : ''}${p.name}</span>
                <span class="score-value">${p.left}</span>
              </div>`).join('')}
          </div>
          ${winner ? `<p class="screen-subtitle"><strong>${winner} wins!</strong></p>` : ''}
          <button class="btn btn-primary btn-block" data-action="addTurn">
            <span>Add turn</span>
          </button>
        </div>`;
    },
  },
  counter: {
    tab: 'Simple Counter',
    render: () => `
      <div class="screen screen--top">
        <h4 class="screen-title">Simple counter</h4>
        <p class="screen-subtitle">Tap + or − to keep count</p>
        ${demo.counter.map((p, i) => `
          <div class="counter-card">
            <div class="list-row">
              <span class="score-name">${avatar(p.name)} ${p.name}</span>
              <span class="score-value">${p.value}</span>
            </div>
            <div class="counter-buttons">
              <button class="btn btn-secondary" data-action="count" data-arg="${i}:-1" aria-label="Subtract one from ${p.name}">−</button>
              <button class="btn btn-primary" data-action="count" data-arg="${i}:1" aria-label="Add one to ${p.name}">+</button>
            </div>
          </div>`).join('')}
      </div>`,
  },
  sets: {
    tab: 'Sets',
    render: () => {
      const won = demo.sets.map((_, i) => setsWon(i));
      const played = demo.sets[0].sets.length;
      const winner = won.findIndex(v => v >= 2);
      return `
        <div class="screen screen--top">
          <h4 class="screen-title">Sets match</h4>
          <p class="screen-subtitle">Set ${played + 1} · First to 2 sets</p>
          <div class="list-group">
            ${demo.sets.map((p, i) => `
              <div class="list-row">
                <span class="score-name">${avatar(p.name)} ${won[i] === Math.max(...won) && won[0] !== won[1] ? '👑 ' : ''}${p.name}</span>
                <span class="score-value">${won[i]}</span>
              </div>`).join('')}
          </div>
          <span class="list-label">Sets</span>
          <div class="list-group">
            ${demo.sets[0].sets.map((_, s) => `
              <div class="list-row">
                <span class="muted">Set ${s + 1}</span>
                <span>${demo.sets[0].sets[s]} – ${demo.sets[1].sets[s]}</span>
              </div>`).join('')}
          </div>
          ${winner >= 0 ? `<p class="screen-subtitle"><strong>${demo.sets[winner].name} wins the match!</strong></p>` : `
          <button class="btn btn-primary btn-block" data-action="addSet"><span>Add set</span></button>`}
        </div>`;
    },
  },
  share: {
    tab: 'Share the Table',
    render: () => demo.shareStep === 'request' ? `
      <div class="screen screen--top">
        <h4 class="screen-title">Share match</h4>
        <p class="screen-subtitle">Visible to nearby devices · You approve everyone</p>
        <div class="list-group">
          <div class="list-row">
            <span class="score-name">${avatar('Marta')} Marta wants to join</span>
          </div>
        </div>
        <button class="btn btn-primary btn-block" data-action="approve"><span>Approve</span></button>
      </div>` : `
      <div class="screen screen--top">
        <h4 class="screen-title">Share match</h4>
        <p class="screen-subtitle">1 device connected</p>
        <div class="list-group">
          <div class="list-row">
            <span class="score-name">${avatar('Marta')} Marta · iPad</span>
            <svg class="icon icon-sm" aria-hidden="true"><use href="#icon-check"/></svg>
          </div>
        </div>
        <p class="screen-subtitle">🔔 Marta added round 4</p>
        <button class="btn btn-secondary btn-block" data-action="resetShare"><span>Start over</span></button>
      </div>`,
  },
};

const appState = {
  currentScreen: 'rounds',
  isDarkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
};

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

  // Acciones interactivas del mockup (data-action en los botones)
  viewport.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const arg = btn.getAttribute('data-arg');
      if (actions[action]) {
        actions[action](arg);
        updateDemo();
      }
    });
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
  updateDemo();
});
