# 構成と保守上の注意

この文書はリポジトリ内の実装を基準にした案内です。外部の Feedly DOM、Chrome の最新制約、別リポジトリのプロキシ実装を検証した仕様書ではありません。変更時は対象コードと実環境を確認してください。

## ファイルの役割

| パス | 役割 |
| --- | --- |
| `src/manifest.json` | Manifest V3 の雛形。注入対象 URL、権限、service worker、設定画面 |
| `src/js/content.js` | Feedly DOM の監視、記事 URL の取得、バッジの挿入、位置・表示 CSS |
| `src/js/background.js` | メッセージ受信、ローカルプロキシへの通信、キャッシュ、設定画面の起動 |
| `src/js/common.js` | 設定初期値、sync storage とメッセージ送信のラッパー、更新通知判定 |
| `src/js/badgeStyle.js` | 8 種類のデザイン ID と CSS。Feedly と設定画面のプレビューで共用 |
| `src/options.html`、`src/js/options.js` | 設定ページの HTML と React の起動処理 |
| `src/js/components/OptionsTable.js` | 設定の読み込み・初期値とのマージ・即時保存 |
| `src/js/components/OptionsPage.js` | 設定画面全体と更新情報の表示位置 |
| `src/js/components/ReleaseNotes.js` | 設定画面に表示する更新情報 |
| `src/js/components/` のその他のファイル | チェックボックス、ラジオボタン、位置の画像、共通 UI と色 |
| `src/js/HatenaApi.js` | 現在 import されていない旧 JSONP 実装 |
| `src/img/` | 拡張機能のアイコンと、設定画面に使う位置の説明画像 |
| `bin/`、`webpack.config.js`、`.babelrc` | 静的ファイルのコピー、バンドル、ZIP 作成 |
| `build/` | Chrome に読み込ませる生成物。Git 管理外 |
| `dist/` | Git 管理対象のリリース ZIP |
| `webstore/` | ストア掲載用画像。ビルドには含まれない |

## 現行の処理経路

1. manifest の `content_scripts.matches` に一致するページで `content.js` が起動する。対象は `https://feedly.com/i/collection/*` と `https://feedly.com/i/subscription/*`。
2. `insertStyle()` が保存設定から CSS を生成し、`watchDomChange()` が `document.body` を `childList: true, subtree: true` で監視する。
3. DOM の変化を受けて `.entry` / `.u100Entry` を検出し、ビュー別のハンドラで記事リンクを読む。
4. `getHabetuBadge()` が `sendMessage('GET_HATEBU', { url })` を呼ぶ（関数名の綴りは実装どおり）。
5. service worker が URL 単位のキャッシュを確認し、未取得ならローカルプロキシから JSON を取得する。
6. `{ count, entry }` を content script に返す。`count > 0` の場合だけ `.fh-badge` を作り、リンク先を別タブで開く。クリックの伝播を止め、Feedly 側への影響を抑えている。

設定画面はこの経路とは独立した React ページです。ツールバーの拡張機能アイコンを押すと `chrome.runtime.openOptionsPage()` で開きます。

### メッセージとプロキシの契約

| 境界 | 現行実装 |
| --- | --- |
| メッセージ要求 | `{ action: 'GET_HATEBU', payload: { url } }` |
| プロキシへの要求 | `GET http://localhost:8102?url=${encodeURI(url)}` |
| 期待する JSON | truthy な応答なら `count` と `entry_url` を参照。falsy な JSON なら未登録として扱う |
| メッセージ応答 | `{ count: result.count, entry: result.entry_url }`。falsy な JSON なら `{ count: 0, entry: url }` |

プロキシのソースはこのリポジトリに含まれません。入手先は [README](../README.md#ローカルプロキシサーバ) を参照してください。この表は拡張側が期待する契約であり、プロキシ内部の挙動を保証するものではありません。

`node-cache` の TTL は 1 時間、期限確認の間隔は 5 分です。キャッシュは service worker のメモリ内だけにあり、永続保存されません。同じ URL への処理中リクエストをまとめる仕組みもありません。

### DOM と表示位置

| ビュー | 検出対象 / 記事リンク | 挿入先 | 設定キーと位置 |
| --- | --- | --- | --- |
| リスト | `.entry.titleOnly` / `a.EntryTitleLink` | `div:has(>p>a)` の先頭 | `titleOnly`: `left`, `right` |
| マガジン | `.entry.magazine` / `a.EntryTitleLink` | `div:has(>div>a)`、`.EntryMetadataWrapper`、深い子孫の画像領域 | `magagine`: `left`, `right`, `top`, `image` |
| カード | `.entry.cards` / `a.EntryTitleLink` | `.EntryMetadataWrapper`、深い子孫の画像領域 | `cards`: `left`, `right`, `image` |
| 記事詳細 | `.u100Entry` / `a.Article__title` | `.EntryMetadataWrapper` | `article`: `left`, `right` |

マガジンは 3 個、カードは 2 個のバッジを挿入し、CSS で表示する位置を選びます。複数個あること自体は重複バグではありません。ハンドラは `.fh-badge` の存在を使って処理済みか判定します。非表示設定も主に CSS で実現しており、API 呼び出し自体を止める設計ではありません。

セレクタは Feedly の DOM 構造に依存します。上表の詳細な子孫セレクタと位置 CSS の実体は `content.js` を参照してください。`src/img/` の画像は設定 UI の説明用であり、最新 DOM の根拠にはできません。

## 保存設定と更新通知

保存先は `chrome.storage.sync` です。

| キー | 内容 / 初期値 |
| --- | --- |
| `options.visibilities` | `{ titleOnly: true, magagine: false, cards: false, article: true }` |
| `options.positions` | 4 ビューとも `left` |
| `options.selectedDesign` | `legacy` |
| `seenVersion` | background が更新通知のために記録する版。未保存時は空文字 |
| `seenNotesVersion` | 更新情報を「どかす」操作で記録する版。未保存時は空文字 |

デザイン ID は `legacy`、`legacy-no-bold`、`legacy-num-only`、`legacy-num-only-no-bold`、`button`、`button-num-only`、`feedly`、`feedly-num-only`。件数 1 には `.fh-badge-one`、それ以外の 10 未満には `.fh-badge-lt10` が付きます。

設定は操作ごとに保存され、Feedly の再読み込み後に反映されます。storage の変更を監視して即時反映する処理はありません。`OptionsTable` は保存済み設定と初期値を入れ子の項目も含めてマージしますが、content script は同じマージをしていません。`getSynced` は値が falsy のときだけ初期値を返します。

`needsToNotify` はメジャー・マイナーの文字列を比較し、パッチ差分だけなら通知しません。初回の空文字からは通知対象になります。background の起動時に `seenVersion` を確認して設定画面を開き、設定画面は `seenNotesVersion` に応じて更新情報を上部または下部に表示します。インストールイベントだけに紐づく処理ではなく、ダウングレードでもメジャー・マイナーが違えば通知対象です。

## 既知の注意点と調査の入口

以下はコードから確認した制約・調査候補です。すべてを実環境で再現した不具合一覧ではありません。依頼の対象になった場合に切り分けてください。

- **旧 API 経路の残存**: `content.js` の未使用 `getHatebu` は `GET_HATEBU_CACHE` / `CACHE_HATEBU` と未 import の `newApiCall` を参照します。background が処理するのは `GET_HATEBU` だけです。旧経路のタイムアウト・再試行は現行経路には適用されません。
- **通信失敗への対処不足**: 現行 `fetch` は HTTP ステータス確認、タイムアウト、例外処理を持ちません。プロキシ停止や不正 JSON を「正常な 0 件」と混同しないように調査してください。
- **URL のエンコード**: 現行の `encodeURI` は `&` や `#` などをクエリ値として完全にはエスケープしません。修正時はプロキシ側の解釈と、クエリ・フラグメント付き記事 URL の往復を確認してください。
- **権限の確認**: manifest にある権限は `storage` で、`host_permissions` はありません。localhost 通信が失敗した場合は service worker のログと実際の Chrome 環境を確認してください。ここでは通信成功を検証していません。
- **DOM 監視の取りこぼし**: 起動時の全件走査はなく、監視開始後の変更がきっかけです。また observer のループ内に `return` があり、同じバッチの残りの mutation を処理しない場合があります。
- **挿入先の欠落と再描画**: 一部ハンドラは URL や挿入先の `null` を確認せず、複数バッジの途中まで挿入した後に失敗すると処理済み判定に阻まれる可能性があります。画像なし記事や Feedly 再描画も確認対象です。
- **CSS と DOM の不一致候補**: 非表示 CSS には `.MagazineLayout__visual` / `.MagazineLayout__content`、`.CardLayout__visual` / `.CardLayout__content`、記事詳細には `.entryHeader .EntryMetadata` が残っています。挿入先や位置 CSS と一致するか実 DOM で確認してください。
- **ビルドの古さ**: Node のバージョン指定はなく、lockfile は形式 1、ルートの版表記は `2.0.0` のままです。拡張機能の現行版 `3.0.0` は `package.json` が基準です。ビルド互換性は開発ガイドを参照してください。

## 変更内容から探す

| 変更・症状 | 最初に確認する場所 |
| --- | --- |
| バッジが出ない / 位置がずれる | manifest の対象 URL → `content.js` の DOM・CSS → background の通信ログ |
| 件数の取得・キャッシュ | `background.js`、`common.js`、別管理のプロキシ |
| デザイン追加 | `badgeStyle.js` の一覧と CSS、設定画面プレビュー、保存済み ID との互換性 |
| 設定追加・位置追加 | `common.js`、`OptionsTable.js`、`content.js`、`src/img/` |
| 更新通知・リリース情報 | `needsToNotify`、background の `init`、`OptionsPage.js`、`ReleaseNotes.js`、README |
| ビルド・パッケージング | `package.json`、`bin/`、webpack、Babel |
