import fs from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';

interface Plan {
  capacity: number;
  time: number;
  price: number;
}

interface Plans {
  data: Plan[];
}

const url = 'https://povo.jp/spec/';

const fetchPlans = async () => {
  try {
    // ページのHTMLを取得
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const plans: Plan[] = [];

    // topping-tableクラスのテーブルを取得
    $('.topping-table').each((i, table) => {
      $(table)
        .find('tbody tr')
        .each((j, row) => {
          const columns = $(row).find('th, td');

          // データ容量と利用可能期間を抽出
          const capacityText = $(columns[0]).text().trim();

          const priceText = $(columns[1]).text().trim();

          // データ容量を数値に変換
          let capacity: number;
          if (capacityText.includes('使い放題')) {
            capacity = -1;
          } else {
            const capacityMatch = capacityText.match(/(\d+)GB/);
            capacity = capacityMatch ? parseInt(capacityMatch[1], 10) : 0;
          }

          // 利用可能期間を時間に変換
          const periodMatch = capacityText.match(/（(\d+)日間）/);
          const days = periodMatch ? parseInt(periodMatch[1], 10) : 0;
          const time = days * 24;

          // 料金を数値に変換
          const priceMatch = priceText.replace(',', '').match(/(\d+)円/);
          console.log(priceMatch);

          const price = priceMatch ? parseInt(priceMatch[1], 10) : 0;

          plans.push({ capacity, time, price });
        });
    });

    // JSON形式でplans.jsonとして保存
    const plansData: Plans = { data: plans };
    fs.writeFileSync('public/plans.json', JSON.stringify(plansData, null, 2), 'utf-8');

    console.log('Plans data has been saved to plans.json');
  } catch (error) {
    console.error('Error fetching plans:', error);
  }
};

fetchPlans();
