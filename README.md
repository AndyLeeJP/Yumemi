# 各都道府県の人口構成のグラフ化(YUMEMI フロントエンドコーディング試験)

https://notion.yumemi.co.jp/0e9ef27b55704d7882aab55cc86c999d

今プロジェクトはこちらの株式会社ゆめみ様が公開しているフロントエンドコーディング試験の内容となっております。

RESAS API(<https://opendata.resas-portal.go.jp>)を使用し各都道府県の人口構成を取得し、そのデータを元にグラフ化したものとなります。
下記の URL から実際にご使用になれます。

https://yumemi-8ro1f6pfn-andyleejp.vercel.app/

## 使用時の注意

RESAS 様のウェブサイトにて登録していただき API キーを発行する必要があります。

## 環境

- node 19.2.0
- npm 8.19.3
- TypeScript 4.9.3
- React 18.2.0
- Highcharts 10.3.2

### 起動方法およびデプロイ

ローカル環境では下記のコマンドでプロジェクトが実行され自動でウィンドウが起動します。  
npm start

vercel にてデプロイ(<https://vercel.com/>)

- 無料登録
- 環境変数にて API キーを設定
