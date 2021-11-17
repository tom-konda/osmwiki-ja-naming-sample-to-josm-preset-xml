# これは何

OSM wiki の [JA:Naming sample](https://wiki.openstreetmap.org/wiki/JA:Naming_sample) ページを解析して、[JOSM](https://josm.openstreetmap.de/) のプリセットファイルを作成するツールです。Node.js で動きます。

# 実行方法

Node.js v14.15.0 以上がインストールされている状態で下記のコマンドを実行してください。`./dist/presets.xml` にプリセットファイルが作成されます。

```sh
# インストールは初回のみ必要 (yarn install でも可)
npm install
# 以下はプリセット作成時は毎回実行が必要
node index.js
```

# ライセンス

MIT License