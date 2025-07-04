# OIC2025-Front05
# **JavaScript学習教材：郵便番号検索プログラムを作ろう！**

## **1\. はじめに \- Web開発者への第一歩**

こんにちは！この教材へようこそ。  
ここでは、Webページの裏側で動くプログラム「JavaScript」を使って、便利なWebアプリケーションをゼロから作成していきます。ただコードを書き写すだけでなく、「なぜこう書くのか？」「どうすれば実現できるのか？」を一緒に考えながら、Web開発の楽しさと奥深さを体験していきましょう。

## **2\. 今回作るもの：住所検索アプリケーション**

【ゴール】  
郵便番号を入力して「検索」ボタンを押すと、対応する住所（都道府県、市区町村など）が自動で入力されるアプリケーションを完成させます。  
【完成イメージ】  
\[画像：郵便番号を入力して検索ボタンを押すと、都道府県、市区町村、住所が自動で入力されている画面\]

## **3\. この授業の学習ポイント**

この開発体験を通して、以下の重要なスキルを身につけることができます。

* **DOM操作**: JavaScriptでHTMLの見た目を自由に操る方法。  
* **イベント処理**: ユーザーのクリックなどのアクションをきっかけにプログラムを動かす方法。  
* **非同期処理 (async/await)**: 時間のかかる処理をスムーズに行うための現代的なテクニック。  
* **API連携**: 外部のサービスと通信して、その機能やデータを自分のアプリで利用する方法。  
* **エラーハンドリング**: 予期せぬ問題が起きても、プログラムが止まらないようにする「守り」のコーディング。

## **4\. 開発の準備をしよう**

まず、開発に必要な以下の3つのファイルを、PC上の同じフォルダに作成してください。

1. index.html (Webページの骨格)  
2. style.css (Webページの見た目)  
3. app.js (プログラムを記述するファイル。今は空でOK)

### **index.html**

**ポイント:** app.js を読み込む \<script\> タグを \<body\> の一番下に配置します。これにより、HTMLの解析が終わってからJavaScriptが実行されるため、安全にHTML要素を操作できます。

\<\!DOCTYPE html\>  
\<html lang="ja"\>  
\<head\>  
  \<meta charset="UTF-8"\>  
  \<title\>郵便番号検索\</title\>  
  \<link rel="stylesheet" href="style.css"\>  
\</head\>  
\<body\>  
  \<h3\>住所検索\</h3\>  
  \<div\>  
    \<p\>  
      \<label for="zipcode"\>郵便番号\</label\>  
      \<input id="zipcode" type="text" size="10" maxlength="8" placeholder="例: 1000001"\>  
      \<button id="btn"\>検索\</button\>  
    \</p\>  
    \<p\>\<label for="prefecture"\>都道府県\</label\> \<input id="prefecture" type="text" size="10" readonly\>\</p\>  
    \<p\>\<label for="city"\>市区町村\</label\> \<input id="city" type="text" size="25" readonly\>\</p\>  
    \<p\>\<label for="address"\>住所\</label\>\<input id="address" type="text" size="35" readonly\>\</p\>  
  \</div\>

  \<script src="app.js"\>\</script\>  
\</body\>  
\</html\>

### **style.css**

（今回は特にスタイルの指定はありませんが、ファイルは作成しておきましょう）

/\* このファイルは空のままでOKです \*/  
body {  
    font-family: sans-serif;  
    margin: 2em;  
}

label {  
    display: inline-block;  
    width: 80px;  
}

input {  
    padding: 4px;  
    border-radius: 4px;  
    border: 1px solid \#ccc;  
}

button {  
    padding: 5px 10px;  
    border-radius: 4px;  
    border: 1px solid \#007bff;  
    background-color: \#007bff;  
    color: white;  
    cursor: pointer;  
}

button:hover {  
    background-color: \#0056b3;  
}

## **5\. JavaScriptを実装しよう！**

ここからが本番です！ app.js に以下の完成版コードを記述していきましょう。コードはいくつかのステップに分かれていますが、最終的には以下の形になります。

### **app.js (完成版)**

// \--- HTML要素の取得 \---  
// HTMLから操作したい要素をIDを使って取得し、定数に保存します。  
const searchBtn \= document.getElementById('btn');  
const zipcodeEl \= document.getElementById('zipcode');  
const prefectureEl \= document.getElementById('prefecture');  
const cityEl \= document.getElementById('city');  
const addressEl \= document.getElementById('address');

// \--- 関数定義 \---  
// 取得したデータを画面の入力欄にセットするための関数です。  
function setData(data) {  
  prefectureEl.value \= data.address1 || ''; // 都道府県  
  cityEl.value \= data.address2 || '';       // 市区町村  
  addressEl.value \= data.address3 || '';      // 町域名  
}

// \--- イベントリスナーの設定 \---  
// 「検索」ボタンがクリックされた時の処理を登録します。  
// asyncキーワードは、この関数が非同期処理を含むことを示します。  
searchBtn.addEventListener('click', async () \=\> {  
  // 入力された郵便番号を取得します。  
  const zipcode \= zipcodeEl.value;  
  // 郵便番号が空の場合は、アラートを表示して処理を中断します。  
  if (\!zipcode) {  
    alert('郵便番号を入力してください。');  
    return;  
  }

  // 実際にデータを取得したいAPIのURL  
  const targetApiUrl \= \`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}\`;  
    
  // CORSエラーを回避するため、プロキシサーバーを介してAPIにアクセスします。  
  // 注意: このプロキシは誰でも使えるものですが、本番環境での利用は推奨されません。  
  const proxyUrl \= 'https://api.allorigins.win/raw?url=';  
  const fetchUrl \= proxyUrl \+ encodeURIComponent(targetApiUrl);

  // try...catch構文で、通信中のエラーに対応します。  
  try {  
    // fetchでAPIにリクエストを送信し、awaitでレスポンスが返ってくるのを待ちます。  
    const response \= await fetch(fetchUrl);

    // サーバーからの応答自体がエラーだった場合（例: 404 Not Found, 500 Server Error）  
    if (\!response.ok) {  
      // エラーオブジェクトを生成してcatchブロックに処理を移します。  
      throw new Error(\`サーバーからの応答が正常ではありません: ${response.status}\`);  
    }

    // レスポンスの中身をJSON形式として解釈するのを待ちます。  
    const data \= await response.json();

    // APIが返すステータスコードで、データが見つかったか判断します。  
    // statusが400、またはresultsがnullの場合は、該当する住所が見つからなかったことを意味します。  
    if (data.status \=== 400 || data.results \=== null) {  
      alert(data.message || '該当する住所が見つかりませんでした。');  
      // 以前の検索結果が残っている可能性があるので、入力欄をクリアします。  
      setData({ address1: '', address2: '', address3: '' });  
    } else {  
      // 住所が見つかった場合は、setData関数を呼び出して画面に表示します。  
      // resultsは配列で返ってくるので、最初の要素を使います。  
      setData(data.results\[0\]);  
    }

  } catch (error) {  
    // 通信失敗時や、その他のエラーが発生した場合の処理です。  
    console.error('通信中にエラーが発生しました:', error);  
    alert('通信に失敗しました。ネットワーク環境を確認するか、時間をおいて再度お試しください。');  
  }  
});

これで、HTML、CSS、JavaScriptの3つのファイルが揃い、郵便番号検索アプリケーションが動作するはずです。index.htmlをブラウザで開いて試してみてください。
