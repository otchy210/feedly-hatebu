import styled from 'styled-components';

export const Section = styled.section`
`;

export const SectionTitle = styled.h2`
    margin-top: 12px;
    padding: 0 4px;
    border-bottom: 2px solid;
    border-image: linear-gradient(to right, #6cc655 0%, #00a4de 100%);
    border-image-slice: 1;
    line-height: 32px;
    font-size: 20px;
    font-weibht: normal;
`;

export const SectionBody = styled.div`
    margin-top: 12px;
    padding: 0 4px;
    font-size: 16px;
    line-height: 24px;
`;

export const Link = styled.a.attrs({target: '_blank'})`
    color: #00c;
`;
