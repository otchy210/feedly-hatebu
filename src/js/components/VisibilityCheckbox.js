import React from 'react';
import styled from 'styled-components';

const Checkbox = styled.input.attrs({type: 'checkbox'})`
`;

const VisibilityCheckbox = ({name, label, visibilities, updateVisibilities}) => {
    const checked = visibilities[name];
    return <label>
        <Checkbox checked={checked} onChange={() => updateVisibilities(name, !checked)} /> {label} View に表示する
    </label>;
};

export default VisibilityCheckbox;