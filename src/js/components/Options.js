import React from 'react';
import { Section, SectionTitle, SectionBody } from './common';
import OptionsTable from './OptionsTable';

const Options = () => {
    return <Section>
        <SectionTitle>オプション</SectionTitle>
        <SectionBody>
            <OptionsTable />
        </SectionBody> 
    </Section>;
};

export default Options;
