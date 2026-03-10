// ===== RATITO WALLET =====
// $100 virtual charge per missed workout

const Wallet = {
  COST_PER_MISS: 100,

  init() {
    this.render();
  },

  render() {
    const body = document.getElementById('wallet-body');
    const huelsMissed = Store.getMissedWorkouts('huels');
    const manootMissed = Store.getMissedWorkouts('manoot');
    const totalDebt = (huelsMissed + manootMissed) * this.COST_PER_MISS;

    body.innerHTML = `
      <div class="ratito-hero">
        ${this._getRatSVG()}
        <div class="ratito-msg">${this._getMessage(totalDebt)}</div>
      </div>
      <div class="wallet-cards">
        ${this._renderCard('huels', 'falco', huelsMissed)}
        ${this._renderCard('manoot', 'fox', manootMissed)}
      </div>
      <div class="wallet-fine-print">$${this.COST_PER_MISS} per missed workout &middot; past weeks only</div>
    `;
  },

  _renderCard(user, iconClass, missed) {
    const debt = missed * this.COST_PER_MISS;
    return `
      <div class="wallet-card ${missed > 0 ? 'has-debt' : 'clean'}">
        <div class="wallet-user">
          <div class="dash-icon ${iconClass}"></div>
          <span>${user}</span>
        </div>
        <div class="wallet-stats">
          <div class="wallet-missed">${missed} missed</div>
          <div class="wallet-debt">$${debt.toLocaleString()}</div>
        </div>
      </div>
    `;
  },

  _getMessage(totalDebt) {
    if (totalDebt === 0) return 'no debts... for now';
    if (totalDebt <= 500) return 'ratito is watching...';
    if (totalDebt <= 1500) return 'ratito is getting hungry...';
    return 'RATITO DEMANDS PAYMENT';
  },

  _getRatSVG() {
    return `
    <svg class="ratito-svg" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Skull -->
      <ellipse cx="100" cy="44" rx="30" ry="26" stroke="#d4c5a0" stroke-width="2.5"/>
      <!-- Snout -->
      <path d="M 75 38 Q 62 42 58 48 Q 62 54 75 52" stroke="#d4c5a0" stroke-width="2.5" fill="none"/>
      <circle cx="60" cy="44" r="3" fill="#d4c5a0"/>
      <!-- Eye socket -->
      <ellipse cx="88" cy="38" rx="8" ry="9" stroke="#d4c5a0" stroke-width="2"/>
      <circle cx="88" cy="38" r="3" fill="#d4c5a0" opacity="0.3"/>
      <!-- Teeth -->
      <line x1="72" y1="54" x2="72" y2="63" stroke="#d4c5a0" stroke-width="3" stroke-linecap="round"/>
      <line x1="78" y1="54" x2="78" y2="61" stroke="#d4c5a0" stroke-width="3" stroke-linecap="round"/>
      <!-- Jaw -->
      <path d="M 88 58 Q 76 66 64 56" stroke="#d4c5a0" stroke-width="2" fill="none"/>
      <!-- Ears -->
      <ellipse cx="122" cy="22" rx="12" ry="16" stroke="#d4c5a0" stroke-width="2" transform="rotate(20,122,22)"/>
      <ellipse cx="108" cy="18" rx="8" ry="12" stroke="#d4c5a0" stroke-width="2" transform="rotate(-5,108,18)"/>

      <!-- Neck -->
      <line x1="100" y1="70" x2="100" y2="82" stroke="#d4c5a0" stroke-width="3"/>

      <!-- Spine -->
      <line x1="100" y1="82" x2="100" y2="195" stroke="#d4c5a0" stroke-width="3"/>
      <!-- Vertebrae -->
      <line x1="95" y1="90" x2="105" y2="90" stroke="#d4c5a0" stroke-width="1.5"/>
      <line x1="95" y1="105" x2="105" y2="105" stroke="#d4c5a0" stroke-width="1.5"/>
      <line x1="95" y1="120" x2="105" y2="120" stroke="#d4c5a0" stroke-width="1.5"/>
      <line x1="95" y1="135" x2="105" y2="135" stroke="#d4c5a0" stroke-width="1.5"/>
      <line x1="95" y1="150" x2="105" y2="150" stroke="#d4c5a0" stroke-width="1.5"/>
      <line x1="95" y1="165" x2="105" y2="165" stroke="#d4c5a0" stroke-width="1.5"/>
      <line x1="95" y1="180" x2="105" y2="180" stroke="#d4c5a0" stroke-width="1.5"/>

      <!-- Ribcage left -->
      <path d="M 100 88 Q 72 92 66 108 Q 72 114 100 112" stroke="#d4c5a0" stroke-width="2" fill="none"/>
      <path d="M 100 94 Q 76 98 70 110" stroke="#d4c5a0" stroke-width="1.5" fill="none"/>
      <path d="M 100 100 Q 78 104 73 112" stroke="#d4c5a0" stroke-width="1.5" fill="none"/>
      <path d="M 100 106 Q 80 108 76 114" stroke="#d4c5a0" stroke-width="1.5" fill="none"/>
      <!-- Ribcage right -->
      <path d="M 100 88 Q 128 92 134 108 Q 128 114 100 112" stroke="#d4c5a0" stroke-width="2" fill="none"/>
      <path d="M 100 94 Q 124 98 130 110" stroke="#d4c5a0" stroke-width="1.5" fill="none"/>
      <path d="M 100 100 Q 122 104 127 112" stroke="#d4c5a0" stroke-width="1.5" fill="none"/>
      <path d="M 100 106 Q 120 108 124 114" stroke="#d4c5a0" stroke-width="1.5" fill="none"/>

      <!-- Arms - raised up near face (begging pose) -->
      <!-- Left upper arm -->
      <line x1="100" y1="86" x2="72" y2="78" stroke="#d4c5a0" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Left forearm -->
      <line x1="72" y1="78" x2="68" y2="60" stroke="#d4c5a0" stroke-width="2" stroke-linecap="round"/>
      <!-- Left paw -->
      <line x1="68" y1="60" x2="63" y2="55" stroke="#d4c5a0" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="68" y1="60" x2="65" y2="54" stroke="#d4c5a0" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="68" y1="60" x2="68" y2="53" stroke="#d4c5a0" stroke-width="1.5" stroke-linecap="round"/>

      <!-- Right upper arm -->
      <line x1="100" y1="86" x2="132" y2="76" stroke="#d4c5a0" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Right forearm -->
      <line x1="132" y1="76" x2="138" y2="58" stroke="#d4c5a0" stroke-width="2" stroke-linecap="round"/>
      <!-- Right paw -->
      <line x1="138" y1="58" x2="143" y2="53" stroke="#d4c5a0" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="138" y1="58" x2="141" y2="52" stroke="#d4c5a0" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="138" y1="58" x2="138" y2="51" stroke="#d4c5a0" stroke-width="1.5" stroke-linecap="round"/>

      <!-- Pelvis -->
      <ellipse cx="100" cy="195" rx="22" ry="12" stroke="#d4c5a0" stroke-width="2.5" fill="none"/>

      <!-- Left leg -->
      <line x1="82" y1="202" x2="72" y2="238" stroke="#d4c5a0" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="72" y1="238" x2="68" y2="270" stroke="#d4c5a0" stroke-width="2" stroke-linecap="round"/>
      <!-- Left foot -->
      <line x1="68" y1="270" x2="56" y2="276" stroke="#d4c5a0" stroke-width="2" stroke-linecap="round"/>
      <line x1="68" y1="270" x2="60" y2="278" stroke="#d4c5a0" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="68" y1="270" x2="65" y2="279" stroke="#d4c5a0" stroke-width="1.5" stroke-linecap="round"/>

      <!-- Right leg -->
      <line x1="118" y1="202" x2="128" y2="238" stroke="#d4c5a0" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="128" y1="238" x2="132" y2="270" stroke="#d4c5a0" stroke-width="2" stroke-linecap="round"/>
      <!-- Right foot -->
      <line x1="132" y1="270" x2="144" y2="276" stroke="#d4c5a0" stroke-width="2" stroke-linecap="round"/>
      <line x1="132" y1="270" x2="140" y2="278" stroke="#d4c5a0" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="132" y1="270" x2="135" y2="279" stroke="#d4c5a0" stroke-width="1.5" stroke-linecap="round"/>

      <!-- Tail -->
      <path d="M 100 200 Q 75 220 82 245 Q 92 265 75 280 Q 62 290 48 284" stroke="#d4c5a0" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </svg>`;
  }
};
