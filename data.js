// ===== 商品資料 =====
const GOODS = [
  { id: 1, name: "厚乳開心果拿鐵", icon: "☕", basePrice: 150, volatility: 0.2, category: "food" },
  { id: 2, name: "Labubu 2.0 限量版", icon: "🧸", basePrice: 3500, volatility: 0.8, category: "collectible" },
  { id: 3, name: "液冷 AI 伺服器", icon: "🖥️", basePrice: 500000, volatility: 1.5, category: "tech" },
  { id: 4, name: "碳權憑證", icon: "🌱", basePrice: 20000, volatility: 0.3, category: "green" },
  { id: 5, name: "台積電零股", icon: "📈", basePrice: 12000, volatility: 0.6, category: "stock" },
  { id: 6, name: "虛擬土地 NFT", icon: "🌐", basePrice: 80000, volatility: 1.2, category: "crypto" },
  { id: 7, name: "有機高山茶禮盒", icon: "🍵", basePrice: 800, volatility: 0.15, category: "food" },
  { id: 8, name: "電動機車", icon: "🛵", basePrice: 45000, volatility: 0.25, category: "vehicle" },
  { id: 9, name: "AI 寫真寫真集", icon: "📸", basePrice: 2000, volatility: 0.9, category: "collectible" },
  { id: 10, name: "太陽能板組", icon: "☀️", basePrice: 120000, volatility: 0.35, category: "green" },
];

// ===== 房產資料 =====
const PROPERTIES = [
  { id: 1, name: "新竹預售屋", icon: "🏗️", price: 8000000, rent: 25000, repBonus: 5, unlockAge: 25, description: "竹科旁邊，穩定收租" },
  { id: 2, name: "台中七期套房", icon: "🏢", price: 15000000, rent: 45000, repBonus: 10, unlockAge: 28, description: "國際級豪宅區，身份象徵" },
  { id: 3, name: "信義區商辦", icon: "🏙️", price: 50000000, rent: 200000, repBonus: 30, unlockAge: 32, description: "信義計畫區 A 辦，霸總標配" },
  { id: 4, name: "花蓮民宿", icon: "🏡", price: 6000000, rent: 35000, repBonus: 8, unlockAge: 26, description: "面海景觀，觀光財" },
  { id: 5, name: "私人農場", icon: "🌾", price: 3000000, rent: 10000, repBonus: 3, unlockAge: 22, description: "有機農業，健康 +5 / 年" },
];

// ===== NPC 社交角色 =====
const NPCS = [
  { id: 1, name: "小安｜AI 工程師", icon: "👨‍💻", bonus: { type: "tech_discount", value: 0.15 }, description: "購買科技類商品打 85 折", unlockAge: 22, flavor: "「模型又爆了，不過我幫你算了一下，這批貨划算。」" },
  { id: 2, name: "Mia｜脆紅 Influencer", icon: "📱", bonus: { type: "rep_per_turn", value: 5 }, description: "每回合名聲 +5", unlockAge: 24, flavor: "「我幫你發一篇，流量包在我身上！」" },
  { id: 3, name: "陳董｜房產大亨", icon: "🤵", bonus: { type: "rent_boost", value: 0.3 }, description: "所有房產收租 +30%", unlockAge: 30, flavor: "「地段、地段、還是地段。」" },
  { id: 4, name: "小花｜有機農場主", icon: "🌻", bonus: { type: "health_per_turn", value: 3 }, description: "每回合健康 +3", unlockAge: 23, flavor: "「身體是革命的本錢，來喝碗雞湯。」" },
  { id: 5, name: "Kevin｜加密貨幣 OG", icon: "🪙", bonus: { type: "crypto_boost", value: 0.5 }, description: "加密類商品漲幅額外 +50%", unlockAge: 26, flavor: "「HODL！這次一定是牛市！」" },
  { id: 6, name: "林律師｜法律顧問", icon: "⚖️", bonus: { type: "event_shield", value: 0.3 }, description: "30% 機率抵擋負面事件", unlockAge: 28, flavor: "「放心，這案子我罩的。」" },
];

// ===== 隨機事件庫 =====
const EVENTS = [
  // 利好事件
  { id: 1, type: "positive", title: "黃老師來台演講", desc: "AI 教父黃仁勳再度訪台，科技相關商品暴漲！", icon: "🤖", effect: { type: "category_boost", category: "tech", multiplier: 3.0 } },
  { id: 2, type: "positive", title: "脆友集體肉搜成功", desc: "Threads 上的正義鄉民出動，你的名聲大漲！", icon: "🔍", effect: { type: "rep_change", value: 20 } },
  { id: 3, type: "positive", title: "碳中和政策加碼", desc: "政府宣布碳權補貼計畫，綠能商品大漲！", icon: "🌿", effect: { type: "category_boost", category: "green", multiplier: 2.5 } },
  { id: 4, type: "positive", title: "觀光客爆量湧入", desc: "日圓持續貶值，日本觀光客擠爆台灣！飲食類大賣！", icon: "✈️", effect: { type: "category_boost", category: "food", multiplier: 2.0 } },
  { id: 5, type: "positive", title: "比特幣創新高", desc: "幣圈再度狂歡，加密相關商品飆漲！", icon: "🚀", effect: { type: "category_boost", category: "crypto", multiplier: 3.5 } },
  { id: 6, type: "positive", title: "房市回春", desc: "央行降息，房地產市場火熱！所有房產增值 20%！", icon: "🏠", effect: { type: "property_boost", multiplier: 1.2 } },
  { id: 7, type: "positive", title: "意外中發票", desc: "統一發票對中特獎，獲得一筆意外之財！", icon: "🎰", effect: { type: "cash_change", value: 500000 } },
  { id: 8, type: "positive", title: "限量公仔暴漲", desc: "收藏品市場瘋狂，泡泡瑪特聯名款一隻難求！", icon: "🎪", effect: { type: "category_boost", category: "collectible", multiplier: 2.5 } },
  { id: 9, type: "positive", title: "台積電法說利多", desc: "台積電營收超乎預期，相關股票狂飆！", icon: "💹", effect: { type: "category_boost", category: "stock", multiplier: 2.0 } },
  { id: 10, type: "positive", title: "健康食品補助", desc: "政府推動全民健康計畫，你獲得免費健檢！", icon: "🏥", effect: { type: "health_change", value: 15 } },

  // 利空事件
  { id: 11, type: "negative", title: "全台大斷電", desc: "電網崩潰，電子產品損壞，科技商品庫存損失 20%！", icon: "⚡", effect: { type: "category_damage", category: "tech", ratio: 0.2 } },
  { id: 12, type: "negative", title: "通膨爆炸", desc: "物價飛漲，本回合生活費加倍！", icon: "📉", effect: { type: "cash_change", value: -200000 } },
  { id: 13, type: "negative", title: "網路詐騙猖獗", desc: "不小心點了釣魚連結，損失一筆錢！", icon: "🎣", effect: { type: "cash_change", value: -100000 } },
  { id: 14, type: "negative", title: "地震災情", desc: "台灣東部強震，房產維修費用大增！", icon: "🌊", effect: { type: "cash_change", value: -300000 } },
  { id: 15, type: "negative", title: "加密貨幣崩盤", desc: "穩定幣爆雷，加密市場全面潰敗！", icon: "💥", effect: { type: "category_crash", category: "crypto", multiplier: 0.3 } },
  { id: 16, type: "negative", title: "食安風暴", desc: "知名連鎖店爆出食安問題，飲食類商品暴跌！", icon: "🤢", effect: { type: "category_crash", category: "food", multiplier: 0.4 } },
  { id: 17, type: "negative", title: "過勞警報", desc: "連續加班，健康嚴重下降！", icon: "😵", effect: { type: "health_change", value: -20 } },
  { id: 18, type: "negative", title: "被爆黑歷史", desc: "社群媒體瘋傳你的黑歷史，名聲大跌！", icon: "😱", effect: { type: "rep_change", value: -15 } },
  { id: 19, type: "negative", title: "政策打房", desc: "囤房稅加重，房產維護成本上升！", icon: "🏚️", effect: { type: "cash_change", value: -500000 } },
  { id: 20, type: "negative", title: "颱風來襲", desc: "超級颱風肆虐，倉庫部分貨物受損！", icon: "🌀", effect: { type: "random_damage", ratio: 0.15 } },

  // 特殊事件
  { id: 21, type: "special", title: "神秘商人出現", desc: "一位神秘商人提議以半價出售 AI 伺服器，要買嗎？", icon: "🎭", effect: { type: "special_deal", goodId: 3, discount: 0.5 } },
  { id: 22, type: "special", title: "時空旅人的預言", desc: "有人聲稱來自未來：「明年碳權會漲 5 倍！」信不信由你。", icon: "🔮", effect: { type: "hint", category: "green" } },
];

// ===== 成就列表 =====
const ACHIEVEMENTS = [
  { id: 1, name: "初入社會", desc: "完成第一回合", icon: "🎓", check: (s) => s.turn > 1 },
  { id: 2, name: "第一桶金", desc: "現金超過 500 萬", icon: "💰", check: (s) => s.cash >= 5000000 },
  { id: 3, name: "百萬富翁", desc: "總資產超過 1000 萬", icon: "🤑", check: (s) => calcNetWorth(s) >= 10000000 },
  { id: 4, name: "房產新貴", desc: "購買第一棟房產", icon: "🏠", check: (s) => s.properties.length > 0 },
  { id: 5, name: "社交達人", desc: "結交 3 位朋友", icon: "🤝", check: (s) => s.friends.length >= 3 },
  { id: 6, name: "炒股高手", desc: "單筆交易獲利超過 100 萬", icon: "📊", check: (s) => s.maxProfit >= 1000000 },
  { id: 7, name: "健康寶寶", desc: "健康度維持 90 以上超過 10 回合", icon: "💪", check: (s) => s.healthyTurns >= 10 },
  { id: 8, name: "名聲遠播", desc: "名聲超過 100", icon: "⭐", check: (s) => s.reputation >= 100 },
  { id: 9, name: "億萬霸總", desc: "達成 10 億目標", icon: "👑", check: (s) => calcNetWorth(s) >= 1000000000 },
  { id: 10, name: "倉庫大亨", desc: "倉庫擴展到 30 格", icon: "📦", check: (s) => s.warehouseCapacity >= 30 },
  { id: 11, name: "收藏家", desc: "同時持有 5 種以上不同商品", icon: "🗃️", check: (s) => Object.keys(s.inventory).filter(k => s.inventory[k] > 0).length >= 5 },
  { id: 12, name: "風險投資人", desc: "在加密類商品上獲利超過 500 萬", icon: "🪙", check: (s) => s.cryptoProfit >= 5000000 },
];

// ===== 人生等級 =====
const LIFE_RANKS = [
  { min: 0, title: "韭菜", icon: "🥬", desc: "被市場收割了...再接再厲！" },
  { min: 5000000, title: "打工仔", icon: "👷", desc: "至少沒有負債，算你厲害。" },
  { min: 20000000, title: "小資族", icon: "👔", desc: "穩健理財，小有成就。" },
  { min: 100000000, title: "新創 CEO", icon: "💼", desc: "創業成功，登上財經版面！" },
  { min: 500000000, title: "商業大亨", icon: "🎩", desc: "產業龍頭，呼風喚雨！" },
  { min: 1000000000, title: "霸總", icon: "👑", desc: "傳說中的霸道總裁降臨！" },
  { min: 5000000000, title: "神級投資人", icon: "🌟", desc: "超神！你是台灣巴菲特！" },
];

// ===== 生活費基準 =====
const BASE_LIVING_COST = 50000; // 每回合基本生活費（降低難度）
