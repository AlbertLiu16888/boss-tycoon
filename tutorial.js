// ===== Tutorial / Onboarding System =====
const TUTORIAL_STEPS = [
  {
    icon: '👋',
    title: '歡迎，未來的霸總！',
    desc: '你有 40 年的時間，目標是累積 10 億資產。讓我來教你怎麼玩！',
    target: null,
    position: 'center',
  },
  {
    icon: '📊',
    title: '你的狀態列',
    desc: '這裡顯示你的年齡、現金、健康和名聲。注意健康不要歸零！',
    target: '#top-bar',
    position: 'below',
  },
  {
    icon: '🏪',
    title: '商品市場',
    desc: '在市場「低買高賣」賺取差價！每種商品的價格每年都會波動。點「最大」可以一鍵填入最大購買量。',
    target: '#market-list .market-card:first-child',
    position: 'below',
  },
  {
    icon: '⏩',
    title: '進入下一年',
    desc: '買完商品後，點這個按鈕進入下一年。價格會變動，也可能觸發隨機事件！',
    target: '#next-turn-bar',
    position: 'above',
  },
  {
    icon: '🏠',
    title: '資產投資',
    desc: '點底部「資產」分頁，可以購買房產收租金，讓錢為你工作！',
    target: '[data-tab="assets"]',
    position: 'above',
  },
  {
    icon: '👥',
    title: '社交圈',
    desc: '隨著年齡增長，你會遇到各種 NPC 朋友。每位朋友都有獨特的加成效果！',
    target: '[data-tab="social"]',
    position: 'above',
  },
  {
    icon: '🎯',
    title: '準備好了嗎？',
    desc: '記住：低買高賣、分散投資、注意健康。現在開始你的逆襲之路吧！',
    target: null,
    position: 'center',
  },
];

const Tutorial = {
  currentStep: 0,
  active: false,

  start() {
    this.currentStep = 0;
    this.active = true;
    document.getElementById('tutorial-overlay').classList.remove('hidden');
    this._render();
  },

  next() {
    this.currentStep++;
    if (this.currentStep >= TUTORIAL_STEPS.length) {
      this.finish();
      return;
    }
    this._render();
  },

  skip() {
    this.finish();
  },

  finish() {
    this.active = false;
    document.getElementById('tutorial-overlay').classList.add('hidden');
    localStorage.setItem('boss_tycoon_tutorial_done', '1');
    UI.showToast('🎓 教學完成！祝你成為霸總！', 'cyan');
  },

  _render() {
    const step = TUTORIAL_STEPS[this.currentStep];
    const overlay = document.getElementById('tutorial-overlay');
    const highlight = document.getElementById('tutorial-highlight');
    const tooltip = document.getElementById('tutorial-tooltip');

    // Update text
    document.getElementById('tutorial-step-icon').textContent = step.icon;
    document.getElementById('tutorial-step-title').textContent = step.title;
    document.getElementById('tutorial-step-desc').textContent = step.desc;
    document.getElementById('tutorial-progress').textContent = `${this.currentStep + 1} / ${TUTORIAL_STEPS.length}`;

    // Update button text
    const nextBtn = document.getElementById('tutorial-next-btn');
    nextBtn.textContent = this.currentStep === TUTORIAL_STEPS.length - 1 ? '開始遊戲！' : '下一步';

    if (step.target && document.querySelector(step.target)) {
      const el = document.querySelector(step.target);
      const rect = el.getBoundingClientRect();
      const pad = 6;

      // Position highlight
      highlight.style.left = (rect.left - pad) + 'px';
      highlight.style.top = (rect.top - pad) + 'px';
      highlight.style.width = (rect.width + pad * 2) + 'px';
      highlight.style.height = (rect.height + pad * 2) + 'px';
      highlight.style.display = 'block';

      // Position tooltip
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translateX(-50%)';
      tooltip.style.right = 'auto';
      tooltip.style.maxWidth = '320px';
      tooltip.style.width = '85vw';

      if (step.position === 'below') {
        tooltip.style.top = (rect.bottom + 16) + 'px';
        tooltip.style.bottom = 'auto';
      } else if (step.position === 'above') {
        tooltip.style.bottom = (window.innerHeight - rect.top + 16) + 'px';
        tooltip.style.top = 'auto';
      }
    } else {
      // Center position (no highlight)
      highlight.style.display = 'none';
      tooltip.style.left = '50%';
      tooltip.style.top = '50%';
      tooltip.style.transform = 'translate(-50%, -50%)';
      tooltip.style.bottom = 'auto';
      tooltip.style.right = 'auto';
      tooltip.style.maxWidth = '320px';
      tooltip.style.width = '85vw';
    }
  },
};
