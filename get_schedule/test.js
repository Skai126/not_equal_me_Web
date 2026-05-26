const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const targetMonths = [];
const startDate = new Date(2019, 1, 1); // 2019年2月
const today = new Date();
const endDate = new Date(today.getFullYear(), today.getMonth() + 3, 1);

let currentDate = new Date(startDate);
while (currentDate <= endDate) {
  targetMonths.push({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  });
  currentDate.setMonth(currentDate.getMonth() + 1);
}
console.log(
  `📅 取得する月: 2019年2月 から 全 ${targetMonths.length} ヶ月分を取得します！`,
);

async function scrapeNoimeSchedule() {
  try {
    const events = [];

    for (const target of targetMonths) {
      const url = `https://not-equal-me.jp/schedule/calender/${target.year}/${target.month}/`;
      console.log(`📡 ${target.year}年${target.month}月の情報を取得中...`);

      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const year =
        $(".calendarHeader .year").text().trim() || target.year.toString();
      let monthStr = $(".calendarHeader .month").text().trim();
      if (!monthStr) {
        monthStr = target.month.toString().padStart(2, "0");
      }

      $(".cell").each((index, cell) => {
        const dateElem = $(cell).find(".date");
        if (!dateElem.length) return;
        const date = dateElem.text().trim();
        if (!date) return;

        $(cell)
          .find(".tit")
          .each((i, titElement) => {
            const title = $(titElement).text().trim();
            const category =
              $(titElement).siblings(".cat").text().trim() || "情報なし";

            // ★第3の魔法：タイトルを囲んでいる <a> タグを探してURL（href）を取得する！
            const link = $(titElement).closest("a").attr("href");

            // サイトのURLが「/schedule/detail/...」のように省略されているので、頭に https://... をくっつける
            const fullUrl = link
              ? link.startsWith("http")
                ? link
                : "https://not-equal-me.jp" + link
              : "";

            const paddedDate = date.padStart(2, "0");
            const fullDate = `${year}/${monthStr}/${paddedDate}`;
            const yearMonth = `${year}/${monthStr}`;

            events.push({
              yearMonth: yearMonth,
              date: fullDate,
              category: category,
              title: title,
              url: fullUrl, // ★ 抜き出したURLをデータに含める！
            });
          });
      });

      // サーバーに優しく1秒待機
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    fs.writeFileSync("data.json", JSON.stringify(events, null, 2), "utf-8");
    console.log(
      `✅ 大成功！ 合計 ${events.length} 件のイベントを data.json に保存しました！`,
    );
    // ★★★ ここから下が追加するコード ★★★
    const icsEvents = events.map((event) => {
      // "2026/05/04" を [2026, 5, 4] という数字のリストに変換する
      const [year, month, day] = event.date.split("/").map(Number);

      return {
        title: `[${event.category}] ${event.title}`,
        start: [year, month, day],
        duration: { days: 1 }, // 時間が不明な予定が多いので「終日イベント」にする
        url: event.url,
        description: `公式サイトで確認: ${event.url}`,
      };
    });

    // icsファイルを作成
    const { error, value } = ics.createEvents(icsEvents);
    if (error) {
      console.error("❌ カレンダーファイルの作成に失敗しました:", error);
    } else {
      // schedule.ics という名前で保存！
      fs.writeFileSync("schedule.ics", value, "utf-8");
      console.log(`📅 Googleカレンダー用の「schedule.ics」も作成しました！`);
    }
  } catch (error) {
    console.error("❌ エラーが発生しました:", error.message);
  }
}

scrapeNoimeSchedule();
