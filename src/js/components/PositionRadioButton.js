import React from 'react';
import styled from 'styled-components';
import { lineGrey } from './colors';

const Label = styled.label`
    padding: 8px;
    border-style: solid;
    border-width: 1px;
    border-color: ${props => props.checked ? lineGrey : 'transparent'};
    border-radius: 4px;
    opacity: ${props => props.disabled ? '0.5' : '1'};
    cursor: ${props => props.disabled ? 'default' : 'pointer'};
`;

const RadioButton = styled.input.attrs({type: 'radio'})`
`;

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
    return <Label disabled={disabled} checked={checked}>
        <RadioButton disabled={disabled} checked={checked} onChange={() => updatePositions(name, value)}/> {label}<br />
        <Img src={imageUrl} />
    </Label>;
};

export default PositionRadioButton;