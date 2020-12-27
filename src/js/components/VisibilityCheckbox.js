import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
    cursor: pointer;
`;

const Checkbox = styled.input.attrs({type: 'checkbox'})`
`;

const VisibilityCheckbox = ({name, label, visibilities, updateVisibilities}) => {
    const checked = visibilities[name];
    return <Label>
        <Checkbox checked={checked} onChange={() => updateVisibilities(name, !checked)} /> {label}ビューに表示する
    </Label>;
};

export default VisibilityCheckbox;