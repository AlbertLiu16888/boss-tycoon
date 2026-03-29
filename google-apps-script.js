// =====================================================
// Google Apps Script - 霸總養成計畫排行榜 API
// =====================================================
// 部署步驟：
// 1. 建立一個 Google Sheet，在第一個工作表命名為「Leaderboard」
// 2. 在第一行（A1:I1）填入表頭：
//    name | netWorth | rank | rankIcon | turns | age | achievements | reputation | timestamp
// 3. 在 Google Sheet 中點選「擴充功能」→「Apps Script」
// 4. 刪除預設程式碼，貼上本檔案的所有程式碼
// 5. 點選「部署」→「新增部署作業」
// 6. 選擇類型：「網頁應用程式」
// 7. 執行身分：選「我」
// 8. 誰可以存取：選「所有人」
// 9. 點選「部署」，複製產生的網址
// 10. 將網址貼到 leaderboard.js 的 GOOGLE_SHEET_API_URL 常數中
// =====================================================

const SHEET_NAME = 'Leaderboard';

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet || sheet.getLastRow() <= 1) {
      return jsonResponse({ leaderboard: [] });
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const entries = [];

    for (let i = 1; i < data.length; i++) {
      const row = {};
      headers.forEach((h, j) => {
        row[h] = data[i][j];
      });
      // Ensure netWorth is a number
      row.netWorth = Number(row.netWorth) || 0;
      row.turns = Number(row.turns) || 0;
      row.age = Number(row.age) || 0;
      row.achievements = Number(row.achievements) || 0;
      row.reputation = Number(row.reputation) || 0;
      row.timestamp = Number(row.timestamp) || 0;
      entries.push(row);
    }

    // Sort by netWorth descending, return top 10
    entries.sort((a, b) => b.netWorth - a.netWorth);
    const top10 = entries.slice(0, 10);

    return jsonResponse({ leaderboard: top10 });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return jsonResponse({ error: 'Sheet not found' });
    }

    const data = JSON.parse(e.postData.contents);

    // Ensure headers exist
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['name', 'netWorth', 'rank', 'rankIcon', 'turns', 'age', 'achievements', 'reputation', 'timestamp']);
    }

    // Append the score
    sheet.appendRow([
      String(data.name || '匿名').slice(0, 12),
      Number(data.netWorth) || 0,
      String(data.rank || ''),
      String(data.rankIcon || ''),
      Number(data.turns) || 0,
      Number(data.age) || 0,
      Number(data.achievements) || 0,
      Number(data.reputation) || 0,
      Number(data.timestamp) || Date.now()
    ]);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
