# LINE Home Controller

家電をLINE Botからチャットやリモコンで操作したり、Clovaから音声操作するプログラムです。  

## しくみ

FirebaseのRealtime Databaseへの書き込みを検知し、書き込みに対応する家電操作を行います。  
本リポジトリはFirebaseまでの書き込みをLINE BotおよびClovaスキルから行うプログラムになります。  

Firebaseへの書き込み後の家電操作に関する情報は以下をご参照ください。  

* [Qiita](https://qiita.com/miso_develop/items/99624915d3d6e41a5fb3)
* [スマートスピーカーを遊びたおす本（技術書展5 ひろ亭）](https://techbookfest.org/event/tbf05/circle/41000002)
* [miso-home-controller](https://github.com/miso-develop/miso-home-controller)

## Setup

### Firebase

まずFirebaseプロジェクトを作成します。  
そしてRealtime Databaseを以下のように作成してください。  

```plain text
プロジェクト名
 └ home-controller
    └ word: ""
```

つぎにルールを以下のように設定します。  

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    
    "home-controller": {
      ".read": true,
      ".write": true,
    },
  },
}
```

### bot

チャネルの作成方法等は割愛致します。  

#### bot/app

LINE Botのプログラムです。  
config.jsに以下の情報を埋め込み、`npm i`ののちLambdaなりFaaSへデプロイします。  

* FirebaseのプロジェクトID
* BotのSecret
* BotのAccess Token
* `liffUri`はbot/liffを参照

#### bot/liff

Botから起動するリモコンGUIのWebプログラムです。  
Realtime Databaseを作成したFirebaseのHostingにデプロイします。  

liff登録時に発行されるlineプロトコルのuriをBotのconfing.jsの`liffUri`に記載します。  
`images/richmenu.jpg`をリッチメニューの画像にお使いください。  

### clova

チャネルの作成方法等は割愛致します。  

#### clova/app

Clovaスキルのプログラムです。  
config.jsに以下の情報を埋め込み、`npm i`ののちLambdaなりFaaSへデプロイします。  

* FirebaseのプロジェクトID

#### clvoa/model

Clovaスキルの対話モデルです。  
格納されているインテント、スロットのファイルと同名のものを作成し、TSVファイルをアップロードします。  
`CLOVA.NUMBER`のビルトインスロットも追加します。  
