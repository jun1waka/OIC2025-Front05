/**
 * このスクリプトはHTMLの<body>の末尾で読み込まれるため、
 * 実行される時点では既にHTML要素（DOM）の準備が完了しています。
 * そのため、'DOMContentLoaded'イベントを待つ必要はありません。
 */

// --- Step 1: 画面の部品（HTML要素）をプログラムから操作できるように準備する ---
// IDを使ってHTML要素を取得し、後で使いやすいように定数に格納しておきます。
const searchBtn = document.getElementById('btn');           // 検索ボタン
const zipcodeEl = document.getElementById('zipcode');       // 郵便番号の入力欄
const prefectureEl = document.getElementById('prefecture'); // 都道府県の表示欄
const cityEl = document.getElementById('city');             // 市区町村の表示欄
const addressEl = document.getElementById('address');       // 住所の表示欄

/**
 * APIから取得した住所データを画面の入力フィールドに設定するための関数です。
 * @param {object} data - APIから返された住所データオブジェクト
 */
function setData(data) {
  prefectureEl.value = data.address1 || ''; // 都道府県
  cityEl.value = data.address2 || '';       // 市区町村
  addressEl.value = data.address3 || '';    // 町域名
}

// --- Step 2: 「検索」ボタンがクリックされたときの処理を定義する ---
// addEventListenerで、ボタンがクリックされたときに実行する関数を登録します。
// API通信という非同期処理を行うため、関数を `async` として定義します。
searchBtn.addEventListener('click', async () => {
  const zipcode = zipcodeEl.value; // 入力された郵便番号を取得
  if (!zipcode) {
    alert('郵便番号を入力してください。');
    return; // 郵便番号が空なら処理を中断
  }

  // --- Step 3: APIと通信して住所を取得する (非同期処理) ---
  // 実際にデータを取得したいAPIのURL
  const targetApiUrl = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`;

  // CORSエラーを回避するためのプロキシサーバーのURL
  // 注意: このプロキシは教育・開発目的での利用を想定しています。
  //       本番環境で利用する場合は、自身でプロキシサーバーを運用することを強く推奨します。
  const proxyUrl = 'https://api.allorigins.win/raw?url=';
  const fetchUrl = proxyUrl + encodeURIComponent(targetApiUrl);

  // --- Step 4: データを画面に表示し、エラーに対応する ---
  // `try...catch` を使って、通信中やデータ処理中のエラーに備えます。
  try {
    // `fetch`でAPIにリクエストを送信し、`await`でレスポンスが返ってくるのを待ちます。
    const response = await fetch(fetchUrl);

    // レスポンスが正常（HTTPステータスが200番台）でなければエラーを発生させます。
    if (!response.ok) {
      throw new Error(`サーバーからの応答が正常ではありません: ${response.status}`);
    }

    // レスポンスの中身をJSON形式として解釈します。これも非同期処理なので`await`を使います。
    const data = await response.json();

    // APIが返すステータスコードをチェックします。
    if (data.status === 400 || data.results === null) {
      // 郵便番号が見つからなかった場合など
      alert(data.message || '該当するデータが見つかりませんでした');
    } else {
      // 正常に取得できた場合、setData関数で画面に住所を表示します。
      setData(data.results[0]);
    }
  } catch (error) {
    // `fetch`での通信失敗や、`try`ブロック内で発生したエラーはここで捕捉されます。
    console.error('データ取得中にエラーが発生しました:', error);
    alert('データの取得に失敗しました。通信環境を確認してください。');
  }
});
