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
  { id: 6, name: "仁愛帝寶", icon: "🏰", price: 650000000, rent: 500000, repBonus: 80, unlockAge: 35, description: "台北頂級豪宅，身份地位的象徵" },
  { id: 7, name: "陶朱隱園", icon: "🌿", price: 1110000000, rent: 0, repBonus: 100, unlockAge: 40, description: "旋轉綠建築，無租金但名聲頂天" },
];

// ===== NPC 社交角色 =====
const NPCS = [
  { id: 1, name: "小安｜AI 工程師", icon: "👨‍💻", bonus: { type: "tech_discount", value: 0.15 }, description: "購買科技類商品打 85 折", unlockAge: 22, flavor: "「模型又爆了，不過我幫你算了一下，這批貨划算。」" },
  { id: 2, name: "Mia｜脆紅 Influencer", icon: "📱", bonus: { type: "rep_per_turn", value: 5 }, description: "每回合名聲 +5", unlockAge: 24, flavor: "「我幫你發一篇，流量包在我身上！」" },
  { id: 3, name: "陳董｜房產大亨", icon: "🤵", bonus: { type: "rent_boost", value: 0.3 }, description: "所有房產收租 +30%", unlockAge: 30, flavor: "「地段、地段、還是地段。」" },
  { id: 4, name: "小花｜有機農場主", icon: "🌻", bonus: { type: "health_per_turn", value: 3 }, description: "每回合健康 +3", unlockAge: 23, flavor: "「身體是革命的本錢，來喝碗雞湯。」" },
  { id: 5, name: "Kevin｜加密貨幣 OG", icon: "🪙", bonus: { type: "crypto_boost", value: 0.5 }, description: "加密類商品漲幅額外 +50%", unlockAge: 26, flavor: "「HODL！這次一定是牛市！」" },
  { id: 6, name: "林律師｜法律顧問", icon: "⚖️", bonus: { type: "event_shield", value: 0.3 }, description: "30% 機率抵擋負面事件", unlockAge: 28, flavor: "「放心，這案子我罩的。」" },
  { id: 7, name: "Lina｜AI 開發者", icon: "👩‍💻", avatar: "image_3.jpg", bonus: { type: "forecast_boost", value: 0.6 }, description: "預報命中率提升至 60%，科技類再折 10%", unlockAge: 25, flavor: "「數據不會說謊，下一波行情我已經算出來了。」" },
  { id: 8, name: "阿豪｜外匯操盤手", icon: "💱", bonus: { type: "sell_bonus", value: 0.1 }, description: "所有商品賣出價格 +10%", unlockAge: 30, flavor: "「匯差、價差，都是我的獲利空間。」" },
];

// ===== 隨機事件庫 =====
// forecast: 事件發生前一年的新聞預告（讓玩家可以預判）
const EVENTS = [
  // 利好事件
  { id: 1, type: "positive", title: "黃老師來台演講", desc: "AI 教父黃仁勳再度訪台，科技相關商品暴漲！", icon: "🤖", effect: { type: "category_boost", category: "tech", multiplier: 3.0 },
    forecast: "📡 消息：NVIDIA 執行長行程曝光，據傳下半年將訪台參加 COMPUTEX..." },
  { id: 2, type: "positive", title: "脆友集體肉搜成功", desc: "Threads 上的正義鄉民出動，你的名聲大漲！", icon: "🔍", effect: { type: "rep_change", value: 20 },
    forecast: "📱 Threads 上出現一則關於你的正面討論串，流量正在發酵中..." },
  { id: 3, type: "positive", title: "碳中和政策加碼", desc: "政府宣布碳權補貼計畫，綠能商品大漲！", icon: "🌿", effect: { type: "category_boost", category: "green", multiplier: 2.5 },
    forecast: "🏛️ 立法院審議中：行政院提出新版碳費徵收草案，綠能產業密切關注..." },
  { id: 4, type: "positive", title: "觀光客爆量湧入", desc: "日圓持續貶值，日本觀光客擠爆台灣！飲食類大賣！", icon: "✈️", effect: { type: "category_boost", category: "food", multiplier: 2.0 },
    forecast: "✈️ 日圓匯率再探新低，旅遊業者預估來台觀光人數將創新高..." },
  { id: 5, type: "positive", title: "比特幣創新高", desc: "幣圈再度狂歡，加密相關商品飆漲！", icon: "🚀", effect: { type: "category_boost", category: "crypto", multiplier: 3.5 },
    forecast: "🪙 華爾街大行紛紛上調比特幣目標價，機構資金持續湧入加密市場..." },
  { id: 6, type: "positive", title: "房市回春", desc: "央行降息，房地產市場火熱！所有房產增值 20%！", icon: "🏠", effect: { type: "property_boost", multiplier: 1.2 },
    forecast: "🏦 央行暗示將調降利率，市場預期房貸壓力將大幅減輕..." },
  { id: 7, type: "positive", title: "意外中發票", desc: "統一發票對中特獎，獲得一筆意外之財！", icon: "🎰", effect: { type: "cash_change", value: 500000 },
    forecast: null },
  { id: 8, type: "positive", title: "限量公仔暴漲", desc: "收藏品市場瘋狂，泡泡瑪特聯名款一隻難求！", icon: "🎪", effect: { type: "category_boost", category: "collectible", multiplier: 2.5 },
    forecast: "🧸 泡泡瑪特宣布與頂級 IP 聯名企劃，收藏圈已經在搶預購名額..." },
  { id: 9, type: "positive", title: "台積電法說利多", desc: "台積電營收超乎預期，相關股票狂飆！", icon: "💹", effect: { type: "category_boost", category: "stock", multiplier: 2.0 },
    forecast: "📊 外資報告：台積電下季營收有望超越市場預期，上調目標價..." },
  { id: 10, type: "positive", title: "健康食品補助", desc: "政府推動全民健康計畫，你獲得免費健檢！", icon: "🏥", effect: { type: "health_change", value: 15 },
    forecast: "🏥 衛福部預告：將推出全民免費健檢方案..." },

  // 利空事件
  { id: 11, type: "negative", title: "全台大斷電", desc: "電網崩潰，電子產品損壞，科技庫存損失 20%，科技商品價格暴跌！", icon: "⚡",
    effect: { type: "category_damage", category: "tech", ratio: 0.2 },
    secondaryEffect: { type: "category_crash", category: "tech", multiplier: 0.4 },
    forecast: "⚠️ 台電預警：夏季用電量逼近紅線，電網負載已達 95%..." },
  { id: 12, type: "negative", title: "通膨爆炸", desc: "物價飛漲，本回合生活費加倍！", icon: "📉", effect: { type: "cash_change", value: -200000 },
    forecast: "📉 主計處數據：CPI 年增率連續三月上升，物價壓力升溫中..." },
  { id: 13, type: "negative", title: "網路詐騙猖獗", desc: "不小心點了釣魚連結，損失一筆錢！", icon: "🎣", effect: { type: "cash_change", value: -100000 },
    forecast: "🔒 刑事局提醒：近期釣魚簡訊詐騙案件暴增，民眾需提高警覺..." },
  { id: 14, type: "negative", title: "地震災情", desc: "台灣東部強震，房產維修費用大增！", icon: "🌊", effect: { type: "cash_change", value: -300000 },
    forecast: "🌋 氣象署監測：花東地區近期地震頻率異常升高，學者呼籲防範..." },
  { id: 15, type: "negative", title: "加密貨幣崩盤", desc: "穩定幣爆雷，加密市場全面潰敗！", icon: "💥", effect: { type: "category_crash", category: "crypto", multiplier: 0.3 },
    forecast: "💣 鏈上數據異常：某知名穩定幣儲備遭質疑，恐慌情緒蔓延中..." },
  { id: 16, type: "negative", title: "食安風暴", desc: "知名連鎖店爆出食安問題，飲食類商品暴跌！", icon: "🤢", effect: { type: "category_crash", category: "food", multiplier: 0.4 },
    forecast: "🔬 衛生單位抽檢：多家知名餐飲品牌原料來源遭調查中..." },
  { id: 17, type: "negative", title: "過勞警報", desc: "連續加班，健康嚴重下降！", icon: "😵", effect: { type: "health_change", value: -20 },
    forecast: "😰 勞動部統計：今年加班工時創十年新高，過勞案例頻傳..." },
  { id: 18, type: "negative", title: "被爆黑歷史", desc: "社群媒體瘋傳你的黑歷史，名聲大跌！", icon: "😱", effect: { type: "rep_change", value: -15 },
    forecast: null },
  { id: 19, type: "negative", title: "政策打房", desc: "囤房稅加重，房產維護成本上升！", icon: "🏚️", effect: { type: "cash_change", value: -500000 },
    forecast: "🏛️ 財政委員會討論：囤房稅率是否應再提高，各方意見分歧..." },
  { id: 20, type: "negative", title: "颱風來襲", desc: "超級颱風肆虐，倉庫部分貨物受損！食品類需求飆升，價格上漲！", icon: "🌀",
    effect: { type: "random_damage", ratio: 0.15 },
    secondaryEffect: { type: "category_boost", category: "food", multiplier: 1.8 },
    forecast: "🌀 氣象署：太平洋上生成今年最強颱風，預計路徑直撲台灣本島..." },

  // 2026 台灣熱搜事件
  { id: 21, type: "positive", title: "脆上爆紅：開心果拿鐵挑戰！", desc: "全台網紅爭相模仿上車舞並點名開心果拿鐵，價格瘋狂飆升！", icon: "☕🔥",
    effect: { type: "category_boost", category: "food", multiplier: 5.0 },
    forecast: "📱 Threads 趨勢觀察：「開心果拿鐵挑戰」標籤流量暴增 2000%，各門市開始預備增量..." },
  { id: 22, type: "negative", title: "勞動力極度短缺", desc: "缺工潮蔓延至全產業，你的生活成本與營運支出翻倍！", icon: "👷‍♂️",
    effect: { type: "cost_multiplier", multiplier: 2.0 },
    forecast: "📊 勞動部警告：服務業缺工率創歷史新高，企業營運成本恐大幅攀升..." },
  { id: 23, type: "positive", title: "全球能源危機，核融合電池需求激增", desc: "各國搶購綠能設備，碳權與太陽能板價格翻倍再翻倍！", icon: "⚛️",
    effect: { type: "category_boost", category: "green", multiplier: 3.5 },
    forecast: "🌍 國際能源署報告：化石燃料價格持續攀升，綠能替代方案成各國採購焦點..." },
  { id: 24, type: "negative", title: "網紅踢爆：收藏品是仿冒品！", desc: "知名網紅拍片揭發仿冒風波，收藏品市場信心崩盤！", icon: "📹",
    effect: { type: "category_crash", category: "collectible", multiplier: 0.15 },
    forecast: "🔍 PTT 八卦板出現爆料文：某知名收藏品系列真偽遭質疑，討論串持續延燒..." },
  { id: 25, type: "positive", title: "電動車補貼加碼", desc: "政府宣布電動車購車補助翻倍，交通工具類商品大漲！", icon: "🔋",
    effect: { type: "category_boost", category: "vehicle", multiplier: 2.5 },
    forecast: "🏛️ 經濟部研議：電動車補助金額將大幅提高，車廠股價已率先反應..." },
  { id: 26, type: "negative", title: "股市黑天鵝事件", desc: "國際情勢突變，台股重挫千點！所有股票類資產大跌！", icon: "🦢",
    effect: { type: "category_crash", category: "stock", multiplier: 0.35 },
    forecast: "🌐 彭博社：地緣政治風險升溫，外資連續五日大舉撤離亞洲股市..." },

  { id: 27, type: "negative", title: "聯準會意外升息 2 碼", desc: "全球熱錢退潮，除了現金，所有商品市場價格全面下修！", icon: "🏦",
    effect: { type: "global_crash", multiplier: 0.7 },
    forecast: "📉 路透社：聯準會官員暗示通膨壓力超預期，市場憂心利率將大幅上調..." },
  { id: 28, type: "positive", title: "玉山券商手續費價格戰開打！", desc: "各大券商競爭白熱化，祭出 2.8 折超低優惠，本回合買賣摩擦成本大幅降低！", icon: "🏷️",
    effect: { type: "fee_discount", value: 0.28 },
    forecast: "💰 金管會鬆綁：券商手續費折扣下限取消，各家搶推 2.8 折優惠方案..." },

  // 特殊事件
  { id: 29, type: "special", title: "神秘商人出現", desc: "一位神秘商人提議以半價出售 AI 伺服器，要買嗎？", icon: "🎭", effect: { type: "special_deal", goodId: 3, discount: 0.5 },
    forecast: "🎭 商圈傳言：有位神秘大戶最近在出清科技庫存，價格異常低廉..." },
  { id: 30, type: "special", title: "時空旅人的預言", desc: "有人聲稱來自未來：「明年碳權會漲 5 倍！」信不信由你。", icon: "🔮", effect: { type: "hint", category: "green" },
    forecast: null },
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

// ===== 交通工具 =====
const VEHICLES = [
  { id: 1, name: "Tesla Model 3", icon: "🚗", price: 1800000, repBonus: 8, unlockAge: 24, description: "電動車入門款，環保又時尚" },
  { id: 2, name: "Mercedes-Benz S-Class", icon: "🚘", price: 6000000, repBonus: 25, unlockAge: 28, description: "德國豪華旗艦，商務首選" },
  { id: 3, name: "Tesla Model S Plaid", icon: "⚡", price: 4500000, repBonus: 18, unlockAge: 26, description: "極速電動轎跑，科技新貴標配" },
  { id: 4, name: "Porsche 911 Turbo S", icon: "🏎️", price: 12000000, repBonus: 45, unlockAge: 32, description: "經典跑車，速度與品味的象徵" },
  { id: 5, name: "Lamborghini Huracán", icon: "🏁", price: 18000000, repBonus: 65, unlockAge: 36, description: "義大利超跑，霸總必備座駕" },
  { id: 6, name: "Ferrari SF90 Stradale", icon: "🐎", price: 25000000, repBonus: 85, unlockAge: 38, description: "躍馬旗艦超跑，頂級收藏品" },
];

// ===== 商會系統（名聲門檻加成）=====
const ASSOCIATIONS = [
  { id: 1, name: "青年商會理事長", icon: "🤝", repReq: 20, yearlyBonus: 500000, sellBonus: 0, description: "結識年輕企業家，每年加成 50 萬" },
  { id: 2, name: "BNI 董事顧問", icon: "💼", repReq: 50, yearlyBonus: 1000000, sellBonus: 0, description: "國際商務引薦組織，每年加成 100 萬" },
  { id: 3, name: "獅子會地區總監", icon: "🦁", repReq: 120, yearlyBonus: 3000000, sellBonus: 0, description: "國際服務社團領袖，每年加成 300 萬" },
  { id: 4, name: "扶輪社地區總監", icon: "⚙️", repReq: 200, yearlyBonus: 5000000, sellBonus: 0, description: "國際扶輪領導者，每年加成 500 萬" },
  { id: 5, name: "商業傳奇人物", icon: "👑", repReq: 500, yearlyBonus: 10000000, sellBonus: 0.5, description: "傳奇霸總，每年 1000 萬＋賣出多 50%" },
];

// ===== 社交投資項目 =====
const INVESTMENTS = [
  { id: 1, name: "韓團 TWICE 演唱會", icon: "🎤", cost: 50000000, repBonus: 30, unlockAge: 25,
    returnChance: 0.55, returnMin: 1.5, returnMax: 4.0, failChance: 0.15, failRatio: 0.3,
    description: "投資台灣場巡演，票房爆滿就是印鈔機",
    successMsg: "🎤 TWICE 演唱會一票難求，票房收入大爆發！",
    failMsg: "😢 演唱會因故延期，損失慘重..." },
  { id: 2, name: "世界棒球經典賽國家隊", icon: "⚾", cost: 80000000, repBonus: 50, unlockAge: 28,
    returnChance: 0.45, returnMin: 2.0, returnMax: 5.0, failChance: 0.2, failRatio: 0.4,
    description: "贊助中華隊，打進四強就名利雙收",
    successMsg: "⚾ 中華隊晉級四強！贊助商曝光率爆表，回報驚人！",
    failMsg: "😞 中華隊止步預賽，贊助效益不如預期..." },
  { id: 3, name: "Netflix 直播：攀登台北 101", icon: "🗼", cost: 120000000, repBonus: 40, unlockAge: 30,
    returnChance: 0.50, returnMin: 1.8, returnMax: 6.0, failChance: 0.10, failRatio: 0.25,
    description: "全球直播極限挑戰，爆紅全世界",
    successMsg: "🗼 Netflix 節目全球爆紅，訂閱分潤源源不絕！",
    failMsg: "📉 節目收視平平，投資回收緩慢..." },
  { id: 4, name: "台灣電競戰隊世界賽", icon: "🎮", cost: 30000000, repBonus: 20, unlockAge: 22,
    returnChance: 0.50, returnMin: 1.5, returnMax: 3.5, failChance: 0.20, failRatio: 0.35,
    description: "贊助電競戰隊出征世界賽，年輕人的流量密碼",
    successMsg: "🎮 戰隊奪冠！品牌曝光全球，贊助回報翻倍！",
    failMsg: "💔 戰隊小組賽出局，贊助費打水漂..." },
  { id: 5, name: "媽祖遶境 NFT 聯名", icon: "🏮", cost: 20000000, repBonus: 15, unlockAge: 24,
    returnChance: 0.60, returnMin: 1.3, returnMax: 3.0, failChance: 0.10, failRatio: 0.2,
    description: "傳統文化 x 數位潮流，信仰經濟新商機",
    successMsg: "🏮 媽祖 NFT 秒殺完售，文化 IP 授權金持續進帳！",
    failMsg: "😅 NFT 市場低迷，銷售不如預期..." },
];

// ===== 生活費基準 =====
const BASE_LIVING_COST = 50000; // 每回合基本生活費（降低難度）
