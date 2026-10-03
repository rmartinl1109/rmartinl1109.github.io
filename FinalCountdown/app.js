/**
 * Final Countdown — Official Marketing Showcase Logic
 * High-performance, modular ES6 JavaScript
 * Real-time time engine, SVG rings renderer, theme swapper, and interactive iOS 16/18 simulator
 */

// Designer themes matching the iOS SwiftUI CountdownTheme enum
const THEMES = {
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    gradient: 'from-[#ff5a5e] via-[#ff9933] to-[#f2408c]',
    heroGradient: ['#ff5a5e', '#ff9933', '#f2408c'],
    accentHex: '#ff7a33',
    cssClass: 'theme-sunset'
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    gradient: 'from-[#0d8cf2] via-[#00ccd9] to-[#1a59d9]',
    heroGradient: ['#0d8cf2', '#00ccd9', '#1a59d9'],
    accentHex: '#00ccd9',
    cssClass: 'theme-ocean'
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    gradient: 'from-[#00d9a6] via-[#2699f2] to-[#8c4de6]',
    heroGradient: ['#00d9a6', '#2699f2', '#8c4de6'],
    accentHex: '#00d9a6',
    cssClass: 'theme-aurora'
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    gradient: 'from-[#f226b3] via-[#a633fa] to-[#5940f2]',
    heroGradient: ['#f226b3', '#a633fa', '#5940f2'],
    accentHex: '#f226b3',
    cssClass: 'theme-neon'
  },
  ember: {
    id: 'ember',
    name: 'Ember',
    gradient: 'from-[#f24026] via-[#ff8c00] to-[#fac726]',
    heroGradient: ['#f24026', '#ff8c00', '#fac726'],
    accentHex: '#ff8c00',
    cssClass: 'theme-ember'
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender',
    gradient: 'from-[#a680fa] via-[#cca6ff] to-[#73b3fa]',
    heroGradient: ['#a680fa', '#cca6ff', '#73b3fa'],
    accentHex: '#a680fa',
    cssClass: 'theme-lavender'
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    gradient: 'from-[#1f264d] via-[#403380] to-[#1a6699]',
    heroGradient: ['#1f264d', '#403380', '#1a6699'],
    accentHex: '#5c6ac4',
    cssClass: 'theme-midnight'
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    gradient: 'from-[#1aa673] via-[#4dcc80] to-[#0d7359]',
    heroGradient: ['#1aa673', '#4dcc80', '#0d7359'],
    accentHex: '#1aa673',
    cssClass: 'theme-forest'
  }
};

// Initial demo events matching CountdownItem.swift models
const initialEvents = [
  {
    id: 'tokyo-vacation',
    name: 'Summer in Tokyo',
    icon: '✈️',
    category: 'travel',
    theme: 'sunset',
    targetDate: new Date(Date.now() + 42 * 24 * 3600 * 1000 + 11 * 3600 * 1000 + 28 * 60 * 1000),
    isCountUp: false,
    notes: 'Shibuya crossing, Kyoto temples, and bullet trains.'
  },
  {
    id: 'apple-wwdc',
    name: 'Apple WWDC 2026',
    icon: '💻',
    category: 'work',
    theme: 'aurora',
    targetDate: new Date(Date.now() + 78 * 24 * 3600 * 1000 + 6 * 3600 * 1000),
    isCountUp: false,
    notes: 'Keynote, SwiftUI workshops, and developer labs.'
  },
  {
    id: 'smoke-free',
    name: 'Smoke-Free Streak',
    icon: '🌱',
    category: 'health',
    theme: 'forest',
    // Started 145 days ago in the past for Count-Up mode
    targetDate: new Date(Date.now() - (145 * 24 * 3600 * 1000 + 8 * 3600 * 1000)),
    isCountUp: true,
    notes: 'Health milestone streak. Breathing easier every day!'
  },
  {
    id: 'sister-wedding',
    name: "Sister's Wedding",
    icon: '💍',
    category: 'celebration',
    theme: 'lavender',
    targetDate: new Date(Date.now() + 18 * 24 * 3600 * 1000 + 14 * 3600 * 1000),
    isCountUp: false,
    notes: 'Best man speech prepared. Ceremony at coastal garden.'
  }
];

// App State
const appState = {
  events: [...initialEvents],
  selectedEventId: 'tokyo-vacation',
  currentTab: 'detail', // 'list', 'detail', 'add', 'widget'
  visualMode: 'rings', // 'rings' or 'lines'
  isDarkMode: document.documentElement.classList.contains('dark') || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
};

// Calculate exact time breakdown (years, months, days, hours, mins, secs)
function calculateTimeBreakdown(date, isCountUp = false) {
  const now = new Date();
  let diffMs = isCountUp ? (now - date) : (date - now);
  const isPast = diffMs < 0;

  if (diffMs < 0 && !isCountUp) {
    diffMs = 0;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const totalDays = Math.floor(totalHours / 24);

  // Approximate months and remaining days for circular ring calculations
  const months = Math.floor(totalDays / 30.4375);
  const days = Math.floor(totalDays % 30.4375);
  const years = Math.floor(totalDays / 365.25);

  return {
    totalDays,
    totalSeconds,
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    isPast,
    isCountUp
  };
}

// Get selected event object
function getSelectedEvent() {
  return appState.events.find(e => e.id === appState.selectedEventId) || appState.events[0];
}

// Render the phone simulator inside #demo-viewport
function renderPhoneSimulator() {
  const viewport = document.getElementById('demo-viewport');
  if (!viewport) return;

  const event = getSelectedEvent();
  const theme = THEMES[event.theme] || THEMES.sunset;
  const time = calculateTimeBreakdown(event.targetDate, event.isCountUp);

  // Update Dynamic Island on Simulator
  const islandIcon = document.getElementById('island-icon');
  const islandText = document.getElementById('island-text');
  if (islandIcon) islandIcon.textContent = event.icon;
  if (islandText) {
    islandText.textContent = event.isCountUp 
      ? `+${time.totalDays}d ${time.hours}h` 
      : `${time.totalDays}d ${time.hours}h`;
  }

  // Update Share Card preview on the right
  const shareCardTitle = document.getElementById('share-card-title');
  const shareCardDays = document.getElementById('share-card-days');
  const shareCardPreview = document.getElementById('share-card-preview');
  if (shareCardTitle) shareCardTitle.textContent = event.name;
  if (shareCardDays) shareCardDays.textContent = event.isCountUp ? `+${time.totalDays}` : `${time.totalDays}`;
  if (shareCardPreview) {
    shareCardPreview.className = `p-4 rounded-2xl bg-gradient-to-br ${theme.gradient} text-white shadow-lg space-y-2 transition-all duration-500`;
  }

  // Render view depending on active tab
  if (appState.currentTab === 'detail') {
    viewport.innerHTML = renderHeroDetailView(event, theme, time);
  } else if (appState.currentTab === 'list') {
    viewport.innerHTML = renderListView();
  } else if (appState.currentTab === 'add') {
    viewport.innerHTML = renderAddEventView();
  } else if (appState.currentTab === 'widget') {
    viewport.innerHTML = renderWidgetPreview(event, theme, time);
  }

  // Re-initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Attach internal tab/button listeners
  attachSimulatorEvents();
}

// 1. Hero Detail View (Replicating CountdownHeroDetailView.swift)
function renderHeroDetailView(event, theme, time) {
  const dateFormatted = event.targetDate.toLocaleDateString(undefined, { 
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
  });

  // Calculate SVG stroke dashes for Concentric Rings
  const daysMax = 31;
  const daysProgress = Math.min(1, time.days / daysMax);
  const hoursProgress = time.hours / 24;
  const minsProgress = time.minutes / 60;
  const secsProgress = time.seconds / 60;

  const rMonths = 65, cMonths = 2 * Math.PI * rMonths;
  const rDays = 52, cDays = 2 * Math.PI * rDays;
  const rHours = 39, cHours = 2 * Math.PI * rHours;
  const rSecs = 26, cSecs = 2 * Math.PI * rSecs;

  const strokeMonths = cMonths * (1 - Math.min(1, (time.months % 12) / 12));
  const strokeDays = cDays * (1 - daysProgress);
  const strokeHours = cHours * (1 - hoursProgress);
  const strokeSecs = cSecs * (1 - secsProgress);

  return `
    <div class="flex-1 flex flex-col justify-between py-1 text-white">
      
      <!-- Header with back to list & Category Tag -->
      <div class="flex items-center justify-between pb-1">
        <button id="sim-btn-to-list" class="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs flex items-center space-x-1 transition">
          <i data-lucide="chevron-left" class="w-3.5 h-3.5"></i>
          <span>All</span>
        </button>
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-white/10 backdrop-blur-md border border-white/20">
          ${event.isCountUp ? 'Count-Up Milestone' : event.category}
        </span>
      </div>

      <!-- Event Title & Icon -->
      <div class="text-center my-auto space-y-1">
        <div class="w-12 h-12 mx-auto rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-inner">
          ${event.icon}
        </div>
        <h3 class="text-lg font-black tracking-tight leading-tight">${event.name}</h3>
        <p class="text-[11px] text-zinc-400">${dateFormatted}</p>
      </div>

      <!-- Visual Centerpiece: Either Concentric Rings or Linear Progress -->
      ${appState.visualMode === 'rings' ? `
        <!-- Concentric Radial Rings (SVG) -->
        <div class="relative flex items-center justify-center my-auto">
          <svg class="w-48 h-48 transform -rotate-90" viewBox="0 0 160 160">
            <!-- Background Tracks -->
            <circle cx="80" cy="80" r="${rMonths}" stroke="#27272a" stroke-width="7" fill="transparent"/>
            <circle cx="80" cy="80" r="${rDays}" stroke="#27272a" stroke-width="7" fill="transparent"/>
            <circle cx="80" cy="80" r="${rHours}" stroke="#27272a" stroke-width="7" fill="transparent"/>
            <circle cx="80" cy="80" r="${rSecs}" stroke="#27272a" stroke-width="6" fill="transparent"/>

            <!-- Progress Arcs -->
            <circle cx="80" cy="80" r="${rMonths}" stroke="${theme.heroGradient[0]}" stroke-width="7" stroke-linecap="round" fill="transparent"
              stroke-dasharray="${cMonths}" stroke-dashoffset="${strokeMonths}" class="transition-all duration-700"/>
            <circle cx="80" cy="80" r="${rDays}" stroke="${theme.heroGradient[1]}" stroke-width="7" stroke-linecap="round" fill="transparent"
              stroke-dasharray="${cDays}" stroke-dashoffset="${strokeDays}" class="transition-all duration-700"/>
            <circle cx="80" cy="80" r="${rHours}" stroke="${theme.heroGradient[2]}" stroke-width="7" stroke-linecap="round" fill="transparent"
              stroke-dasharray="${cHours}" stroke-dashoffset="${strokeHours}" class="transition-all duration-700"/>
            <circle cx="80" cy="80" r="${rSecs}" stroke="${theme.accentHex}" stroke-width="6" stroke-linecap="round" fill="transparent"
              stroke-dasharray="${cSecs}" stroke-dashoffset="${strokeSecs}" class="transition-all duration-300"/>
          </svg>

          <!-- Center Large Counter -->
          <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span class="text-3xl font-black tabular-numbers leading-none">
              ${event.isCountUp ? '+' : ''}${time.totalDays}
            </span>
            <span class="text-[9px] uppercase font-bold tracking-widest text-zinc-400 mt-1">
              ${event.isCountUp ? 'Days Elapsed' : 'Days Left'}
            </span>
          </div>
        </div>
      ` : `
        <!-- Linear Progress Bars (LineProgressBarView - Apple Fitness Capsule Style) -->
        <div class="my-auto space-y-2 px-1">
          <div class="text-center pb-1">
            <span class="text-3xl font-black tabular-numbers leading-none">${event.isCountUp ? '+' : ''}${time.totalDays}</span>
            <span class="block text-[9px] uppercase font-bold tracking-widest text-zinc-400 mt-0.5">Total Days</span>
          </div>

          <!-- Days Capsule -->
          <div class="relative h-7 rounded-full bg-zinc-800/80 border border-zinc-700/50 overflow-hidden flex items-center px-3.5">
            <div class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-700" style="width: ${Math.max(8, (time.days / 31) * 100)}%"></div>
            <div class="relative z-10 w-full flex justify-between items-center text-xs font-bold">
              <span class="text-white drop-shadow">Days</span>
              <span class="text-white font-black tabular-numbers drop-shadow">${time.days}</span>
            </div>
          </div>

          <!-- Hours Capsule -->
          <div class="relative h-7 rounded-full bg-zinc-800/80 border border-zinc-700/50 overflow-hidden flex items-center px-3.5">
            <div class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700" style="width: ${Math.max(8, (time.hours / 24) * 100)}%"></div>
            <div class="relative z-10 w-full flex justify-between items-center text-xs font-bold">
              <span class="text-white drop-shadow">Hours</span>
              <span class="text-white font-black tabular-numbers drop-shadow">${time.hours}</span>
            </div>
          </div>

          <!-- Minutes Capsule -->
          <div class="relative h-7 rounded-full bg-zinc-800/80 border border-zinc-700/50 overflow-hidden flex items-center px-3.5">
            <div class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-700" style="width: ${Math.max(8, (time.minutes / 60) * 100)}%"></div>
            <div class="relative z-10 w-full flex justify-between items-center text-xs font-bold">
              <span class="text-white drop-shadow">Minutes</span>
              <span class="text-white font-black tabular-numbers drop-shadow">${time.minutes}</span>
            </div>
          </div>

          <!-- Seconds Capsule -->
          <div class="relative h-7 rounded-full bg-zinc-800/80 border border-zinc-700/50 overflow-hidden flex items-center px-3.5">
            <div class="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300" style="width: ${Math.max(8, (time.seconds / 60) * 100)}%"></div>
            <div class="relative z-10 w-full flex justify-between items-center text-xs font-bold">
              <span class="text-white drop-shadow">Seconds</span>
              <span class="text-white font-black tabular-numbers drop-shadow">${time.seconds}</span>
            </div>
          </div>
        </div>
      `}

      <!-- Bottom Mini Breakdown Box -->
      <div class="grid grid-cols-4 gap-1.5 text-center bg-zinc-900/90 rounded-xl p-2 border border-zinc-800">
        <div>
          <span class="block text-xs font-bold tabular-numbers text-amber-400">${String(time.months).padStart(2, '0')}</span>
          <span class="text-[8px] uppercase text-zinc-500 font-semibold">Months</span>
        </div>
        <div>
          <span class="block text-xs font-bold tabular-numbers text-rose-400">${String(time.hours).padStart(2, '0')}</span>
          <span class="text-[8px] uppercase text-zinc-500 font-semibold">Hours</span>
        </div>
        <div>
          <span class="block text-xs font-bold tabular-numbers text-indigo-400">${String(time.minutes).padStart(2, '0')}</span>
          <span class="text-[8px] uppercase text-zinc-500 font-semibold">Mins</span>
        </div>
        <div>
          <span class="block text-xs font-bold tabular-numbers text-emerald-400 animate-pulse">${String(time.seconds).padStart(2, '0')}</span>
          <span class="text-[8px] uppercase text-zinc-500 font-semibold">Secs</span>
        </div>
      </div>

      <!-- Action Buttons: Celebrate & Share -->
      <div class="flex space-x-2 pt-2">
        <button id="sim-btn-celebrate" class="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-bold text-[11px] flex items-center justify-center space-x-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition">
          <i data-lucide="party-popper" class="w-3.5 h-3.5"></i>
          <span>Celebrate</span>
        </button>
        <button id="sim-btn-toggle-rings" class="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-semibold flex items-center justify-center transition" title="Toggle Ring/Line View">
          <i data-lucide="${appState.visualMode === 'rings' ? 'align-left' : 'disc'}" class="w-3.5 h-3.5"></i>
        </button>
      </div>

    </div>
  `;
}

// 2. Events List View (MainView.swift)
function renderListView() {
  return `
    <div class="flex-1 flex flex-col justify-start py-1 space-y-3 overflow-y-auto no-scrollbar">
      
      <!-- Top Bar -->
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-base font-black text-white">Countdowns</h4>
          <span class="text-[10px] text-zinc-400">${appState.events.length} Active Events</span>
        </div>
        <button id="sim-btn-quick-add" class="p-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center space-x-1 transition shadow-sm">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i>
          <span>Add</span>
        </button>
      </div>

      <!-- List Items -->
      <div class="space-y-2">
        ${appState.events.map(ev => {
          const t = calculateTimeBreakdown(ev.targetDate, ev.isCountUp);
          const th = THEMES[ev.theme] || THEMES.sunset;
          const isSelected = ev.id === appState.selectedEventId;
          return `
            <div data-event-id="${ev.id}" class="sim-event-item p-3 rounded-2xl ${isSelected ? 'bg-zinc-800/90 ring-1 ring-amber-400' : 'bg-zinc-900/80 hover:bg-zinc-800/70'} border border-zinc-800 flex items-center justify-between cursor-pointer transition">
              <div class="flex items-center space-x-2.5">
                <div class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                  ${ev.icon}
                </div>
                <div>
                  <h5 class="text-xs font-bold text-white truncate max-w-[120px]">${ev.name}</h5>
                  <span class="text-[10px] text-zinc-400 capitalize">${ev.isCountUp ? 'Streak' : ev.category}</span>
                </div>
              </div>

              <!-- Time Badge -->
              <div class="text-right">
                <span class="text-sm font-black tabular-numbers text-white">
                  ${ev.isCountUp ? '+' : ''}${t.totalDays}d
                </span>
                <span class="block text-[9px] text-amber-400 tabular-numbers font-medium">
                  ${t.hours}h ${t.minutes}m
                </span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Pro Hint Banner -->
      <div class="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-[10px] text-amber-300 flex items-center justify-between">
        <div class="flex items-center space-x-1.5">
          <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-400"></i>
          <span>PRO: Unlimited events & iCloud sync</span>
        </div>
        <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
      </div>

    </div>
  `;
}

// 3. Add Event View (AddItemView.swift)
function renderAddEventView() {
  return `
    <div class="flex-1 flex flex-col justify-between py-1 text-white space-y-3">
      
      <div>
        <div class="flex justify-between items-center mb-3">
          <h4 class="text-sm font-black">New Countdown</h4>
          <button id="sim-btn-cancel-add" class="text-xs text-amber-400 font-semibold">Cancel</button>
        </div>

        <form id="sim-add-form" class="space-y-2.5 text-xs">
          <!-- Title Input -->
          <div>
            <label class="block text-[10px] text-zinc-400 uppercase font-bold mb-1">Event Name</label>
            <input id="input-event-name" type="text" placeholder="e.g. Marathon Race Day" required
              class="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500" />
          </div>

          <!-- Date Picker -->
          <div>
            <label class="block text-[10px] text-zinc-400 uppercase font-bold mb-1">Target Date</label>
            <input id="input-event-date" type="date" required
              class="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-amber-500" />
          </div>

          <!-- Emoji Picker Group -->
          <div>
            <label class="block text-[10px] text-zinc-400 uppercase font-bold mb-1">Select Icon</label>
            <div id="sim-emoji-list" class="flex space-x-2 overflow-x-auto py-1 no-scrollbar">
              ${['🎯', '🌴', '🎉', '🏃', '✈️', '💍', '🎂', '🎓', '🚀', '🎸', '🌱'].map((em, idx) => `
                <button type="button" class="sim-emoji-btn w-8 h-8 rounded-lg ${idx === 0 ? 'bg-amber-500' : 'bg-zinc-800'} flex-shrink-0 flex items-center justify-center text-sm" data-emoji="${em}">
                  ${em}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Category Selection -->
          <div>
            <label class="block text-[10px] text-zinc-400 uppercase font-bold mb-1">Category</label>
            <select id="input-event-cat" class="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none">
              <option value="personal">Personal 👤</option>
              <option value="celebration">Celebration 🎉</option>
              <option value="travel">Travel ✈️</option>
              <option value="work">Work 💼</option>
              <option value="family">Family 👨‍👩‍👧</option>
              <option value="health">Health 🌿</option>
            </select>
          </div>
        </form>
      </div>

      <!-- Submit Button -->
      <button id="sim-btn-save-event" class="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/25 transition active:scale-95">
        Create Countdown
      </button>

    </div>
  `;
}

// 4. Widget Preview Inside Phone
function renderWidgetPreview(event, theme, time) {
  return `
    <div class="flex-1 flex flex-col justify-start py-1 text-white space-y-3 overflow-y-auto no-scrollbar">
      
      <div class="text-center space-y-0.5">
        <h4 class="text-sm font-black">Widget Preview</h4>
        <p class="text-[10px] text-zinc-400">How it looks on your iOS 18 Home Screen</p>
      </div>

      <!-- SystemSmall Widget -->
      <div class="w-40 h-40 mx-auto rounded-3xl bg-zinc-900 border border-zinc-800 p-3.5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
        <div class="flex justify-between items-center text-xs">
          <span class="text-lg">${event.icon}</span>
          <span class="text-[9px] font-bold uppercase tracking-wider text-amber-400">${event.category}</span>
        </div>
        <div class="text-center my-auto">
          <span class="text-3xl font-black tabular-numbers leading-none">${event.isCountUp ? '+' : ''}${time.totalDays}</span>
          <span class="block text-[9px] uppercase tracking-wider text-zinc-400 font-bold mt-1">Days Left</span>
        </div>
        <div class="text-[10px] font-bold text-zinc-200 truncate">${event.name}</div>
      </div>

      <!-- Lock Screen Accessory Complications -->
      <div class="space-y-1.5 pt-2">
        <span class="text-[10px] uppercase font-bold text-zinc-400 block text-center">Lock Screen Complications</span>
        <div class="flex items-center justify-center space-x-3">
          <!-- Circular -->
          <div class="w-12 h-12 rounded-full border border-amber-400/80 flex flex-col items-center justify-center p-1">
            <span class="text-[10px]">${event.icon}</span>
            <span class="text-[9px] font-bold tabular-numbers text-amber-300">${time.totalDays}d</span>
          </div>
          <!-- Inline -->
          <div class="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300">
            ${event.icon} ${event.name}: ${time.totalDays}d
          </div>
        </div>
      </div>

      <!-- Button to toggle theme -->
      <button id="sim-btn-return-hero" class="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition mt-auto">
        Back to Full Screen
      </button>

    </div>
  `;
}

// Attach event handlers inside the phone simulator
function attachSimulatorEvents() {
  // Navigation tabs at the bottom
  const tabList = document.getElementById('tab-list');
  const tabDetail = document.getElementById('tab-detail');
  const tabAdd = document.getElementById('tab-add');
  const tabWidget = document.getElementById('tab-widget');

  const updateTabHighlight = (activeTab) => {
    [
      { el: tabList, name: 'list' },
      { el: tabDetail, name: 'detail' },
      { el: tabAdd, name: 'add' },
      { el: tabWidget, name: 'widget' }
    ].forEach(({ el, name }) => {
      if (!el) return;
      if (name === activeTab) {
        el.className = 'py-2 flex flex-col items-center justify-center text-amber-400 transition';
        el.querySelector('span').className = 'text-[9px] mt-0.5 font-bold';
      } else {
        el.className = 'py-2 flex flex-col items-center justify-center text-zinc-400 hover:text-white transition';
        el.querySelector('span').className = 'text-[9px] mt-0.5 font-medium';
      }
    });
  };

  if (tabList) tabList.onclick = () => { appState.currentTab = 'list'; updateTabHighlight('list'); renderPhoneSimulator(); };
  if (tabDetail) tabDetail.onclick = () => { appState.currentTab = 'detail'; updateTabHighlight('detail'); renderPhoneSimulator(); };
  if (tabAdd) tabAdd.onclick = () => { appState.currentTab = 'add'; updateTabHighlight('add'); renderPhoneSimulator(); };
  if (tabWidget) tabWidget.onclick = () => { appState.currentTab = 'widget'; updateTabHighlight('widget'); renderPhoneSimulator(); };

  // Back to list button inside detail view
  const toListBtn = document.getElementById('sim-btn-to-list');
  if (toListBtn) {
    toListBtn.onclick = () => {
      appState.currentTab = 'list';
      updateTabHighlight('list');
      renderPhoneSimulator();
    };
  }

  // Quick add button in list view
  const quickAddBtn = document.getElementById('sim-btn-quick-add');
  if (quickAddBtn) {
    quickAddBtn.onclick = () => {
      appState.currentTab = 'add';
      updateTabHighlight('add');
      renderPhoneSimulator();
    };
  }

  // Cancel add button
  const cancelAddBtn = document.getElementById('sim-btn-cancel-add');
  if (cancelAddBtn) {
    cancelAddBtn.onclick = () => {
      appState.currentTab = 'detail';
      updateTabHighlight('detail');
      renderPhoneSimulator();
    };
  }

  // Return to hero button in widget preview
  const returnHeroBtn = document.getElementById('sim-btn-return-hero');
  if (returnHeroBtn) {
    returnHeroBtn.onclick = () => {
      appState.currentTab = 'detail';
      updateTabHighlight('detail');
      renderPhoneSimulator();
    };
  }

  // Toggle Rings vs Lines inside phone
  const toggleRingsBtn = document.getElementById('sim-btn-toggle-rings');
  if (toggleRingsBtn) {
    toggleRingsBtn.onclick = () => {
      appState.visualMode = appState.visualMode === 'rings' ? 'lines' : 'rings';
      updateVisualModeButtons();
      renderPhoneSimulator();
    };
  }

  // Celebrate button (Confetti!)
  const celebrateBtn = document.getElementById('sim-btn-celebrate');
  if (celebrateBtn) {
    celebrateBtn.onclick = () => triggerConfetti();
  }

  // Event list item selection
  const eventItems = document.querySelectorAll('.sim-event-item');
  eventItems.forEach(item => {
    item.onclick = () => {
      const id = item.getAttribute('data-event-id');
      if (id) {
        appState.selectedEventId = id;
        appState.currentTab = 'detail';
        updateTabHighlight('detail');
        updateEventSelectorUI();
        renderPhoneSimulator();
      }
    };
  });

  // Emoji picker buttons in Add View
  let selectedEmoji = '🎯';
  const emojiButtons = document.querySelectorAll('.sim-emoji-btn');
  emojiButtons.forEach(btn => {
    btn.onclick = () => {
      emojiButtons.forEach(b => b.className = 'sim-emoji-btn w-8 h-8 rounded-lg bg-zinc-800 flex-shrink-0 flex items-center justify-center text-sm');
      btn.className = 'sim-emoji-btn w-8 h-8 rounded-lg bg-amber-500 flex-shrink-0 flex items-center justify-center text-sm';
      selectedEmoji = btn.getAttribute('data-emoji') || '🎯';
    };
  });

  // Save new event
  const saveBtn = document.getElementById('sim-btn-save-event');
  if (saveBtn) {
    saveBtn.onclick = (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('input-event-name');
      const dateInput = document.getElementById('input-event-date');
      const catInput = document.getElementById('input-event-cat');

      if (!nameInput || !nameInput.value) {
        alert('Please provide an event name');
        return;
      }

      const targetDate = dateInput && dateInput.value ? new Date(dateInput.value) : new Date(Date.now() + 30 * 24 * 3600 * 1000);
      const newEvent = {
        id: 'user-event-' + Date.now(),
        name: nameInput.value,
        icon: selectedEmoji,
        category: catInput ? catInput.value : 'personal',
        theme: 'sunset',
        targetDate: targetDate,
        isCountUp: false,
        notes: 'Created via in-browser simulator'
      };

      appState.events.unshift(newEvent);
      appState.selectedEventId = newEvent.id;
      appState.currentTab = 'detail';
      updateTabHighlight('detail');
      updateEventSelectorUI();
      renderPhoneSimulator();
      triggerConfetti();
    };
  }
}

// Update Left Column Event Selector UI
function updateEventSelectorUI() {
  const container = document.getElementById('event-selector-list');
  if (!container) return;

  container.innerHTML = appState.events.map(ev => {
    const isSelected = ev.id === appState.selectedEventId;
    const t = calculateTimeBreakdown(ev.targetDate, ev.isCountUp);
    return `
      <button data-id="${ev.id}" class="event-picker-btn w-full p-2.5 rounded-2xl ${isSelected ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400' : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:border-zinc-300'} border flex items-center justify-between transition text-left text-xs">
        <div class="flex items-center space-x-2">
          <span class="text-base">${ev.icon}</span>
          <span class="font-bold truncate max-w-[130px]">${ev.name}</span>
        </div>
        <span class="font-mono font-bold text-[11px] tabular-numbers">${ev.isCountUp ? '+' : ''}${t.totalDays}d</span>
      </button>
    `;
  }).join('');

  // Attach click events
  document.querySelectorAll('.event-picker-btn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      if (id) {
        appState.selectedEventId = id;
        updateEventSelectorUI();
        renderPhoneSimulator();
      }
    };
  });
}

// Update Theme Swatches
function initThemeSwatches() {
  const container = document.getElementById('theme-swatches');
  if (!container) return;

  container.innerHTML = Object.values(THEMES).map(t => {
    return `
      <button data-theme="${t.id}" class="theme-choice-btn w-7 h-7 rounded-xl bg-gradient-to-tr ${t.gradient} shadow-sm hover:scale-110 active:scale-95 transition transform border border-white/20" title="${t.name}">
      </button>
    `;
  }).join('');

  document.querySelectorAll('.theme-choice-btn').forEach(btn => {
    btn.onclick = () => {
      const themeId = btn.getAttribute('data-theme');
      const event = getSelectedEvent();
      if (event && themeId) {
        event.theme = themeId;
        renderPhoneSimulator();
      }
    };
  });
}

// Update Visual Mode Toggle Buttons (Rings vs Lines)
function updateVisualModeButtons() {
  const ringsBtn = document.getElementById('mode-rings-btn');
  const linesBtn = document.getElementById('mode-lines-btn');
  if (!ringsBtn || !linesBtn) return;

  if (appState.visualMode === 'rings') {
    ringsBtn.className = 'py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm';
    linesBtn.className = 'py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition text-zinc-600 dark:text-zinc-400 hover:text-zinc-900';
  } else {
    linesBtn.className = 'py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm';
    ringsBtn.className = 'py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition text-zinc-600 dark:text-zinc-400 hover:text-zinc-900';
  }
}

// Confetti blast
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff5a5e', '#ff9933', '#f2408c', '#6366f1', '#10b981']
    });
  }
}

// Update Hero Floating Phone Display
function updateHeroRealtime() {
  const heroEvent = appState.events[0];
  if (!heroEvent) return;
  const time = calculateTimeBreakdown(heroEvent.targetDate);

  const daysEl = document.getElementById('hero-days-val');
  const hoursEl = document.getElementById('hero-hours-val');
  const minsEl = document.getElementById('hero-mins-val');
  const secsEl = document.getElementById('hero-secs-val');
  const secRing = document.getElementById('hero-sec-ring');
  const miniTimer = document.getElementById('hero-mini-timer');

  if (daysEl) daysEl.textContent = time.totalDays;
  if (hoursEl) hoursEl.textContent = String(time.hours).padStart(2, '0');
  if (minsEl) minsEl.textContent = String(time.minutes).padStart(2, '0');
  if (secsEl) secsEl.textContent = String(time.seconds).padStart(2, '0');
  if (miniTimer) miniTimer.textContent = `${time.totalDays}d ${time.hours}h`;

  if (secRing) {
    const c = 251;
    const offset = c * (1 - (time.seconds / 60));
    secRing.style.strokeDashoffset = offset;
  }
}

// Dark / Light Mode Switcher
function initThemeMode() {
  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  const setMode = (isDark) => {
    appState.isDarkMode = isDark;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('fc_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('fc_theme', 'light');
    }
  };

  const saved = localStorage.getItem('fc_theme');
  if (saved) {
    setMode(saved === 'dark');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      setMode(!root.classList.contains('dark'));
    });
  }
}

// FAQ Accordion
function initFAQ() {
  const toggles = document.querySelectorAll('.faq-toggle');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const answer = toggle.nextElementSibling;
      const icon = toggle.querySelector('i');
      if (answer) {
        const isHidden = answer.classList.contains('hidden');
        document.querySelectorAll('.faq-answer').forEach(a => a.classList.add('hidden'));
        document.querySelectorAll('.faq-toggle i').forEach(i => i.style.transform = 'rotate(0deg)');

        if (isHidden) {
          answer.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      }
    });
  });
}

// Legal Modals (Privacy & Terms)
function initModals() {
  const privacyModal = document.getElementById('privacy-modal');
  const termsModal = document.getElementById('terms-modal');
  const openPrivacy = document.getElementById('open-privacy-link');
  const openTerms = document.getElementById('open-terms-link');
  const closePrivacy = document.getElementById('close-privacy-btn');
  const closeTerms = document.getElementById('close-terms-btn');

  if (openPrivacy && privacyModal) {
    openPrivacy.onclick = (e) => { e.preventDefault(); privacyModal.classList.remove('hidden'); };
  }
  if (openTerms && termsModal) {
    openTerms.onclick = (e) => { e.preventDefault(); termsModal.classList.remove('hidden'); };
  }
  if (closePrivacy && privacyModal) {
    closePrivacy.onclick = () => privacyModal.classList.add('hidden');
    privacyModal.onclick = (e) => { if (e.target === privacyModal) privacyModal.classList.add('hidden'); };
  }
  if (closeTerms && termsModal) {
    closeTerms.onclick = () => termsModal.classList.add('hidden');
    termsModal.onclick = (e) => { if (e.target === termsModal) termsModal.classList.add('hidden'); };
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (privacyModal) privacyModal.classList.add('hidden');
      if (termsModal) termsModal.classList.add('hidden');
    }
  });
}

// Page Initialization
document.addEventListener('DOMContentLoaded', () => {
  initThemeMode();
  initFAQ();
  initModals();
  initThemeSwatches();
  updateEventSelectorUI();
  updateVisualModeButtons();

  // Mode buttons in left column
  const modeRingsBtn = document.getElementById('mode-rings-btn');
  const modeLinesBtn = document.getElementById('mode-lines-btn');
  if (modeRingsBtn) {
    modeRingsBtn.onclick = () => {
      appState.visualMode = 'rings';
      updateVisualModeButtons();
      renderPhoneSimulator();
    };
  }
  if (modeLinesBtn) {
    modeLinesBtn.onclick = () => {
      appState.visualMode = 'lines';
      updateVisualModeButtons();
      renderPhoneSimulator();
    };
  }

  // Trigger Confetti button on the right column
  const extConfettiBtn = document.getElementById('trigger-confetti-btn');
  if (extConfettiBtn) {
    extConfettiBtn.onclick = () => triggerConfetti();
  }

  // Initial phone render
  renderPhoneSimulator();
  updateHeroRealtime();

  // Real-time ticking every second
  setInterval(() => {
    updateHeroRealtime();
    // Only re-render simulator if in detail or widget view to keep form state intact if typing
    if (appState.currentTab === 'detail' || appState.currentTab === 'widget' || appState.currentTab === 'list') {
      renderPhoneSimulator();
    }
  }, 1000);
});
