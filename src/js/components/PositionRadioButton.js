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
`;

const RadioButton = styled.input.attrs({type: 'radio'})`
`;

const PositionRadioButton = ({name, value, label, visibilities, positions, updatePositions}) => {
    const disabled = !visibilities[name];
    const checked = positions[name] === value;
    return <Label disabled={disabled} checked={checked}>
        <RadioButton disabled={disabled} checked={checked} onChange={() => updatePositions(name, value)}/> {label}
    </Label>;
};

export default PositionRadioButton;