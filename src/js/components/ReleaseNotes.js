import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, SectionBody, Link } from './common';

const SmallLink = styled(Link)`
    margin-left: 12px;
    font-size: 12px;
    font-weight: normal;
    cursor: pointer;
`;

const Caution = styled.span`
    color: #f33;
    font-weight: bold;
`;

const ReleaseNotes = ({handleClick}) => {
    return <Section>
        <SectionTitle>更新情報{handleClick ? <SmallLink onClick={handleClick}>[更新情報をどかす]</SmallLink> : null}</SectionTitle>
        <SectionBody>
            Ver 3.0.0 [2023-xx-xx]<br />
            <Caution>はてブ API から情報を取得するためにローカル環境にプロキシサーバを立てなくてはならなくなりました。</Caution><br />
            Google Chrome エクステンションの Manifest が v2 から v3 にバージョンアップするのに伴いプライバシー保護機能が強化され、<Link href="https://qiita.com/otchy/items/c8506f21788e97097097" target="_blank">従来は有効だった抜け穴</Link>が塞がれてしまい、もはやプロキシサーバを立てる以外の回避策が存在しないためです。このエクステンションは Manifest v2 のまま本機能の提供を続けていましたが、<Link href="https://forest.watch.impress.co.jp/docs/news/1443758.html" target="_blank">2023 年 6 月の v2 サポート終了</Link>に際して v3 への移行が避けられなくなりました。さほど手間にならないように配慮しているので、詳しくは <Link href="https://github.com/otchy210/feedly-hatebu#readme" target="_blank">Feedly はてブのホームページ</Link>を参照してプロキシサーバをローカルに立てて下さい。
        </SectionBody>
        <SectionBody>
            <details>
                <summary>Ver 2.1.0 [2021-01-03]</summary>
                はてなブックマークのデザインを選択できるようになりました。従来は <span class="legacy"><span class="fh-badge"><a>123</a></span></span> しかありませんでしたが、<span class="button"><span class="fh-badge"><a>123</a></span></span> や <span class="feedly"><span class="fh-badge"><a>123</a></span></span> などが選べるようになりました。<br />
                この更新までで Ver.2 リリース当時にやりたいと思っていたことは一通り完了したので、何か新しいアイディアが無ければ以降はバグフィックスが中心となります。小さなものでも構わないので、もし何か改善や機能追加のアイディアがあれば Twitter (<Link href="https://twitter.com/otchy">@otchy</Link>) 経由でご連絡頂ければ検討したいと思います！
            </details>
        </SectionBody>
        <SectionBody>
            <details>
                <summary>Ver 2.0.3 [2020-12-30]</summary>
                はてなブックマーク API の呼び出しを効率化して、より高速に動作するようになりました。
            </details>
        </SectionBody>
        <SectionBody>
            <details>
                <summary>Ver 2.0.0 [2020-12-27]</summary>
                2020 年 12 月 27 日、Ver 2.0.0 がリリースされました！最後の更新から 3 年近く放置されていたエクステンションなので突然の更新に既存ユーザの方々は驚かれたと思いますが、一念発起してやってやりましたよ！<br />
                Ver 2.0.0 では全てをゼロから今風に書き直しており、主な変更点は以下のとおりです。<br />
                <ul>
                    <li>
                        はてブを画像表示するのでは無く API で取得したデータに差し替え
                        <ul>
                            <li>従来の画像表示よりも最新の情報が表示されるようになりました。</li>
                            <li>API のレスポンスをキャッシュすることで表示自体も高速になりました。</li>
                        </ul>
                    </li>
                    <li>
                        リストビュー以外のサポートを追加
                        <ul>
                            <li>リストビューの他、マガジンビュー、カードビュー、記事ビューではてブが表示できるようになりました。</li>
                        </ul>
                    </li>
                    <li>
                        このオプションページを追加
                        <ul>
                            <li>ビューごとに、はてブの表示・非表示が選択できるようになりました。</li>
                            <li>ビューごとに、はてブの表示位置を選択できるようになりました。</li>
                        </ul>
                    </li>
                </ul>
                まだ選べるオプションはあまり多くありませんが、徐々に出来る事を増やしていきたいと思います。<br />
            </details>
        </SectionBody>
        <SectionBody>
            <ul>
                <li>このエクステンションに関するご意見ご要望などは Twitter (<Link href="https://twitter.com/otchy">@otchy</Link>) 経由で受け付けています。お気軽にお声がけ下さい。</li>
                <li>エクステンションを気に入って頂けたら、<Link href="https://chrome.google.com/webstore/detail/feedly-%E3%81%AF%E3%81%A6%E3%83%96/ggaaakgimbjhmglfoahnaoknmceipgni">ウェブストア</Link>にレビューを投稿して頂いたり、Twitter などのソーシャルメディアで紹介して頂けると嬉しいです。</li>
                <li>ソースコードは <Link href="https://github.com/otchy210/feedly-hatebu">GitHub</Link> で公開しています。</li>
            </ul>
        </SectionBody> 
    </Section>
};

export default ReleaseNotes;