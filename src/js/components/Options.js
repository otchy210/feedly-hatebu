import React, { useState } from 'react';
import { Section, SectionTitle, SectionBody } from './common';
import OptionsTable from './OptionsTable';

const Options = () => {
    const [edited, setEdited] = useState(false);
    return <Section>
        <SectionTitle note={edited ? 'オプションが更新されました。Feedly のタブを再読込すると反映されます。' : null}>オプション</SectionTitle>
        <SectionBody>
            <OptionsTable setEdited={setEdited} />
        </SectionBody> 
    </Section>;
};

export default Options;
