/**
 * CountFlow - Official App Showcase
 * Clean Vanilla ES6 JavaScript for interactive demo & theme controls
 */

// Simulated Demo State
const appState = {
  currentScreen: 'counters', // 'counters', 'calendar', 'edit', 'settings', 'paywall'
  isDarkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
  selectedDate: { dayNumber: 4, count: 16 },
  hapticsEnabled: true,
  themeMode: 'system',
  selectedCategoryFilter: 'all',
  isPro: false,
  freeCountersLimit: 2,
  counters: [
    { id: 'water', name: 'Daily Water', category: 'health', categoryName: 'Health', icon: 'drop.fill', emoji: '💧', color: '#0A84FF', unit: 'glasses', today: 6, month: 180, goal: 8 }
  ],
  extraProCounters: [
    { id: 'workout', name: 'Workout', category: 'fitness', categoryName: 'Fitness', icon: 'figure.run', emoji: '🏃', color: '#30D158', unit: 'sets', today: 4, month: 42, goal: 5 },
    { id: 'reading', name: 'Reading', category: 'study', categoryName: 'Study', icon: 'book.fill', emoji: '📚', color: '#BF5AF2', unit: 'pages', today: 25, month: 320, goal: 20 },
    { id: 'coffee', name: 'Coffee', category: 'habits', categoryName: 'Habits', icon: 'cup.and.saucer.fill', emoji: '☕️', color: '#FF9F0A', unit: 'cups', today: 2, month: 48, goal: 3 }
  ],
  records: {
    1: 8,
    2: 7,
    3: 8,
    4: 6,
    5: 8,
    8: 7,
    9: 8,
    10: 9,
    11: 8,
    12: 8
  }
};

// Calculate metrics from records
function getMetrics() {
  const values = Object.values(appState.records).filter(v => v > 0);
  const total = values.reduce((sum, v) => sum + v, 0);
  const workedDays = values.length;
  const average = workedDays > 0 ? (total / workedDays).toFixed(1) : '0';
  const record = values.length > 0 ? Math.max(...values) : 0;
  return { total, workedDays, average, record };
}

// Render screens in the in-browser iPhone mockup
function renderPhoneDemo() {
  const viewport = document.getElementById('demo-viewport');
  if (!viewport) return;

  const metrics = getMetrics();

  if (appState.currentScreen === 'counters') {
    const categoriesList = [
      { id: 'all', name: 'All', icon: '🏷️', count: appState.counters.length },
      { id: 'work', name: 'Work', icon: '💼', count: appState.counters.filter(c => c.category === 'work').length },
      { id: 'fitness', name: 'Fitness', icon: '🏃', count: appState.counters.filter(c => c.category === 'fitness').length },
      { id: 'health', name: 'Health', icon: '❤️', count: appState.counters.filter(c => c.category === 'health').length },
      { id: 'study', name: 'Study', icon: '🎓', count: appState.counters.filter(c => c.category === 'study').length }
    ];

    const displayedCounters = appState.selectedCategoryFilter === 'all'
      ? appState.counters
      : appState.counters.filter(c => c.category === appState.selectedCategoryFilter);

    const isLimitReached = !appState.isPro && appState.counters.length >= appState.freeCountersLimit;

    viewport.innerHTML = `
      <div class="flex-1 flex flex-col justify-start text-left select-none">
        <!-- iOS Navigation Bar -->
        <div class="flex items-center justify-between py-2">
          <button id="demo-nav-settings" class="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:scale-105 active:scale-95 transition">
            <span class="text-sm">⚙️</span>
          </button>
          
          <div class="flex items-center space-x-2">
            ${!appState.isPro ? `
              <button id="demo-nav-pro" class="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[10px] flex items-center space-x-1 shadow-sm hover:scale-105 active:scale-95 transition">
                <span>👑</span>
                <span>PRO</span>
              </button>
            ` : `
              <span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-extrabold text-[9px] flex items-center space-x-1">
                <span>👑</span>
                <span>PRO</span>
              </span>
            `}
            <button id="demo-nav-add" class="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:scale-105 active:scale-95 transition">
              <span class="font-bold text-base leading-none">+</span>
            </button>
          </div>
        </div>

        <div class="pt-1 pb-2">
          <h3 class="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">CountFlow</h3>
        </div>

        <!-- Category Filter Pills Bar -->
        <div class="flex items-center space-x-1.5 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-none">
          ${categoriesList.map(cat => {
            const isSelected = appState.selectedCategoryFilter === cat.id;
            return `
              <button class="demo-cat-filter px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center space-x-1 ${isSelected ? 'bg-blue-600 text-white shadow-sm' : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300'}" data-category="${cat.id}">
                <span>${cat.icon}</span>
                <span>${cat.name}</span>
                <span class="text-[9px] px-1 py-0.2 rounded-full ${isSelected ? 'bg-white/25 text-white' : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'} font-bold">${cat.count}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- 2x2 Square Grid of Counters -->
        <div class="grid grid-cols-2 gap-2.5 pb-2">
          ${displayedCounters.map(counter => `
            <div class="demo-counter-card aspect-square p-2.5 rounded-2xl bg-white dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 shadow-sm flex flex-col justify-between transition hover:shadow-md cursor-pointer" data-counter-id="${counter.id}">
              <!-- Header -->
              <div class="flex items-start justify-between">
                <div class="w-8 h-8 rounded-xl flex items-center justify-center text-base" style="background-color: ${counter.color}25;">
                  <span>${counter.emoji}</span>
                </div>
                <span class="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-700/80 text-zinc-500 dark:text-zinc-400">${counter.categoryName}</span>
                <button class="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 px-0.5 font-bold text-xs">•••</button>
              </div>

              <!-- Name & Monthly Total -->
              <div class="my-auto">
                <span class="block font-bold text-xs text-zinc-900 dark:text-white truncate">${counter.name}</span>
                <span class="block text-[10px] text-zinc-400 truncate">${counter.month} this month · ${counter.unit}</span>
                ${counter.goal > 0 ? `
                  <div class="w-full bg-zinc-100 dark:bg-zinc-700/60 rounded-full h-1 mt-1.5 overflow-hidden">
                    <div class="h-full rounded-full" style="width: ${Math.min(100, (counter.today / counter.goal) * 100)}%; background-color: ${counter.color};"></div>
                  </div>
                ` : ''}
              </div>

              <!-- Stepper Controls -->
              <div class="flex items-center justify-between pt-1">
                <button class="demo-card-minus w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-white font-bold text-xs flex items-center justify-center transition active:scale-90" data-id="${counter.id}">
                  –
                </button>
                <div class="text-center">
                  <span class="block text-base font-black leading-none font-mono" style="color: ${counter.color};">${counter.today}</span>
                  <span class="block text-[7px] uppercase font-bold text-zinc-400">Today</span>
                </div>
                <button class="demo-card-plus w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center transition active:scale-90 shadow-sm" style="background-color: ${counter.color};" data-id="${counter.id}">
                  +
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Freemium Limit Banner if 2/2 reached -->
        ${isLimitReached ? `
          <div id="demo-upgrade-banner" class="mt-1 p-2 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 flex items-center justify-between cursor-pointer hover:bg-amber-500/25 transition">
            <div class="flex items-center space-x-2">
              <span class="text-sm">👑</span>
              <div>
                <span class="block text-[10px] font-bold text-amber-600 dark:text-amber-400 leading-tight">Free limit reached (2/2)</span>
                <span class="block text-[8px] text-zinc-400">Tap to unlock unlimited counters</span>
              </div>
            </div>
            <span class="text-[9px] font-extrabold text-amber-500">PRO ›</span>
          </div>
        ` : ''}

        <p class="text-[10px] text-center text-zinc-400 dark:text-zinc-500 pt-1">
          💡 Filter by category above, tap + / – to count, or tap a card to view calendar
        </p>
      </div>
    `;
  } else if (appState.currentScreen === 'calendar') {
    // Generate mini calendar grid
    let daysHTML = '';
    for (let p = 0; p < 3; p++) {
      daysHTML += `<div class="h-10 flex flex-col items-center justify-center text-[10px] text-zinc-400 dark:text-zinc-600 opacity-40"><span>${28 + p}</span></div>`;
    }

    for (let d = 1; d <= 31; d++) {
      const count = appState.records[d] || 0;
      const isToday = d === 4;
      daysHTML += `
        <button data-day="${d}" class="demo-day-cell h-11 rounded-lg flex flex-col items-center justify-center transition active:scale-90 ${isToday ? 'bg-blue-600/10 dark:bg-blue-500/20 ring-1.5 ring-blue-500' : (count > 0 ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-800/40')}">
          <span class="text-[11px] font-semibold ${isToday ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-zinc-800 dark:text-zinc-200'}">${d}</span>
          ${count > 0 
            ? `<span class="text-[9px] font-bold px-1 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 leading-tight">💧 ${count}</span>` 
            : `<span class="text-[9px] text-zinc-300 dark:text-zinc-700 leading-tight">—</span>`}
        </button>
      `;
    }

    viewport.innerHTML = `
      <div class="flex-1 flex flex-col justify-start space-y-3 text-left">
        <!-- Month Navigation Header -->
        <div class="flex items-center justify-between pt-1">
          <button id="demo-back-to-counters" class="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center space-x-1">
            <span>‹ Counters</span>
          </button>
          <span class="font-extrabold text-sm text-zinc-900 dark:text-white">Daily Water • Oct 2026</span>
          <span class="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[9px] font-bold">
            Today
          </span>
        </div>

        <!-- Monthly Overview Card -->
        <div class="p-3 rounded-2xl bg-white dark:bg-zinc-800/90 shadow-sm border border-zinc-200/80 dark:border-zinc-700/80 space-y-2">
          <div class="flex items-center space-x-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200">
            <span>📊 Monthly Summary</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center space-x-2">
              <span class="text-sm">💧</span>
              <div>
                <span class="block font-bold text-zinc-900 dark:text-white">${metrics.total}</span>
                <span class="block text-[9px] text-zinc-400 leading-none">Total Glasses</span>
              </div>
            </div>
            <div class="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center space-x-2">
              <span class="text-sm">📅</span>
              <div>
                <span class="block font-bold text-zinc-900 dark:text-white">${metrics.workedDays}</span>
                <span class="block text-[9px] text-zinc-400 leading-none">Days Active</span>
              </div>
            </div>
            <div class="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center space-x-2">
              <span class="text-sm">📈</span>
              <div>
                <span class="block font-bold text-zinc-900 dark:text-white">${metrics.average}</span>
                <span class="block text-[9px] text-zinc-400 leading-none">Daily Average</span>
              </div>
            </div>
            <div class="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center space-x-2">
              <span class="text-sm">🏆</span>
              <div>
                <span class="block font-bold text-amber-500">${metrics.record}</span>
                <span class="block text-[9px] text-zinc-400 leading-none">Best Day</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
          <div class="grid grid-cols-7 gap-1 text-[10px] text-center font-bold text-zinc-400 dark:text-zinc-500 pb-1">
            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
          </div>
          <div class="grid grid-cols-7 gap-1">
            ${daysHTML}
          </div>
        </div>

        <p class="text-[10px] text-center text-zinc-400 dark:text-zinc-500 pt-1">
          💡 Tap any day to quickly change count
        </p>
      </div>
    `;
  } else if (appState.currentScreen === 'edit') {
    const dayNum = appState.selectedDate.dayNumber;
    const currentCount = appState.selectedDate.count;
    const presets = [0, 2, 4, 6, 8, 10, 12, 14, 16];

    viewport.innerHTML = `
      <div class="flex-1 flex flex-col justify-between py-1 text-center">
        <!-- Header -->
        <div class="space-y-1 pt-1">
          <div class="w-10 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto mb-3"></div>
          <span class="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Sunday, October ${dayNum}, 2026
          </span>
          <h4 class="font-extrabold text-lg text-zinc-900 dark:text-white">Daily Water</h4>
        </div>

        <!-- Large Counter Stepper -->
        <div class="my-auto py-4">
          <div class="flex items-center justify-center space-x-6">
            <button id="demo-counter-minus" class="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-white font-bold text-xl flex items-center justify-center transition active:scale-90 shadow-sm">
              –
            </button>
            <span id="demo-counter-value" class="text-6xl font-black tracking-tight text-zinc-950 dark:text-white w-24 text-center font-mono">
              ${currentCount}
            </span>
            <button id="demo-counter-plus" class="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl flex items-center justify-center transition active:scale-90 shadow-md shadow-blue-500/30">
              +
            </button>
          </div>
          <span class="block text-[11px] text-zinc-400 mt-2 font-medium">Glasses Counted</span>
        </div>

        <!-- Presets -->
        <div class="space-y-1.5 pb-2 text-left">
          <span class="text-[10px] uppercase font-bold text-zinc-400 px-1">Quick Presets</span>
          <div class="grid grid-cols-5 gap-1.5">
            ${presets.map(p => `
              <button data-preset="${p}" class="demo-preset-btn py-1.5 rounded-lg text-xs font-bold transition active:scale-95 ${p === currentCount ? 'bg-blue-600 text-white shadow-sm' : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300'}">
                ${p}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-2 pt-2">
          <button id="demo-save-btn" class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition active:scale-95">
            Save Record
          </button>
          <div class="flex space-x-2">
            <button id="demo-clear-btn" class="flex-1 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold text-xs transition active:scale-95">
              Clear Day
            </button>
            <button id="demo-cancel-btn" class="flex-1 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition active:scale-95">
              Cancel
            </button>
          </div>
        </div>
      </div>
    `;
  } else if (appState.currentScreen === 'settings') {
    viewport.innerHTML = `
      <div class="flex-1 flex flex-col justify-start py-1 space-y-3 text-left">
        <!-- Settings Header -->
        <div class="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <span class="font-extrabold text-base text-zinc-900 dark:text-white">Settings</span>
          <button id="demo-settings-done" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            Done
          </button>
        </div>

        <!-- Pro Membership Section -->
        <div class="p-3 rounded-2xl bg-white dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="text-sm">👑</span>
              <div>
                <span class="block text-xs font-bold text-zinc-900 dark:text-white">
                  ${appState.isPro ? 'CountFlow Pro Active' : 'Free Version (2/2 Active)'}
                </span>
                <span class="block text-[10px] text-zinc-400">
                  ${appState.isPro ? 'Lifetime Unlimited Access' : 'Upgrade for unlimited counters'}
                </span>
              </div>
            </div>
            ${!appState.isPro ? `
              <button id="demo-settings-upgrade" class="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[10px] shadow-sm hover:scale-105 active:scale-95 transition">
                Upgrade
              </button>
            ` : `
              <span class="text-emerald-500 font-bold text-xs">✓ Active</span>
            `}
          </div>
          ${!appState.isPro ? `
            <button id="demo-settings-restore" class="w-full text-center text-[10px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 font-semibold pt-1">
              Restore Purchases
            </button>
          ` : ''}
        </div>

        <!-- Appearance Section -->
        <div class="p-3 rounded-2xl bg-white dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 space-y-2">
          <span class="block text-[10px] uppercase font-bold text-zinc-400">Appearance Mode</span>
          <div class="grid grid-cols-3 gap-1.5 text-xs font-semibold">
            <button id="demo-theme-system" class="p-2 rounded-xl border flex flex-col items-center justify-center space-y-1 ${appState.themeMode === 'system' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600' : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'}">
              <span class="text-sm">🌓</span>
              <span class="text-[10px]">Auto</span>
            </button>
            <button id="demo-theme-light" class="p-2 rounded-xl border flex flex-col items-center justify-center space-y-1 ${appState.themeMode === 'light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600' : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'}">
              <span class="text-sm">☀️</span>
              <span class="text-[10px]">Light</span>
            </button>
            <button id="demo-theme-dark" class="p-2 rounded-xl border flex flex-col items-center justify-center space-y-1 ${appState.themeMode === 'dark' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600' : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'}">
              <span class="text-sm">🌙</span>
              <span class="text-[10px]">Dark</span>
            </button>
          </div>
        </div>

        <!-- Preferences Section -->
        <div class="p-3 rounded-2xl bg-white dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <span class="block text-xs font-bold text-zinc-900 dark:text-white">Haptic Feedback</span>
              <span class="block text-[10px] text-zinc-400">Vibrate on counter taps</span>
            </div>
            <button id="demo-toggle-haptics" class="w-10 h-6 rounded-full transition p-0.5 ${appState.hapticsEnabled ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-700'}">
              <div class="w-5 h-5 rounded-full bg-white shadow-sm transform transition ${appState.hapticsEnabled ? 'translate-x-4' : 'translate-x-0'}"></div>
            </button>
          </div>
        </div>

        <!-- CloudKit Sync -->
        <div class="p-3 rounded-2xl bg-white dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center justify-between text-xs">
          <div class="flex items-center space-x-2">
            <span class="text-sm">☁️</span>
            <div>
              <span class="block font-bold text-zinc-900 dark:text-white">iCloud Sync</span>
              <span class="block text-[10px] text-zinc-400">Active via SwiftData</span>
            </div>
          </div>
          <span class="text-emerald-500 font-bold text-sm">✓</span>
        </div>

        <!-- App Info -->
        <div class="p-3 rounded-2xl bg-white dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 text-center space-y-1">
          <span class="block text-xs font-bold text-zinc-900 dark:text-white">CountFlow v1.0.0</span>
          <span class="block text-[10px] text-zinc-400">Universal Habit & Quantity Tracker for Apple Devices</span>
        </div>
      </div>
    `;
  } else if (appState.currentScreen === 'paywall') {
    viewport.innerHTML = `
      <div class="flex-1 flex flex-col justify-between py-1 text-left select-none overflow-y-auto">
        
        <!-- Paywall Top Bar with Close Button -->
        <div class="flex justify-end pt-1">
          <button id="demo-paywall-close" class="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 font-bold text-xs hover:scale-105 active:scale-95 transition">
            ✕
          </button>
        </div>

        <!-- Hero Header -->
        <div class="text-center space-y-1.5 py-2">
          <div class="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30">
            👑
          </div>
          <h3 class="text-xl font-black text-zinc-950 dark:text-white tracking-tight">CountFlow Pro</h3>
          <p class="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-[240px] mx-auto">
            Unlock the full power of CountFlow with unlimited counters and premium tools.
          </p>
        </div>

        <!-- Features List -->
        <div class="space-y-2 py-2">
          <div class="p-2 rounded-xl bg-white dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center space-x-2.5">
            <span class="text-base">♾️</span>
            <div>
              <span class="block text-xs font-bold text-zinc-900 dark:text-white">Unlimited Counters</span>
              <span class="block text-[9px] text-zinc-400">Free starter limited to 2 active counters</span>
            </div>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center space-x-2.5">
            <span class="text-base">🎨</span>
            <div>
              <span class="block text-xs font-bold text-zinc-900 dark:text-white">Full Color Customization</span>
              <span class="block text-[9px] text-zinc-400">Custom hex palettes and native iOS ColorPicker</span>
            </div>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center space-x-2.5">
            <span class="text-base">💼</span>
            <div>
              <span class="block text-xs font-bold text-zinc-900 dark:text-white">All Activity Categories</span>
              <span class="block text-[9px] text-zinc-400">Work, Habits, Fitness, Finance, Study & more</span>
            </div>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center space-x-2.5">
            <span class="text-base">📱</span>
            <div>
              <span class="block text-xs font-bold text-zinc-900 dark:text-white">Interactive iOS Widgets</span>
              <span class="block text-[9px] text-zinc-400">Home & Lock Screen widgets with one-tap + / -</span>
            </div>
          </div>
          <div class="p-2 rounded-xl bg-white dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-zinc-700/80 flex items-center space-x-2.5">
            <span class="text-base">⚡️</span>
            <div>
              <span class="block text-xs font-bold text-zinc-900 dark:text-white">One-Time Lifetime Purchase</span>
              <span class="block text-[9px] text-zinc-400">Pay once, own forever. Zero subscriptions</span>
            </div>
          </div>
        </div>

        <!-- Purchase Action & Terms -->
        <div class="space-y-2 pt-2">
          ${!appState.isPro ? `
            <button id="demo-paywall-buy" class="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-amber-500/30 hover:opacity-95 active:scale-95 transition flex items-center justify-center space-x-2">
              <span>👑</span>
              <span>Unlock CountFlow Pro — $1.99</span>
            </button>
          ` : `
            <div class="w-full py-3 rounded-2xl bg-emerald-500 text-white font-extrabold text-xs text-center shadow-lg shadow-emerald-500/30">
              ✓ You Own CountFlow Pro Lifetime
            </div>
          `}

          <div class="flex items-center justify-between text-[9px] text-zinc-400 px-2">
            <button id="demo-paywall-restore" class="hover:text-zinc-600 dark:hover:text-zinc-200 underline font-semibold">
              Restore Purchases
            </button>
            <span>One-Time Non-Consumable</span>
          </div>

          <p class="text-[8px] text-zinc-400 dark:text-zinc-500 text-center leading-tight">
            Terms of Use (EULA) & Privacy Policy apply via Apple StoreKit 2.
          </p>
        </div>

      </div>
    `;
  }

  attachPhoneEventListeners();
}

// Helper function to activate Pro in the demo
function activateProInDemo(message = '🎉 CountFlow Pro Unlocked! Unlimited counters & features now available.') {
  appState.isPro = true;
  // Merge extra counters if not already present
  appState.extraProCounters.forEach(extra => {
    if (!appState.counters.some(c => c.id === extra.id)) {
      appState.counters.push(extra);
    }
  });
  alert(message);
  appState.currentScreen = 'counters';
  updateDemoUI();
}

// Attach event listeners for phone interactive controls
function attachPhoneEventListeners() {
  // Paywall Open Buttons
  const navProBtn = document.getElementById('demo-nav-pro');
  if (navProBtn) {
    navProBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      appState.currentScreen = 'paywall';
      updateDemoUI();
    });
  }

  const upgradeBanner = document.getElementById('demo-upgrade-banner');
  if (upgradeBanner) {
    upgradeBanner.addEventListener('click', (e) => {
      e.stopPropagation();
      appState.currentScreen = 'paywall';
      updateDemoUI();
    });
  }

  const settingsUpgradeBtn = document.getElementById('demo-settings-upgrade');
  if (settingsUpgradeBtn) {
    settingsUpgradeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      appState.currentScreen = 'paywall';
      updateDemoUI();
    });
  }

  const settingsRestoreBtn = document.getElementById('demo-settings-restore');
  if (settingsRestoreBtn) {
    settingsRestoreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      activateProInDemo('✓ Purchase restored successfully! CountFlow Pro is active.');
    });
  }

  // Paywall Actions
  const paywallClose = document.getElementById('demo-paywall-close');
  if (paywallClose) {
    paywallClose.addEventListener('click', () => {
      appState.currentScreen = 'counters';
      updateDemoUI();
    });
  }

  const paywallBuy = document.getElementById('demo-paywall-buy');
  if (paywallBuy) {
    paywallBuy.addEventListener('click', () => {
      activateProInDemo('🎉 Congratulations! You have unlocked CountFlow Pro (Lifetime).');
    });
  }

  const paywallRestore = document.getElementById('demo-paywall-restore');
  if (paywallRestore) {
    paywallRestore.addEventListener('click', () => {
      activateProInDemo('✓ Purchases restored! CountFlow Pro is active on your Apple ID.');
    });
  }

  // Add Counter Button with 2 Counters Limit check
  const addCounterBtn = document.getElementById('demo-nav-add');
  if (addCounterBtn) {
    addCounterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!appState.isPro && appState.counters.length >= appState.freeCountersLimit) {
        // Freemium limit triggered! Open paywall
        appState.currentScreen = 'paywall';
        updateDemoUI();
      } else {
        alert('ℹ️ Counter creation form is ready. In this simulator, tap Pro to unlock all sample counters.');
      }
    });
  }

  // Category Filter Pills
  document.querySelectorAll('.demo-cat-filter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cat = btn.getAttribute('data-category');
      appState.selectedCategoryFilter = cat;
      renderPhoneDemo();
    });
  });

  // Counters Grid Card Plus/Minus
  document.querySelectorAll('.demo-card-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const counter = appState.counters.find(c => c.id === id);
      if (counter) {
        counter.today += 1;
        counter.month += 1;
        renderPhoneDemo();
      }
    });
  });

  document.querySelectorAll('.demo-card-minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const counter = appState.counters.find(c => c.id === id);
      if (counter && counter.today > 0) {
        counter.today -= 1;
        counter.month -= 1;
        renderPhoneDemo();
      }
    });
  });

  // Clicking a counter card navigates to calendar
  document.querySelectorAll('.demo-counter-card').forEach(card => {
    card.addEventListener('click', () => {
      appState.currentScreen = 'calendar';
      updateDemoUI();
    });
  });

  // Settings Nav Button
  const settingsNavBtn = document.getElementById('demo-nav-settings');
  if (settingsNavBtn) {
    settingsNavBtn.addEventListener('click', () => {
      appState.currentScreen = 'settings';
      updateDemoUI();
    });
  }

  // Settings Done Button
  const settingsDoneBtn = document.getElementById('demo-settings-done');
  if (settingsDoneBtn) {
    settingsDoneBtn.addEventListener('click', () => {
      appState.currentScreen = 'counters';
      updateDemoUI();
    });
  }

  // Settings Theme Switches
  const themeSys = document.getElementById('demo-theme-system');
  if (themeSys) {
    themeSys.addEventListener('click', () => {
      appState.themeMode = 'system';
      const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isSystemDark);
      renderPhoneDemo();
    });
  }
  const themeLight = document.getElementById('demo-theme-light');
  if (themeLight) {
    themeLight.addEventListener('click', () => {
      appState.themeMode = 'light';
      document.documentElement.classList.remove('dark');
      renderPhoneDemo();
    });
  }
  const themeDark = document.getElementById('demo-theme-dark');
  if (themeDark) {
    themeDark.addEventListener('click', () => {
      appState.themeMode = 'dark';
      document.documentElement.classList.add('dark');
      renderPhoneDemo();
    });
  }

  // Toggle Haptics
  const toggleHaptics = document.getElementById('demo-toggle-haptics');
  if (toggleHaptics) {
    toggleHaptics.addEventListener('click', () => {
      appState.hapticsEnabled = !appState.hapticsEnabled;
      renderPhoneDemo();
    });
  }

  // Back to counters button
  const backToCounters = document.getElementById('demo-back-to-counters');
  if (backToCounters) {
    backToCounters.addEventListener('click', () => {
      appState.currentScreen = 'counters';
      updateDemoUI();
    });
  }

  // Calendar Day Click -> Go to Edit
  document.querySelectorAll('.demo-day-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const day = parseInt(cell.getAttribute('data-day'), 10);
      appState.selectedDate = {
        dayNumber: day,
        count: appState.records[day] || 0
      };
      appState.currentScreen = 'edit';
      updateDemoUI();
    });
  });

  // Edit Stepper Controls
  const minusBtn = document.getElementById('demo-counter-minus');
  const plusBtn = document.getElementById('demo-counter-plus');
  const valDisplay = document.getElementById('demo-counter-value');

  if (minusBtn && valDisplay) {
    minusBtn.addEventListener('click', () => {
      appState.selectedDate.count = Math.max(0, appState.selectedDate.count - 1);
      valDisplay.textContent = appState.selectedDate.count;
    });
  }

  if (plusBtn && valDisplay) {
    plusBtn.addEventListener('click', () => {
      appState.selectedDate.count += 1;
      valDisplay.textContent = appState.selectedDate.count;
    });
  }

  // Preset Buttons
  document.querySelectorAll('.demo-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pVal = parseInt(btn.getAttribute('data-preset'), 10);
      appState.selectedDate.count = pVal;
      if (valDisplay) valDisplay.textContent = pVal;
      document.querySelectorAll('.demo-preset-btn').forEach(b => {
        b.className = 'demo-preset-btn py-1.5 rounded-lg text-xs font-bold transition active:scale-95 bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300';
      });
      btn.className = 'demo-preset-btn py-1.5 rounded-lg text-xs font-bold transition active:scale-95 bg-blue-600 text-white shadow-sm';
    });
  });

  // Save / Clear / Cancel in Edit Sheet
  const saveBtn = document.getElementById('demo-save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      appState.records[appState.selectedDate.dayNumber] = appState.selectedDate.count;
      // Also update Water counter
      const waterCounter = appState.counters.find(c => c.id === 'water');
      if (waterCounter && appState.selectedDate.dayNumber === 4) {
        waterCounter.today = appState.selectedDate.count;
      }
      appState.currentScreen = 'calendar';
      updateDemoUI();
    });
  }

  const clearBtn = document.getElementById('demo-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      delete appState.records[appState.selectedDate.dayNumber];
      appState.currentScreen = 'calendar';
      updateDemoUI();
    });
  }

  const cancelBtn = document.getElementById('demo-cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      appState.currentScreen = 'calendar';
      updateDemoUI();
    });
  }
}

// Update Top Tab buttons styling & phone screen
function updateDemoUI() {
  document.querySelectorAll('.demo-screen-tab').forEach(tab => {
    const screen = tab.getAttribute('data-screen');
    if (screen === appState.currentScreen) {
      tab.className = 'demo-screen-tab px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white shadow-sm transition';
    } else {
      tab.className = 'demo-screen-tab px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition';
    }
  });

  renderPhoneDemo();
}

// Global Event Listeners Setup
document.addEventListener('DOMContentLoaded', () => {
  // Screen switcher tabs
  document.querySelectorAll('.demo-screen-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      appState.currentScreen = tab.getAttribute('data-screen');
      updateDemoUI();
    });
  });

  // FAQ Accordion
  const faqItems = document.querySelectorAll('#faq-accordion > div');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      const p = item.querySelector('p');
      const icon = item.querySelector('i');
      if (p.classList.contains('hidden')) {
        p.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      } else {
        p.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
      }
    });
  });

  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      appState.isDarkMode = isDark;
      appState.themeMode = isDark ? 'dark' : 'light';
      renderPhoneDemo();
    });
  }

  // Update digital clock in simulator
  function updateClock() {
    const clockEl = document.getElementById('demo-clock');
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Initial render
  updateDemoUI();
});
