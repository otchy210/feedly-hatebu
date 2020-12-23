import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, SectionBody, Link } from './common';

const SmallLink = styled(Link)`
    margin-left: 12px;
    font-size: 12px;
    font-weight: normal;
    cursor: pointer;
`;

const ReleaseNotes = ({handleClick}) => {
    return <Section>
        <SectionTitle>更新情報{handleClick ? <SmallLink onClick={handleClick}>[更新情報をどかす]</SmallLink> : null}</SectionTitle>
        <SectionBody>
            xxxx年xx月xx日、Ver 2.0.0 がリリースされました！最後の更新から 3 年近く放置されていたエクステンションですので既存ユーザの方々は驚かれたと思いますが、一念発起してやってやりました。<br />
            Ver 2.0.0 では全てをゼロから今風に書き直したのと、このオプションページを追加したのが大きなトピックです。まだほんの少ししかオプションがありませんが、徐々に出来る事を増やしていきたいと思います。<br />
        </SectionBody>
        <SectionBody>
            このエクステンションに関するご意見ご要望などは Twitter (<Link href="https://twitter.com/otchy">@otchy</Link>) 経由で受け付けています。お気軽にお声がけ下さい。<br />
            エクステンションを気に入って頂けたら、<Link href="https://chrome.google.com/webstore/detail/feedly-%E3%81%AF%E3%81%A6%E3%83%96/ggaaakgimbjhmglfoahnaoknmceipgni">ウェブストア</Link>にレビューを投稿して頂いたり、Twitter などのソーシャルメディアで紹介して頂けると嬉しいです。<br />
            ソースコードは <Link href="https://github.com/otchy210/feedly-hatebu">GitHub</Link> で公開しています。<br />
        </SectionBody> 
    </Section>
};

export default ReleaseNotes;