import React from 'react';
import styled from 'styled-components';
import PositionRadioButton from './PositionRadioButton';

const Flex = styled.div`
    display: flex;
`;

const PositionRadioButtonGroup = ({name, values, visibilities, positions, updatePositions}) => {
    return <Flex>
        {values.map(([value, label]) => <PositionRadioButton
            name={name}
            value={value}
            label={label}
            visibilities={visibilities}
            positions={positions}
            updatePositions={updatePositions}
        />)}
    </Flex>;
};

export default PositionRadioButtonGroup;