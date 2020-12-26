import React from 'react';
import PositionRadioButton from './PositionRadioButton';

const PositionRadioButtonGroup = ({name, values, visibilities, positions, updatePositions}) => {
    return <>
        {values.map(([value, label]) => <PositionRadioButton
            name={name}
            value={value}
            label={label}
            visibilities={visibilities}
            positions={positions}
            updatePositions={updatePositions}
        />)}
    </>;
};

export default PositionRadioButtonGroup;