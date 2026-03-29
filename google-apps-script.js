// =====================================================
// 霸總養成計畫 - Google Apps Script 設定說明
// =====================================================
// 你的 Google Sheet 已有多遊戲排行榜 API，只需新增一行即可！
//
// 步驟：
// 1. 開啟 Google Sheet: https://docs.google.com/spreadsheets/d/1pgt8yq8i5o1SpUFZnVO43rztflDobNrv653_FL_m7DI/edit
// 2. 點選「擴充功能」→「Apps Script」
// 3. 在程式碼最上方的 GAME_SHEETS 物件中，加入以下一行：
//
//    bosstycoon: { scores: 'Leaderboard' },
//
//    加入後 GAME_SHEETS 應該長這樣：
//
//    const GAME_SHEETS = {
//      rhythm: { scores: 'Rhythm', config: 'Rhythm_Config' },
//      pacman: { scores: 'PacMan', config: 'PacMan_Config' },
//      dicechef: { scores: 'DiceChef' },
//      bosstycoon: { scores: 'Leaderboard' },   // ← 新增這行
//    };
//
// 4. 點選「部署」→「管理部署作業」
// 5. 點擊鉛筆圖示（編輯）
// 6. 版本選擇「新版本」
// 7. 點選「部署」
// 8. 複製部署的網址，貼到 leaderboard.js 的 GOOGLE_SHEET_API_URL
//
// =====================================================
// API 格式說明（已由現有 Apps Script 處理）：
//
// GET  ?action=getScores&game=bosstycoon
//   → 回傳 { scores: [{ name, score: {...}, timestamp }, ...] }
//
// POST { action:'addScore', game:'bosstycoon', name:'玩家名', score: {
//          netWorth: 50000000,
//          rank: '科技新貴',
//          rankIcon: '💻',
//          turns: 40,
//          age: 60,
//          achievements: 8,
//          reputation: 150,
//          timestamp: 1711700000000
//        }}
//   → 回傳 { success: true }
// =====================================================
