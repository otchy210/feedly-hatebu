# 開発・検証・リリースガイド

## 前提と初回セットアップ

リポジトリ直下で実行します。必要なのは Node.js / npm、拡張を読み込む Chrome、Feedly を利用できる環境です。実通信の確認には README にある別管理のローカルプロキシを起動し、`localhost:8102` で待ち受けさせます。ZIP 作成には外部の `zip` コマンドも必要です。

`engines` や Node バージョン固定ファイルはありません。2026-10-02 のドキュメント整備時には、既存の `node_modules`、Node.js `v22.23.0`、npm `10.9.8`、webpack `5.10.3` で後述のビルドを確認しました。新規インストールや Chrome 上の動作確認は実施していません。

依存が未インストールなら、lockfile を使ってインストールします。

```sh
npm ci
```

React なども devDependencies にあるため、開発用依存を省略しないでください。lockfile が古いため、実行環境によって補完メタデータのネットワーク取得や警告が発生する可能性があります。失敗時は Node / npm の版とエラーを記録し、安易な lockfile 削除や一括更新で対処しないでください。

初回は `build/` を作成してからビルドします。`bin/build.mjs` は既存の `build/` を削除する際、ディレクトリがない場合を処理していないためです。

```sh
mkdir -p build
npm run build
```

この環境では通常の `npm run build` が `ERR_OSSL_EVP_UNSUPPORTED` で失敗し、次のコマンドでは成功しました。現行の古い webpack を動かすための暫定回避策で、依存更新の代わりではありません。環境変数を恒久的に設定せず、対象コマンドだけに適用します。

```sh
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

上記は macOS / Linux 等のシェル用です。PowerShell では必要なコマンドの間だけ `$env:NODE_OPTIONS = '--openssl-legacy-provider'` を設定し、終了後に元の値へ戻してください。PowerShell での実行は未検証です。

## ビルドの仕組みと反復開発

| コマンド | 処理 |
| --- | --- |
| `npm run build` | `bin/build.mjs` で静的ファイルを準備し、webpack で 3 エントリをバンドル |
| `npm run watch` | 静的ファイルを一度準備し、webpack の監視を開始 |
| `npm run dist` | ビルド後に `bin/dist.mjs` で配布 ZIP を作成 |

`bin/build.mjs` は `build/` を削除・再作成し、manifest の version / description を `package.json` から設定して、`options.html` と `src/img/` をコピーします。コピー処理は async な `forEach` で、個々の完了を明示的に await していません。コピー周辺を修正する場合は完了・失敗時の扱いにも注意してください。

webpack は `background`、`content`、`options` を `build/js/*.js` に出力します。モードは常に `production` で、watch も同じ設定です。Babel は JSX と optional chaining の変換を設定しています。

watch は JavaScript の依存変更を追いますが、manifest、画像、HTML、package のメタデータは再コピーしません。それらの変更時は watch を停止して再ビルドしてください。OpenSSL の回避が必要な環境では watch にも適用します。

```sh
NODE_OPTIONS=--openssl-legacy-provider npm run watch
```

1. Chrome の `chrome://extensions` を開き、デベロッパーモードを有効にする。
2. 「パッケージ化されていない拡張機能を読み込む」で **`build/`** を指定する。`src/` ではない。
3. プロキシを起動し、manifest の対象に一致する Feedly の collection / subscription URL を開く。
4. コード変更をビルドしたら、拡張機能を再読み込みし、Feedly のタブも再読み込みする。設定画面を変更した場合はそのページも再読み込みする。

webpack の watch は Chrome や Feedly の自動リロードを行いません。設定操作だけの場合も、反映には Feedly の再読み込みが必要です。

## 検証チェックリスト

現在、テストランナー・lint スクリプト・CI 設定はありません。変更に関係する以下の項目を確認し、未実施の項目と理由を報告します。ビルドが通っても DOM セレクタや通信の正しさは確認できません。

### ビルドと読み込み

- ビルドが完了し、`build/manifest.json` の version / description が `package.json` と一致している。
- manifest が参照する `build/js/background.js`、`content.js`、`options.js`、`options.html`、アイコンが存在する。
- Chrome が拡張機能を読み込める。拡張機能詳細のエラーと service worker のコンソール、Feedly ページのコンソールを確認する。
- ツールバーから設定画面が開き、位置の説明画像と全デザインのプレビューが表示される。

### バッジ・DOM の変更

| 対象 | 確認項目 |
| --- | --- |
| リスト | 表示 / 非表示、左 / 右、右配置時の hover による非表示 |
| マガジン | 表示 / 非表示、左 / 右 / 上部 / 画像上、画像なし記事 |
| カード | 表示 / 非表示、左 / 右 / 画像上、画像なし記事 |
| 記事詳細 | 表示 / 非表示、左 / 右、一覧から開閉した場合 |
| 件数とリンク | 0 件は表示なし、1・2〜9・10 以上の装飾、リンク先、Feedly 側のクリック動作への影響 |
| 再描画 | スクロールで追加される記事、ビュー切り替え、SPA 内の画面遷移、不要な重複挿入がないこと |
| 注入対象 | collection / subscription の直接読み込みと、対象外 URL からの SPA 遷移を区別する |

マガジン・カードは初期設定では非表示なので、設定を有効にして確認します。各ビューの位置を保ちつつ、デザイン変更が各ビューに反映されることも確認してください。DOM 変更を調査する場合は、記事 URL のリンク、挿入先、CSS セレクタを実 DOM と照合し、必要に応じて個人情報を除いた DOM 例を記録します。

### 通信・設定の変更

- プロキシ稼働時に件数とエントリ URL が取得できる。通常 URL に加え、クエリ・フラグメント・日本語を含む URL も確認する。
- 未登録記事の正常な 0 件と、プロキシ停止・不正 JSON・通信失敗を分けて確認する。現行実装には通信エラー処理が不足している。
- 同じ URL の再取得がキャッシュから返り、service worker 再起動後にはメモリキャッシュが残らないことを確認する。TTL 変更時は期限切れも検証する。
- 設定変更が保存され、設定画面と Feedly の再読み込み後にも残る。
- 設定追加時は、未保存、現行の保存済み設定、新項目のない部分設定を確認する。`magagine` の互換性を保持する。
- 更新通知変更時は、初回、同じ版、パッチ差分、メジャー / マイナー差分を確認する。テスト用プロファイルを使い、普段の sync storage を不用意に消去しない。

## リリース時の手順

通常の修正では ZIP 作成は不要です。リリース作業として実施する場合の手順です。

1. `package.json` の version を決め、必要なら description を更新する。manifest の雛形のプレースホルダーは維持する。
2. README の変更履歴を更新する。ユーザー向け更新情報が必要なら `src/js/components/ReleaseNotes.js` も更新する。通知の有無は `needsToNotify` がメジャー / マイナーで判定する。
3. ビルドと上記の必要な手動確認を行う。
4. `zip` コマンドが使えることと、同じ版の ZIP が存在しないことを確認する。
5. `npm run dist` を実行する。必要なら `NODE_OPTIONS=--openssl-legacy-provider npm run dist` を使う。
6. `unzip -l dist/feedly-hatebu_<version>.zip` 等で、ZIP 直下の `manifest.json`、`options.html`、`img/`、`js/` を確認する。配布 ZIP を一時ディレクトリに展開して読み込む確認も行う。
7. リリース対象として新しい ZIP をレビューし、ストア掲載内容に変更があれば `webstore/` の画像も確認する。

出力名は `dist/<package.name>_<manifest.version>.zip` です。スクリプトは同名 ZIP があるとエラーで終了します。現行版 `3.0.0` の ZIP はすでにあるため、そのまま `npm run dist` しても成功しません。過去の ZIP を削除して回避しないでください。作業用の同名ディレクトリは ZIP の存在確認前に作られるため、失敗後に空ディレクトリが残る場合もあります。

ZIP 作成後の Chrome ウェブストア公開を自動化するスクリプトはありません。ZIP 作成と公開は別の作業です。

## この文書を整備した際の検証記録

- 2026-10-02: Node.js `v22.23.0` / npm `10.9.8` / 既存インストール済み依存で確認。
- `npm run build`: OpenSSL エラー `ERR_OSSL_EVP_UNSUPPORTED` で失敗。
- `NODE_OPTIONS=--openssl-legacy-provider npm run build`: 成功。`fs.rmdir(..., { recursive: true })` の非推奨警告あり。
- クリーン環境の `npm ci`、Chrome への読み込み、Feedly / プロキシ通信、ZIP 作成・公開は未実施。
