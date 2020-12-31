import React from 'react';
import styled from 'styled-components';
import { RadioButton, RadioButtonLabel } from './common'

const Img = styled.img`
    width: 120px;
    @media (min-width: 1100px) {
        width: 160px;
    }
    @media (min-width: 1300px) {
        width: 200px;
    }
`;

const PositionRadioButton = ({name, value, label, visibilities, positions, updatePositions}) => {
    const disabled = !visibilities[name.split('_')[0]];
    const checked = positions[name] === value;
    const imageUrl = chrome.extension.getURL(`img/${name}-${value}.png`);
    return <RadioButtonLabel disabled={disabled} checked={checked}>
        <RadioButton disabled={disabled} checked={checked} onChange={() => updatePositions(name, value)}/> {label}<br />
        <Img src={imageUrl} />
    </RadioButtonLabel>;
};

export default PositionRadioButton;