/**
 * TicketBox Vault - Official App Showcase
 * Clean Vanilla ES6 JavaScript for interactive demo & theme controls
 * Zero external dependencies.
 */

const screens = {
  vault: {
    tab: 'Receipt Vault',
    render: () => `
      <div class="screen screen--top">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div>
            <h4 class="screen-title" style="margin: 0; text-align: left;">TicketBox Vault</h4>
            <span style="font-size: 0.75rem; color: var(--color-text-muted);">2 Active Receipts</span>
          </div>
          <button id="demo-btn-scan" class="btn btn-primary btn-sm" style="padding: 6px 12px; font-size: 0.75rem;">
            + Scan
          </button>
        </div>

        <div class="stack" style="gap: 10px;">
          <!-- Card 1: Apple Store -->
          <div class="sim-receipt-card">
            <div class="sim-receipt-header">
              <div>
                <div class="sim-store-name">Apple Store</div>
                <div class="sim-product-name">MacBook Pro 16" M4 Max</div>
              </div>
              <span class="sim-price">$2,499.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
              <span class="badge-status badge-status--active">● 365 Days Warranty</span>
              <span class="badge-status badge-status--warning">⏱ 14d Return Left</span>
            </div>
            <div class="sim-progress-bar">
              <div class="sim-progress-fill" style="width: 85%;"></div>
            </div>
          </div>

          <!-- Card 2: Best Buy -->
          <div class="sim-receipt-card">
            <div class="sim-receipt-header">
              <div>
                <div class="sim-store-name">Best Buy</div>
                <div class="sim-product-name">Sony WH-1000XM5 ANC</div>
              </div>
              <span class="sim-price">$398.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
              <span class="badge-status badge-status--active">● 712 Days Warranty</span>
              <span class="badge-status badge-status--urgent">⚠️ 48h Return Left</span>
            </div>
            <div class="sim-progress-bar">
              <div class="sim-progress-fill" style="width: 95%;"></div>
            </div>
          </div>
        </div>

        <button id="demo-btn-open-claim" class="btn btn-secondary btn-block" style="margin-top: 14px; font-size: 0.8125rem;">
          <span>Generate PDF Claim</span>
          <svg class="icon icon-sm" aria-hidden="true"><use href="#icon-arrow-right"/></svg>
        </button>
      </div>
    `
  },
  claim: {
    tab: 'Claim Dossier',
    render: () => `
      <div class="screen screen--top">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <button id="demo-btn-back-vault" class="icon-btn" style="width: 28px; height: 28px; padding: 4px;" aria-label="Back">
            ←
          </button>
          <h4 class="screen-title" style="margin: 0; font-size: 0.9375rem;">Claim Dossier</h4>
        </div>

        <div class="sim-receipt-card" style="background: var(--color-surface); border: 1px solid var(--color-brand-500); padding: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--color-text-subtle); border-bottom: 1px solid var(--color-border); padding-bottom: 6px; margin-bottom: 6px;">
            <span>DOC-2026-CLAIM-001</span>
            <span>CLAIM DOSSIER</span>
          </div>

          <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-text-strong);">
            Hardware Defect & Warranty Claim
          </div>
          <div style="font-size: 0.7rem; color: var(--color-text-muted); margin-bottom: 6px;">
            Merchant: Apple Store Fifth Ave • SN: C02G400QMD6M
          </div>

          <div style="font-size: 0.6875rem; color: var(--color-text-muted); background: var(--color-bg); padding: 6px 8px; border-radius: 6px; margin-bottom: 6px;">
            <div><strong>Original Purchase:</strong> Oct 14, 2026 ($2,499.00)</div>
            <div><strong>Warranty Expiration:</strong> Oct 14, 2027 (EU/US 3-Year Extended)</div>
          </div>

        </div>

        <div class="stack" style="margin-top: 10px;">
          <button class="btn btn-primary btn-block" style="font-size: 0.8125rem;">
            <svg class="icon icon-sm" aria-hidden="true"><use href="#icon-download"/></svg>
            <span>Share & Export PDF</span>
          </button>
        </div>
      </div>
    `
  },
  security: {
    tab: 'Face ID Security',
    render: () => `
      <div class="screen screen--center">
        <div class="screen-body">
          <div class="screen-icon" style="background: color-mix(in srgb, var(--color-accent-green) 15%, transparent); color: var(--color-accent-green);">
            <svg class="icon icon-xl" aria-hidden="true"><use href="#icon-scan-face"/></svg>
          </div>
          <h4 class="screen-title">TicketBox Vault Locked</h4>
          <p class="screen-subtitle">Protected with Apple Secure Enclave & Biometrics</p>

          <div style="margin-top: 14px; padding: 10px; border-radius: 8px; background: var(--color-bg); border: 1px solid var(--color-border); font-size: 0.75rem; color: var(--color-text-muted); text-align: left;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <svg class="icon icon-sm text-green" aria-hidden="true"><use href="#icon-check"/></svg>
              <span>On-Device Key Storage in Keychain</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <svg class="icon icon-sm text-green" aria-hidden="true"><use href="#icon-check"/></svg>
              <span>Zero-Knowledge iCloud Encryption</span>
            </div>
          </div>
        </div>

        <button id="demo-btn-unlock" class="btn btn-primary btn-block">
          <svg class="icon icon-sm" aria-hidden="true"><use href="#icon-scan-face"/></svg>
          <span>Unlock with Face ID</span>
        </button>
      </div>
    `
  },
  widgets: {
    tab: 'Widgets',
    render: () => `
      <div class="screen screen--top">
        <div style="margin-bottom: 10px;">
          <h4 class="screen-title" style="margin: 0; text-align: left; font-size: 0.9375rem;">Widgets & StandBy</h4>
          <span style="font-size: 0.7rem; color: var(--color-text-muted);">Glanceable countdowns on iPhone & iPad</span>
        </div>

        <!-- Medium Widget Preview -->
        <div class="widget-preview-box" style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <svg class="icon icon-sm text-brand" aria-hidden="true"><use href="#icon-vault"/></svg>
              <strong style="font-size: 0.75rem;">Return Window Alert</strong>
            </div>
            <span style="font-size: 0.65rem; color: #f59e0b; background: rgba(245, 158, 11, 0.2); padding: 2px 6px; border-radius: 4px; font-weight: 700;">URGENT</span>
          </div>

          <div style="font-size: 0.8125rem; font-weight: 700; margin-bottom: 2px;">Sony WH-1000XM5</div>
          <div style="font-size: 0.7rem; color: rgba(255, 255, 255, 0.7); margin-bottom: 6px;">Best Buy • $398.00</div>

          <div style="display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 6px;">
            <span style="font-size: 0.7rem; color: rgba(255, 255, 255, 0.7);">Time Remaining</span>
            <strong style="font-size: 1.1rem; color: #ef4444;">48h : 12m</strong>
          </div>
        </div>

        <!-- Small Widget Preview -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <div class="widget-preview-box" style="padding: 10px;">
            <span style="font-size: 0.65rem; color: #10b981;">WARRANTY</span>
            <div style="font-size: 1.25rem; font-weight: 800; margin: 4px 0;">365d</div>
            <div style="font-size: 0.65rem; color: rgba(255, 255, 255, 0.7);">MacBook Pro</div>
          </div>
          <div class="widget-preview-box" style="padding: 10px;">
            <span style="font-size: 0.65rem; color: #6366f1;">TOTAL SAVED</span>
            <div style="font-size: 1.25rem; font-weight: 800; margin: 4px 0;">$2.8k</div>
            <div style="font-size: 0.65rem; color: rgba(255, 255, 255, 0.7);">Claim Protection</div>
          </div>
        </div>
      </div>
    `
  },
  pro: {
    tab: 'Vault Pro',
    render: () => `
      <div class="screen screen--top">
        <div style="text-align: center; margin-bottom: 8px;">
          <span style="background: linear-gradient(135deg, var(--color-brand-600), var(--color-indigo-600)); color: white; font-size: 0.65rem; font-weight: 800; padding: 2px 8px; border-radius: 9999px;">
            LIFETIME ACCESS
          </span>
          <h4 class="screen-title" style="margin: 4px 0 2px;">TicketBox Pro</h4>
          <p class="screen-subtitle" style="font-size: 0.75rem;">$4.99 USD / 4,99 € • One-time purchase</p>
        </div>

        <div class="list-group" style="font-size: 0.75rem; margin-bottom: 12px;">
          <div class="list-row"><span>Unlimited Receipts & Invoices</span><svg class="icon icon-sm text-brand" aria-hidden="true"><use href="#icon-check"/></svg></div>
          <div class="list-row"><span>Claim PDF Dossiers</span><svg class="icon icon-sm text-brand" aria-hidden="true"><use href="#icon-check"/></svg></div>
          <div class="list-row"><span>Face ID Biometric Privacy</span><svg class="icon icon-sm text-brand" aria-hidden="true"><use href="#icon-check"/></svg></div>
          <div class="list-row"><span>Widgets & StandBy Countdown</span><svg class="icon icon-sm text-brand" aria-hidden="true"><use href="#icon-check"/></svg></div>
          <div class="list-row"><span>Apple Family Sharing</span><svg class="icon icon-sm text-brand" aria-hidden="true"><use href="#icon-check"/></svg></div>
        </div>

        <div class="stack">
          <button class="btn btn-primary btn-block" style="font-size: 0.8125rem;">
            <span>Unlock Vault Pro ($4.99)</span>
          </button>
          <button class="btn btn-secondary btn-block" style="font-size: 0.75rem; padding: 8px;">
            <span>Restore Purchases</span>
          </button>
        </div>
      </div>
    `
  }
};

const appState = {
  currentScreen: 'vault',
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

  // Attach interactive button listeners inside mockup
  const openClaimBtn = document.getElementById('demo-btn-open-claim');
  if (openClaimBtn) {
    openClaimBtn.addEventListener('click', () => {
      appState.currentScreen = 'claim';
      updateDemo();
    });
  }

  const backVaultBtn = document.getElementById('demo-btn-back-vault');
  if (backVaultBtn) {
    backVaultBtn.addEventListener('click', () => {
      appState.currentScreen = 'vault';
      updateDemo();
    });
  }

  const scanBtn = document.getElementById('demo-btn-scan');
  if (scanBtn) {
    scanBtn.addEventListener('click', () => {
      appState.currentScreen = 'pro';
      updateDemo();
    });
  }

  const unlockBtn = document.getElementById('demo-btn-unlock');
  if (unlockBtn) {
    unlockBtn.addEventListener('click', () => {
      appState.currentScreen = 'vault';
      updateDemo();
    });
  }
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
