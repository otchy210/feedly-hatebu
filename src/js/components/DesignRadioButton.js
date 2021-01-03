import React from 'react';
import { RadioButton, RadioButtonLabel } from './common'

const DesignRadioButton = ({design, selectedDesign, selectDesign}) => {
    const checked = design === selectedDesign;
    return <RadioButtonLabel checked={checked} className={design}>
        <RadioButton checked={checked} onChange={() => selectDesign(design)}/>
        {' '}<span className="fh-badge"><a>123</a></span>
    </RadioButtonLabel>;
};

export default DesignRadioButton;
