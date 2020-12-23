import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { getSynced, setSynced } from '../common';
import { Section, SectionTitle, SectionBody, Link } from './common';
import ReleaseNotes from './ReleaseNotes';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        background-color: #eee;
    }
    * {
        box-sizing: border-box;
        color: #333;
    }
`;

const PageWrapper = styled.div`
    margin: 0 auto;
    padding: 12px;
    background-color: #fff;
    box-shadow: 0 0 5px rgba(0,0,0,0.3);
    min-width: 600px;
    width: 80vw;
    max-width: 1000px;
    min-height: 100vh;
`;

const PageTitle = styled.h1`
    margin: 0;
    padding-left: 60px;
    background-image: url(${chrome.extension.getURL('img/icon128.png')});
    background-size: 48px;
    background-position: left center;
    background-repeat: no-repeat;
    line-height: 48px;
    font-size: 24px;
    font-weibht: bold;
`;

const Feedly = styled.span`
    color: #6cc655;
`;

const Hatebu = styled.span`
    color: #00a4de;
`;

const OptionsPage = () => {
    const [notesPos, setNotesPos] = useState('none');
    const currentVersion = chrome.runtime.getManifest().version;
    useEffect(async () => {
        const seenVersion = await getSynced('seenNotesVersion', '');
        setNotesPos(currentVersion === seenVersion ? 'bottom' : 'top');
    }, []);
    const handleClick = () => {
        setSynced('seenNotesVersion', currentVersion);
        setNotesPos('bottom');
    }
    return <>
        <GlobalStyle />
        <PageWrapper>
            <PageTitle><Feedly>Feedly</Feedly> <Hatebu>はてブ</Hatebu></PageTitle>
            {notesPos === 'top' ? <ReleaseNotes handleClick={handleClick} /> : null}
            <Section>
                <SectionTitle>オプション</SectionTitle>
                <SectionBody>
                    オプションオプション
                </SectionBody> 
            </Section>
            {notesPos === 'bottom' ? <ReleaseNotes /> : null}
        </PageWrapper>
    </>
};

export default OptionsPage;
