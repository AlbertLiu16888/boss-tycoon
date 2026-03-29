// ===== Leaderboard System =====
// Uses localStorage for local records + Google Sheets for global rankings
// 使用現有的多遊戲 Google Apps Script API

const LEADERBOARD_STORAGE_KEY = 'boss_tycoon_leaderboard';
const GAME_ID = 'bosstycoon';

// ⚠️ 請將此 URL 替換為你已部署的 Google Apps Script 網址
// 這是共用的多遊戲排行榜 API，同一個 URL 支援多個遊戲
const GOOGLE_SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbwAhuS5A02qLzdvUIzgCabG0FhTJdxlLpQBmAcJzIOgO3GvzMBEzilIzeblsPCnzi-m/exec';

const Leaderboard = {
  currentTab: 'local',
  globalData: null,
  lastScore: null,

  // ===== Local Leaderboard =====
  getLocal() {
    try {
      return JSON.parse(localStorage.getItem(LEADERBOARD_STORAGE_KEY)) || [];
    } catch { return []; }
  },

  saveLocal(entries) {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(entries));
  },

  addLocalEntry(entry) {
    const entries = this.getLocal();
    entries.push(entry);
    entries.sort((a, b) => b.netWorth - a.netWorth);
    if (entries.length > 50) entries.length = 50;
    this.saveLocal(entries);
    return entries;
  },

  // ===== Google Sheets Global Leaderboard (Multi-Game API) =====
  _isConfigured() {
    return GOOGLE_SHEET_API_URL && !GOOGLE_SHEET_API_URL.includes('YOUR_GOOGLE');
  },

  async fetchGlobal() {
    if (!this._isConfigured()) return null;
    try {
      // API 回傳格式: [{ name, score, date }, ...]
      const url = `${GOOGLE_SHEET_API_URL}?action=getScores&game=${GAME_ID}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          this.globalData = data.map(s => ({
            name: String(s.name || '匿名'),
            netWorth: Number(s.score) || 0,
            rank: '',
            rankIcon: '',
            turns: 0,
            age: 0,
            achievements: 0,
            reputation: 0,
            timestamp: s.date ? new Date(s.date).getTime() : 0,
          }));
          // Already sorted by score desc from API, take top 10
          this.globalData = this.globalData.slice(0, 10);
          return this.globalData;
        }
      }
    } catch (e) {
      console.warn('Global leaderboard unavailable:', e);
    }
    return null;
  },

  async pushGlobal(entry) {
    if (!this._isConfigured()) return false;
    try {
      // 使用現有 API: name (max 12 chars) + score (netWorth)
      const payload = {
        action: 'addScore',
        game: GAME_ID,
        name: entry.name,
        score: entry.netWorth,
      };
      await fetch(GOOGLE_SHEET_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors',
      });
      return true;
    } catch (e) {
      console.warn('Failed to push to global leaderboard:', e);
    }
    return false;
  },

  // ===== Score Creation =====
  _createScoreEntry(playerName) {
    const s = Game.state;
    if (!s) return null;
    const netWorth = calcNetWorth(s);
    const rank = [...LIFE_RANKS].reverse().find(r => netWorth >= r.min) || LIFE_RANKS[0];
    return {
      name: playerName,
      netWorth: netWorth,
      rank: rank.title,
      rankIcon: rank.icon,
      turns: s.turn,
      age: s.age,
      achievements: s.achievements.length,
      reputation: s.reputation,
      timestamp: Date.now(),
    };
  },

  // ===== UI Methods =====
  promptName() {
    if (!Game.state) return;
    const savedName = localStorage.getItem('boss_tycoon_player_name') || '';
    document.getElementById('player-name-input').value = savedName;
    document.getElementById('name-modal').classList.remove('hidden');
    document.getElementById('player-name-input').focus();
  },

  closeNameModal() {
    document.getElementById('name-modal').classList.add('hidden');
  },

  async submitScore() {
    const nameInput = document.getElementById('player-name-input');
    let name = nameInput.value.trim();
    if (!name) name = '匿名霸總';
    if (name.length > 12) name = name.slice(0, 12);

    localStorage.setItem('boss_tycoon_player_name', name);

    const entry = this._createScoreEntry(name);
    if (!entry) return;

    this.lastScore = entry;

    // Save locally
    this.addLocalEntry(entry);

    // Push to Google Sheets
    this.pushGlobal({ ...entry });

    this.closeNameModal();
    UI.showToast('🏅 成績已提交！', 'yellow');

    // Show leaderboard
    setTimeout(() => this.showModal(), 500);
  },

  showModal() {
    document.getElementById('leaderboard-modal').classList.remove('hidden');
    this.switchTab(this.currentTab);
  },

  closeModal() {
    document.getElementById('leaderboard-modal').classList.add('hidden');
  },

  switchTab(tab) {
    this.currentTab = tab;
    const localBtn = document.getElementById('lb-tab-local');
    const globalBtn = document.getElementById('lb-tab-global');

    if (tab === 'local') {
      localBtn.className = 'flex-1 py-2 rounded-lg text-xs font-bold bg-yellow-900 text-yellow-400 border border-yellow-700 transition';
      globalBtn.className = 'flex-1 py-2 rounded-lg text-xs font-bold bg-gray-800 text-gray-500 border border-gray-700 transition';
      this._renderLocal();
    } else {
      globalBtn.className = 'flex-1 py-2 rounded-lg text-xs font-bold bg-yellow-900 text-yellow-400 border border-yellow-700 transition';
      localBtn.className = 'flex-1 py-2 rounded-lg text-xs font-bold bg-gray-800 text-gray-500 border border-gray-700 transition';
      this._renderGlobal();
    }

    // Show share button if there's a recent score
    document.getElementById('lb-share-btn').classList.toggle('hidden', !this.lastScore);
  },

  _renderLocal() {
    const entries = this.getLocal();
    const container = document.getElementById('leaderboard-list');

    if (entries.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <div class="text-3xl mb-2">🏜️</div>
          <p>還沒有紀錄，快去闖一局吧！</p>
        </div>
      `;
      return;
    }

    // Show top 10
    container.innerHTML = entries.slice(0, 10).map((e, i) => this._renderEntry(e, i)).join('');
  },

  async _renderGlobal() {
    const container = document.getElementById('leaderboard-list');

    if (!this._isConfigured()) {
      container.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <div class="text-3xl mb-2">⚙️</div>
          <p>全球排行榜尚未設定</p>
          <p class="text-xs mt-1">請設定 GOOGLE_SHEET_API_URL</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <div class="text-2xl mb-2 animate-pulse-slow">🌐</div>
        <p>載入全球排名中...</p>
      </div>
    `;

    const data = await this.fetchGlobal();

    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          <div class="text-3xl mb-2">🌍</div>
          <p>全球排行榜尚無資料</p>
          <p class="text-xs mt-1">完成一局遊戲並提交成績即可上榜！</p>
        </div>
      `;
      return;
    }

    // Show top 10
    container.innerHTML = data.slice(0, 10).map((e, i) => this._renderEntry(e, i)).join('');
  },

  _renderEntry(entry, index) {
    const medals = ['🥇', '🥈', '🥉'];
    const medal = index < 3 ? medals[index] : `<span class="text-gray-500">${index + 1}</span>`;
    const timeAgo = this._timeAgo(entry.timestamp);
    const isRecent = this.lastScore && entry.timestamp === this.lastScore.timestamp && entry.name === this.lastScore.name;

    return `
      <div class="flex items-center gap-3 p-3 rounded-xl ${isRecent ? 'bg-yellow-900 bg-opacity-30 border border-yellow-700' : 'bg-gray-800 bg-opacity-60'} ${index < 3 ? 'border border-opacity-30 ' + ['border-yellow-500', 'border-gray-400', 'border-yellow-700'][index] : ''}">
        <div class="text-xl w-8 text-center flex-shrink-0">${medal}</div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1">
            <span class="font-bold text-sm truncate">${this._escapeHtml(entry.name)}</span>
            <span class="text-xs">${entry.rankIcon || ''}</span>
            ${isRecent ? '<span class="text-xs text-yellow-400 ml-1">← 你</span>' : ''}
          </div>
          <div class="text-xs text-gray-500">
            ${entry.rank ? entry.rank + ' ｜ ' : ''}${entry.turns ? entry.turns + '回合 ｜ ' : ''}${entry.achievements ? '🏆' + entry.achievements : ''}
            ${!entry.rank && !entry.turns && !entry.achievements ? '全球玩家' : ''}
          </div>
        </div>
        <div class="text-right flex-shrink-0">
          <div class="font-black text-sm text-cyan-400">$${formatMoney(entry.netWorth)}</div>
          <div class="text-xs text-gray-600">${timeAgo}</div>
        </div>
      </div>
    `;
  },

  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  _timeAgo(ts) {
    if (!ts) return '';
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '剛剛';
    if (mins < 60) return `${mins} 分鐘前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} 小時前`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} 天前`;
    return new Date(ts).toLocaleDateString('zh-TW');
  },

  shareScore() {
    if (!this.lastScore) return;
    const e = this.lastScore;
    const text = `🏅 霸總養成計畫：2026 逆襲人生\n\n` +
      `${e.rankIcon} 人生等級：${e.rank}\n` +
      `💰 總資產：$${formatMoney(e.netWorth)}\n` +
      `🏆 成就：${e.achievements} / ${ACHIEVEMENTS.length}\n` +
      `⭐ 名聲：${e.reputation}\n\n` +
      `你也來挑戰看看！👇\n` +
      (window.location.href);

    if (navigator.share) {
      navigator.share({ title: '霸總養成計畫', text: text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        UI.showToast('📋 成績已複製到剪貼簿！', 'green');
      }).catch(() => {
        this._fallbackCopy(text);
      });
    } else {
      this._fallbackCopy(text);
    }
  },

  _fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    UI.showToast('📋 成績已複製到剪貼簿！', 'green');
  },
};

// Listen for Enter key in name input
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('player-name-input');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') Leaderboard.submitScore();
    });
  }
});
