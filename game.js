// ===== Helper Functions =====
function formatMoney(n) {
  if (Math.abs(n) >= 1e8) return (n / 1e8).toFixed(2) + ' 億';
  if (Math.abs(n) >= 1e4) return (n / 1e4).toFixed(1) + ' 萬';
  return n.toLocaleString('zh-TW');
}

function calcNetWorth(state) {
  let worth = state.cash;
  // Inventory value
  for (const [id, qty] of Object.entries(state.inventory)) {
    if (qty > 0) worth += (state.prices[id] || 0) * qty;
  }
  // Property value
  for (const pid of state.properties) {
    const prop = PROPERTIES.find(p => p.id === pid);
    if (prop) worth += prop.price;
  }
  return worth;
}

function getInventoryCount(state) {
  return Object.values(state.inventory).reduce((a, b) => a + b, 0);
}

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

// ===== Game State =====
const DEFAULT_STATE = {
  turn: 1,
  age: 20,
  cash: 1000000,
  health: 100,
  reputation: 0,
  inventory: {},       // { goodId: quantity }
  avgCost: {},         // { goodId: avgPricePerUnit }
  prices: {},          // { goodId: currentPrice }
  prevPrices: {},      // { goodId: lastTurnPrice }
  properties: [],      // [propertyId, ...]
  friends: [],         // [npcId, ...]
  achievements: [],    // [achievementId, ...]
  warehouseCapacity: 10,
  maxProfit: 0,
  cryptoProfit: 0,
  healthyTurns: 0,
  totalEarned: 0,
  currentEvent: null,
  eventMultipliers: {},  // { category: multiplier } for current turn
  gameOver: false,
};

// ===== Game Engine =====
const Game = {
  state: null,

  newGame() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    // Initialize prices
    for (const g of GOODS) {
      this.state.prices[g.id] = g.basePrice;
      this.state.prevPrices[g.id] = g.basePrice;
    }
    this._startGame();
  },

  loadGame() {
    try {
      const saved = localStorage.getItem('boss_tycoon_save');
      if (saved) {
        this.state = JSON.parse(saved);
        this._startGame();
      }
    } catch (e) {
      console.error('Load failed:', e);
      this.newGame();
    }
  },

  saveGame() {
    try {
      localStorage.setItem('boss_tycoon_save', JSON.stringify(this.state));
    } catch (e) { console.error('Save failed:', e); }
  },

  showSplash() {
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('top-bar').classList.add('hidden');
    document.getElementById('news-ticker').classList.add('hidden');
    document.getElementById('next-turn-bar').classList.add('hidden');
    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('bottom-nav').classList.add('hidden');
    document.getElementById('splash-screen').classList.remove('hidden');
    // Check for save
    const saved = localStorage.getItem('boss_tycoon_save');
    document.getElementById('continue-btn').classList.toggle('hidden', !saved);
  },

  _startGame() {
    document.getElementById('splash-screen').classList.add('hidden');
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('top-bar').classList.remove('hidden');
    document.getElementById('news-ticker').classList.remove('hidden');
    document.getElementById('next-turn-bar').classList.remove('hidden');
    document.getElementById('main-content').classList.remove('hidden');
    document.getElementById('bottom-nav').classList.remove('hidden');
    UI.updateAll();
    this.saveGame();
    // Show tutorial for first-time players
    if (!localStorage.getItem('boss_tycoon_tutorial_done') && this.state.turn === 1) {
      setTimeout(() => { if (typeof Tutorial !== 'undefined') Tutorial.start(); }, 400);
    }
  },

  nextTurn() {
    if (this.state.gameOver) return;
    const s = this.state;

    // 1. Deduct living cost
    const livingCost = BASE_LIVING_COST * (1 + (s.turn - 1) * 0.03);
    s.cash -= Math.round(livingCost);

    // 2. Trigger random event
    s.eventMultipliers = {};
    const event = this._rollEvent();
    s.currentEvent = event;

    // 3. Apply event effects
    if (event) {
      this._applyEvent(event);
    }

    // 4. Update prices
    s.prevPrices = { ...s.prices };
    for (const g of GOODS) {
      let base = g.basePrice;
      let fluctuation = (Math.random() * 2 - 1) * g.volatility;
      let eventMult = s.eventMultipliers[g.category] || 1;
      let newPrice = base * (1 + fluctuation) * eventMult;
      // Clamp to reasonable range
      newPrice = clamp(newPrice, base * 0.1, base * 5);
      s.prices[g.id] = Math.round(newPrice);
    }

    // 5. Collect rent
    let totalRent = 0;
    for (const pid of s.properties) {
      const prop = PROPERTIES.find(p => p.id === pid);
      if (prop) {
        let rent = prop.rent;
        // Check friend bonus
        if (s.friends.includes(3)) rent = Math.round(rent * 1.3); // 陳董 bonus
        totalRent += rent;
        // Health bonus from farm
        if (prop.id === 5) s.health = clamp(s.health + 5, 0, 100);
      }
    }
    s.cash += totalRent;

    // 6. Apply friend bonuses
    for (const fid of s.friends) {
      const npc = NPCS.find(n => n.id === fid);
      if (!npc) continue;
      if (npc.bonus.type === 'rep_per_turn') s.reputation += npc.bonus.value;
      if (npc.bonus.type === 'health_per_turn') s.health = clamp(s.health + npc.bonus.value, 0, 100);
    }

    // 7. Age-related health decay
    if (s.age >= 40) s.health = clamp(s.health - 2, 0, 100);
    if (s.age >= 50) s.health = clamp(s.health - 3, 0, 100);

    // 8. Track healthy turns
    if (s.health >= 90) s.healthyTurns++;
    else s.healthyTurns = 0;

    // 9. Advance turn
    s.turn++;
    s.age++;

    // 10. Check achievements
    this._checkAchievements();

    // 11. Check end conditions
    if (s.turn > 40 || s.health <= 0) {
      s.gameOver = true;
      this.saveGame();
      UI.updateAll();
      if (event) {
        UI.showEventModal(event, () => UI.showEndScreen());
      } else {
        UI.showEndScreen();
      }
      return;
    }

    // 12. Try to meet new NPC
    this._tryMeetNPC();

    // 13. Save & update UI
    this.saveGame();
    UI.updateAll();

    // 14. Show event if any
    if (event) UI.showEventModal(event);
  },

  _rollEvent() {
    // 60% chance of an event each turn
    if (Math.random() > 0.6) return null;
    // Weight toward non-special events
    const pool = EVENTS.filter(e => e.type !== 'special' || Math.random() < 0.2);
    return pool[Math.floor(Math.random() * pool.length)];
  },

  _applyEvent(event) {
    const s = this.state;
    const eff = event.effect;

    // Check lawyer shield for negative events
    if (event.type === 'negative' && s.friends.includes(6)) {
      if (Math.random() < 0.3) {
        event._shielded = true;
        return;
      }
    }

    switch (eff.type) {
      case 'category_boost':
        s.eventMultipliers[eff.category] = eff.multiplier;
        break;
      case 'category_crash':
        s.eventMultipliers[eff.category] = eff.multiplier;
        break;
      case 'cash_change':
        s.cash += eff.value;
        if (s.cash < 0) s.cash = 0;
        break;
      case 'rep_change':
        s.reputation += eff.value;
        if (s.reputation < 0) s.reputation = 0;
        break;
      case 'health_change':
        s.health = clamp(s.health + eff.value, 0, 100);
        break;
      case 'category_damage':
        for (const [id, qty] of Object.entries(s.inventory)) {
          const good = GOODS.find(g => g.id === parseInt(id));
          if (good && good.category === eff.category) {
            const lost = Math.floor(qty * eff.ratio);
            s.inventory[id] = qty - lost;
          }
        }
        break;
      case 'random_damage':
        for (const [id, qty] of Object.entries(s.inventory)) {
          if (qty > 0 && Math.random() < 0.5) {
            const lost = Math.floor(qty * eff.ratio);
            s.inventory[id] = qty - lost;
          }
        }
        break;
      case 'property_boost':
        // Temporary cash bonus based on property value
        for (const pid of s.properties) {
          const prop = PROPERTIES.find(p => p.id === pid);
          if (prop) s.cash += Math.round(prop.price * 0.05);
        }
        break;
      case 'special_deal':
      case 'hint':
        // These are informational
        break;
    }
  },

  _tryMeetNPC() {
    const s = this.state;
    const available = NPCS.filter(n => !s.friends.includes(n.id) && s.age >= n.unlockAge);
    if (available.length === 0) return;
    // 30% chance per turn to meet someone
    if (Math.random() > 0.3) return;
    const npc = available[Math.floor(Math.random() * available.length)];
    s.friends.push(npc.id);
    UI.showToast(`🤝 結交了 ${npc.name}！`, 'cyan');
  },

  _checkAchievements() {
    const s = this.state;
    for (const ach of ACHIEVEMENTS) {
      if (!s.achievements.includes(ach.id) && ach.check(s)) {
        s.achievements.push(ach.id);
        UI.showToast(`🏆 解鎖成就：${ach.name}`, 'yellow');
      }
    }
  },

  buyGood(goodId, qty) {
    const s = this.state;
    const price = s.prices[goodId];
    const totalCost = price * qty;
    const currentCount = getInventoryCount(s);

    if (totalCost > s.cash) { UI.showToast('❌ 現金不足！', 'red'); return; }
    if (currentCount + qty > s.warehouseCapacity) { UI.showToast('❌ 倉庫空間不足！', 'red'); return; }

    // Apply tech discount if friend
    let finalCost = totalCost;
    const good = GOODS.find(g => g.id === goodId);
    if (good && good.category === 'tech' && s.friends.includes(1)) {
      finalCost = Math.round(totalCost * 0.85);
    }

    s.cash -= finalCost;
    const prevQty = s.inventory[goodId] || 0;
    const prevAvg = s.avgCost[goodId] || 0;
    s.inventory[goodId] = prevQty + qty;
    s.avgCost[goodId] = Math.round((prevAvg * prevQty + finalCost) / (prevQty + qty));

    UI.showToast(`✅ 買入 ${good.name} x${qty}`, 'green');
    UI.updateAll();
    Game.saveGame();
  },

  sellGood(goodId, qty) {
    const s = this.state;
    const held = s.inventory[goodId] || 0;
    if (qty > held) { UI.showToast('❌ 持有數量不足！', 'red'); return; }

    const price = s.prices[goodId];
    const revenue = price * qty;
    const avgCost = s.avgCost[goodId] || 0;
    const profit = revenue - avgCost * qty;

    s.cash += revenue;
    s.inventory[goodId] = held - qty;
    if (s.inventory[goodId] <= 0) {
      delete s.inventory[goodId];
      delete s.avgCost[goodId];
    }

    // Track profits
    if (profit > s.maxProfit) s.maxProfit = profit;
    if (profit > 0) s.totalEarned += profit;
    const good = GOODS.find(g => g.id === goodId);
    if (good && good.category === 'crypto' && profit > 0) s.cryptoProfit += profit;

    const profitText = profit >= 0 ? `賺 $${formatMoney(profit)}` : `虧 $${formatMoney(Math.abs(profit))}`;
    UI.showToast(`💸 賣出 ${good.name} x${qty}（${profitText}）`, profit >= 0 ? 'green' : 'red');
    Game._checkAchievements();
    UI.updateAll();
    Game.saveGame();
  },

  buyProperty(propId) {
    const s = this.state;
    const prop = PROPERTIES.find(p => p.id === propId);
    if (!prop) return;
    if (s.properties.includes(propId)) { UI.showToast('❌ 已經擁有！', 'red'); return; }
    if (s.cash < prop.price) { UI.showToast('❌ 現金不足！', 'red'); return; }

    s.cash -= prop.price;
    s.properties.push(propId);
    s.reputation += prop.repBonus;

    UI.showToast(`🏠 購買了 ${prop.name}！`, 'cyan');
    Game._checkAchievements();
    UI.updateAll();
    Game.saveGame();
  },

  expandWarehouse() {
    const s = this.state;
    const cost = s.warehouseCapacity * 50000;
    if (s.cash < cost) { UI.showToast('❌ 現金不足！', 'red'); return; }
    s.cash -= cost;
    s.warehouseCapacity += 5;
    UI.showToast(`📦 倉庫擴建至 ${s.warehouseCapacity} 格！`, 'cyan');
    UI.updateAll();
    Game.saveGame();
  },
};

// ===== UI Controller =====
const UI = {
  currentTab: 'market',
  toastTimer: null,

  switchTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`tab-${tab}`).classList.remove('hidden');
    document.querySelectorAll('.tab-btn').forEach(el => {
      const isActive = el.dataset.tab === tab;
      el.classList.toggle('text-cyan-400', isActive);
      el.classList.toggle('border-t-2', isActive);
      el.classList.toggle('border-cyan-400', isActive);
      el.classList.toggle('text-gray-500', !isActive);
      el.classList.toggle('border-t-2', isActive);
    });
    this.updateAll();
  },

  updateAll() {
    if (!Game.state) return;
    const s = Game.state;

    // Top bar
    document.getElementById('age-display').textContent = `${s.age}歲`;
    document.getElementById('year-display').textContent = `第 ${s.turn} / 40 年`;
    document.getElementById('cash-display').textContent = `$${formatMoney(s.cash)}`;
    document.getElementById('health-bar').style.width = `${s.health}%`;
    document.getElementById('health-bar').className = `h-2 rounded-full transition-all ${
      s.health > 60 ? 'bg-green-500' : s.health > 30 ? 'bg-yellow-500' : 'bg-red-500'
    }`;
    document.getElementById('rep-display').textContent = s.reputation;
    document.getElementById('networth-display').textContent = `$${formatMoney(calcNetWorth(s))}`;
    document.getElementById('inventory-count').textContent = getInventoryCount(s);
    document.getElementById('inventory-max').textContent = s.warehouseCapacity;

    // Disable next turn if game over
    document.getElementById('next-turn-btn').disabled = s.gameOver;

    // Update current tab
    switch (this.currentTab) {
      case 'market': this._renderMarket(); break;
      case 'assets': this._renderAssets(); break;
      case 'social': this._renderSocial(); break;
      case 'achievements': this._renderAchievements(); break;
    }
  },

  _renderMarket() {
    const s = Game.state;
    const container = document.getElementById('market-list');
    let html = '';

    for (const g of GOODS) {
      const price = s.prices[g.id];
      const prevPrice = s.prevPrices[g.id] || price;
      const diff = price - prevPrice;
      const pct = prevPrice ? ((diff / prevPrice) * 100).toFixed(1) : '0.0';
      const held = s.inventory[g.id] || 0;
      const avgCost = s.avgCost[g.id] || 0;
      const maxBuy = Math.min(
        Math.floor(s.cash / price),
        s.warehouseCapacity - getInventoryCount(s)
      );

      html += `
        <div class="market-card">
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-center gap-2">
              <span class="text-2xl">${g.icon}</span>
              <div>
                <div class="font-bold text-sm">${g.name}</div>
                <div class="text-xs text-gray-500">持有: ${held}${held > 0 ? ` (均價 $${formatMoney(avgCost)})` : ''}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-black text-lg">$${formatMoney(price)}</div>
              <div class="text-xs ${diff > 0 ? 'price-up' : diff < 0 ? 'price-down' : 'text-gray-500'}">
                ${diff > 0 ? '▲' : diff < 0 ? '▼' : '─'} ${Math.abs(pct)}%
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 justify-end">
            <button class="btn-max" onclick="document.getElementById('qty-${g.id}').value=${maxBuy}">最大</button>
            <input id="qty-${g.id}" type="number" class="qty-input" value="1" min="1" max="999">
            <button class="btn-buy" ${maxBuy <= 0 ? 'disabled' : ''} onclick="Game.buyGood(${g.id}, parseInt(document.getElementById('qty-${g.id}').value) || 1)">買入</button>
            <button class="btn-sell" ${held <= 0 ? 'disabled' : ''} onclick="Game.sellGood(${g.id}, parseInt(document.getElementById('qty-${g.id}').value) || 1)">賣出</button>
            ${held > 0 ? `<button class="btn-max" onclick="Game.sellGood(${g.id}, ${held})">全賣</button>` : ''}
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  },

  _renderAssets() {
    const s = Game.state;

    // Properties
    const propContainer = document.getElementById('assets-list');
    let propHtml = '';

    for (const p of PROPERTIES) {
      const owned = s.properties.includes(p.id);
      const locked = s.age < p.unlockAge;

      propHtml += `
        <div class="asset-card ${locked ? 'opacity-50' : ''}">
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-2">
              <span class="text-2xl">${p.icon}</span>
              <div>
                <div class="font-bold text-sm">${p.name} ${owned ? '<span class="text-green-400 text-xs">✓ 已擁有</span>' : ''}</div>
                <div class="text-xs text-gray-500">${p.description}</div>
                <div class="text-xs text-purple-400 mt-1">月租 $${formatMoney(p.rent)} ｜ 名聲 +${p.repBonus}</div>
              </div>
            </div>
            <div class="text-right flex-shrink-0">
              <div class="text-sm font-bold text-yellow-400">$${formatMoney(p.price)}</div>
              ${locked ? `<div class="text-xs text-gray-500">${p.unlockAge}歲解鎖</div>` :
                !owned ? `<button class="btn-buy mt-1" onclick="Game.buyProperty(${p.id})">購買</button>` : ''}
            </div>
          </div>
        </div>
      `;
    }

    // Warehouse expansion
    const expandCost = s.warehouseCapacity * 50000;
    propHtml += `
      <div class="asset-card mt-4">
        <div class="flex justify-between items-center">
          <div>
            <div class="font-bold text-sm">📦 倉庫擴建</div>
            <div class="text-xs text-gray-500">目前 ${s.warehouseCapacity} 格 → ${s.warehouseCapacity + 5} 格</div>
          </div>
          <button class="btn-buy" onclick="Game.expandWarehouse()">$${formatMoney(expandCost)}</button>
        </div>
      </div>
    `;
    propContainer.innerHTML = propHtml;

    // Warehouse inventory
    const warehouseContainer = document.getElementById('warehouse-list');
    let whHtml = '';
    let hasItems = false;
    for (const [id, qty] of Object.entries(s.inventory)) {
      if (qty <= 0) continue;
      hasItems = true;
      const good = GOODS.find(g => g.id === parseInt(id));
      if (!good) continue;
      const value = s.prices[id] * qty;
      const cost = (s.avgCost[id] || 0) * qty;
      const profit = value - cost;
      whHtml += `
        <div class="bg-gray-800 rounded-lg p-3 flex justify-between items-center">
          <div>
            <span>${good.icon} ${good.name} x${qty}</span>
            <div class="text-xs ${profit >= 0 ? 'text-green-400' : 'text-red-400'}">
              市值 $${formatMoney(value)} (${profit >= 0 ? '+' : ''}$${formatMoney(profit)})
            </div>
          </div>
        </div>
      `;
    }
    if (!hasItems) whHtml = '<div class="text-gray-600 text-sm text-center py-4">倉庫空空的，快去市場進貨吧！</div>';
    warehouseContainer.innerHTML = whHtml;
  },

  _renderSocial() {
    const s = Game.state;
    const container = document.getElementById('social-list');
    let html = '';

    for (const npc of NPCS) {
      const isFriend = s.friends.includes(npc.id);
      const locked = s.age < npc.unlockAge;

      html += `
        <div class="social-card ${locked && !isFriend ? 'opacity-40' : ''}">
          <div class="flex items-start gap-3">
            <span class="text-3xl">${npc.icon}</span>
            <div class="flex-1">
              <div class="font-bold text-sm">
                ${npc.name}
                ${isFriend ? '<span class="text-green-400 text-xs ml-1">✓ 朋友</span>' : ''}
              </div>
              <div class="text-xs text-cyan-400">${npc.description}</div>
              ${isFriend ? `<div class="text-xs text-gray-500 italic mt-1">${npc.flavor}</div>` :
                locked ? `<div class="text-xs text-gray-600 mt-1">🔒 ${npc.unlockAge}歲後有機會遇到</div>` :
                `<div class="text-xs text-gray-600 mt-1">🎲 隨機遇到</div>`}
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  },

  _renderAchievements() {
    const s = Game.state;
    const container = document.getElementById('achievements-list');
    let html = '';

    for (const ach of ACHIEVEMENTS) {
      const unlocked = s.achievements.includes(ach.id);
      html += `
        <div class="achievement-card ${unlocked ? 'unlocked' : ''}">
          <div class="flex items-center gap-3">
            <span class="text-2xl ${unlocked ? '' : 'grayscale opacity-40'}">${ach.icon}</span>
            <div>
              <div class="font-bold text-sm ${unlocked ? 'text-yellow-400' : 'text-gray-500'}">${ach.name}</div>
              <div class="text-xs text-gray-500">${ach.desc}</div>
            </div>
            ${unlocked ? '<span class="ml-auto text-yellow-400">✓</span>' : ''}
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  },

  showEventModal(event, callback) {
    if (!event) { if (callback) callback(); return; }
    const modal = document.getElementById('event-modal');
    document.getElementById('event-icon').textContent = event.icon;
    document.getElementById('event-title').textContent = event.title;

    let desc = event.desc;
    if (event._shielded) desc += '\n\n⚖️ 林律師出手，成功抵擋了負面影響！';
    document.getElementById('event-desc').textContent = desc;

    let effectText = '';
    const eff = event.effect;
    if (event._shielded) {
      effectText = '✅ 影響已被抵擋';
    } else {
      switch (eff.type) {
        case 'category_boost': effectText = `📈 ${eff.category} 類商品價格 x${eff.multiplier}`; break;
        case 'category_crash': effectText = `📉 ${eff.category} 類商品價格 x${eff.multiplier}`; break;
        case 'cash_change': effectText = `💰 現金 ${eff.value > 0 ? '+' : ''}$${formatMoney(eff.value)}`; break;
        case 'rep_change': effectText = `⭐ 名聲 ${eff.value > 0 ? '+' : ''}${eff.value}`; break;
        case 'health_change': effectText = `❤️ 健康 ${eff.value > 0 ? '+' : ''}${eff.value}`; break;
        case 'category_damage': effectText = `💥 ${eff.category} 類庫存損失 ${Math.round(eff.ratio * 100)}%`; break;
        case 'random_damage': effectText = `🌀 隨機庫存損失 ${Math.round(eff.ratio * 100)}%`; break;
        case 'property_boost': effectText = `🏠 房產增值收益！`; break;
        case 'special_deal': effectText = `🎭 特殊交易機會！`; break;
        case 'hint': effectText = `🔮 這是一個提示...`; break;
      }
    }
    document.getElementById('event-effect').textContent = effectText;

    modal.classList.remove('hidden');
    this._eventCallback = callback;
  },

  closeEventModal() {
    document.getElementById('event-modal').classList.add('hidden');
    if (this._eventCallback) {
      this._eventCallback();
      this._eventCallback = null;
    }
  },

  showEndScreen() {
    const s = Game.state;
    const netWorth = calcNetWorth(s);
    const rank = [...LIFE_RANKS].reverse().find(r => netWorth >= r.min) || LIFE_RANKS[0];
    const won = netWorth >= 1000000000;

    document.getElementById('end-icon').textContent = rank.icon;
    document.getElementById('end-title').textContent = rank.title;
    document.getElementById('end-subtitle').textContent = rank.desc;

    const endReason = s.health <= 0 ? '⚠️ 健康歸零，人生提前結束...' : '⏰ 40 年的人生旅程結束了！';

    document.getElementById('end-stats').innerHTML = `
      <div class="text-gray-400">${endReason}</div>
      <hr class="border-gray-700">
      <div class="flex justify-between"><span>💵 最終現金</span><span class="text-green-400">$${formatMoney(s.cash)}</span></div>
      <div class="flex justify-between"><span>📊 總資產</span><span class="text-cyan-400 font-bold">$${formatMoney(netWorth)}</span></div>
      <div class="flex justify-between"><span>🏠 房產數</span><span>${s.properties.length}</span></div>
      <div class="flex justify-between"><span>👥 朋友數</span><span>${s.friends.length}</span></div>
      <div class="flex justify-between"><span>⭐ 名聲</span><span class="text-purple-400">${s.reputation}</span></div>
      <div class="flex justify-between"><span>❤️ 健康</span><span>${s.health}</span></div>
      <div class="flex justify-between"><span>🏆 成就</span><span>${s.achievements.length} / ${ACHIEVEMENTS.length}</span></div>
      <div class="flex justify-between"><span>💹 最大單筆獲利</span><span>$${formatMoney(s.maxProfit)}</span></div>
      ${won ? '<div class="text-center text-yellow-400 font-bold mt-2">🎉 恭喜達成 10 億目標！你就是霸總！</div>' : ''}
    `;

    document.getElementById('end-screen').classList.remove('hidden');
  },

  showToast(msg, color = 'cyan') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = `fixed top-16 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300`;
    const colors = {
      cyan: 'bg-cyan-900 text-cyan-300 border border-cyan-700',
      green: 'bg-green-900 text-green-300 border border-green-700',
      red: 'bg-red-900 text-red-300 border border-red-700',
      yellow: 'bg-yellow-900 text-yellow-300 border border-yellow-700',
    };
    toast.classList.add(...(colors[color] || colors.cyan).split(' '));
    toast.style.opacity = '1';

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { toast.style.opacity = '0'; }, 2000);
  },
};

// ===== News Ticker =====
function updateTicker(event) {
  const ticker = document.getElementById('ticker-text');
  if (event) {
    ticker.textContent = `${event.icon} ${event.title} ─ ${event.desc}`;
  } else {
    const tips = [
      '低買高賣是致富的不二法門！',
      '注意倉庫容量，別讓好貨進不了門！',
      '房產可以穩定收租，長期投資的好選擇。',
      '多交朋友，每位 NPC 都有獨特的加成效果。',
      '健康很重要！40 歲後健康會自然下降。',
      '留意市場趨勢，高波動商品高風險高報酬！',
    ];
    ticker.textContent = tips[Math.floor(Math.random() * tips.length)];
  }
}

// Observe event changes
const origShowEvent = UI.showEventModal.bind(UI);
UI.showEventModal = function(event, cb) {
  if (event && !event._shielded) updateTicker(event);
  origShowEvent(event, cb);
};

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  Game.showSplash();
});
