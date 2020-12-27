import React from 'react';
import styled from 'styled-components';
import { hatenaBlue, feedlyGreen, alertRed } from './colors';

export const Section = styled.section`
`;

const H2 = styled.h2`
    margin: 12px 0 0 0;
    padding: 0 4px;
    border-bottom: 2px solid;
    border-image: linear-gradient(to right, ${feedlyGreen} 0%, ${hatenaBlue} 100%);
    border-image-slice: 1;
    line-height: 32px;
    font-size: 20px;
    font-weibht: normal;
`;

const Note = styled.small`
    margin: 0 0 0 8px;
    font-size: 12px;
    line-height: 12px;
    font-weight: normal;
    color: ${alertRed};
`;

export const SectionTitle = ({ children, note }) => {
    return <H2>
        {children}
        {note && <Note>{note}</Note>}
    </H2>;
};

export const SectionBody = styled.div`
    margin: 12px 0 0 0;
    padding: 0 4px;
    font-size: 16px;
    line-height: 24px;
`;

export const Link = styled.a.attrs({target: '_blank'})`
    color: #00c;
`;

