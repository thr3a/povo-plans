nodejsを利用して以下の要件をすべて満たす fetch-plans.ts を作成してください

- nodejs v20
- axios Cheerioを使う
- https://povo.jp/spec/ を取得し、htmlのDOMをパース
- topping-tableクラスの全部のテーブルを取得
- 各列は左からデータ容量（利用可能期間）、料金/回

例のhtmlを以下に示す

```html
<table class="topping-table col3"><thead><tr><th>データ容量<br class="d-md-none" />（利用可能期間）</th><th>料金/回</th><th>販売終了日</th></tr></thead><tbody><tr><th>1GB（365日間）</th><td>1,200円</td><td>～5/31</td></tr><tr><th>30GB（30日間）</th><td>3,260円</td><td>～5/23</td></tr><tr><th>30GB（180日間）</th><td>5,580円</td><td>～5/31</td></tr><tr><th>12GB（365日間）</th><td>5,800円</td><td>～5/22</td></tr><tr><th>132GB（365日間）</th><td>20,760円</td><td>～5/31</td></tr><tr><th>365GB（365日間）</th><td>29,800円</td><td>～5/20</td></tr></tbody></table>
```

- 容量と料金をセットにして配列にしていく
  - capacityはデータ容量 GB数
  - データ容量に「使い放題」の文字列が含まれていたら-1にする
  - timeは利用可能期間 hourで計算すること
  - priceは料金 円
- json形式でplans.jsonとして保存する

```json
{
  "data": [
    {
      "capacity": -1,
      "time": 24,
      "price": 330
    },
    {
      "capacity": 1,
      "time": 168,
      "price": 390
    },
    {
      "capacity": 3,
      "time": 720,
      "price": 990
    }
    // 以下続く......
  ]
}
```


```ts
import fs from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';

interface Plan {
  capacity: string | number;
  time: number;
  price: number;
}

interface Plans {
  data: Plan[];
}

const url = 'https://povo.jp/spec/';
