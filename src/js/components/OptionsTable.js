import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getSynced, setSynced } from '../common';
import VisibilityCheckbox from './VisibilityCheckbox';
import PositionRadioButtonGroup from './PositionRadioButtonGroup';

const defaultOptions = {
    visibilities: {
        titleOnly: true,
        magagine: true,
        cards: true,
        article: true
    },
    positions: {
        titleOnly: 'left',
        magagine: '',
        cards: '',
        article: ''
    },
};

const Table = styled.table`
`;

const Tr = styled.tr`
`;

const Th = styled.th`
    text-align: left;
`;

const Td = styled.td`
`;

const OptionsTable = ({ setEdited }) => {
    const [options, setOptions] = useState();

    useEffect(async () => {
        const savedOptions = await getSynced('options', {});
        const currentOptions = {...defaultOptions,
            visibilities: {
                ...defaultOptions?.visibilities,
                ...savedOptions?.visibilities
            },
            positions: {
                ...defaultOptions?.positions,
                ...savedOptions?.positions
            }
        };
        setOptions(currentOptions);
    }, []);

    if (!options) {
        return null;
    }

    const { visibilities, positions } = options;

    const setAndSyncOptions = (newOptions) => {
        setOptions(newOptions);
        setSynced('options', newOptions);
    };

    const updateVisibilities = (name, value) => {
        if (options.visibilities[name] !== value) {
            setEdited(true);
        }
        const newOptions = {...options,
            visibilities: {
                ...options?.visibilities,
                [name]: value
            }
        };
        setAndSyncOptions(newOptions);
    };

    const updatePositions = (name, value) => {
        if (options.positions[name] !== value) {
            setEdited(true);
        }
        const newOptions = {...options,
            positions: {
                ...options?.positions,
                [name]: value
            }
        };
        setAndSyncOptions(newOptions);
    };

    return <Table>
        <Tr>
            <Th>はてブの表示</Th>
        </Tr>
        <Tr>
            <Td>
                <VisibilityCheckbox
                    name="titleOnly"
                    label="Title-Only"
                    visibilities={visibilities}
                    updateVisibilities={updateVisibilities}
                />
            </Td>
            <Td>
                <PositionRadioButtonGroup
                    name="titleOnly"
                    values={[['left', '左側'], ['right', '右側']]}
                    visibilities={visibilities}
                    positions={positions}
                    updatePositions={updatePositions}
                />
            </Td>
        </Tr>
        <Tr>
            <Td>
                <VisibilityCheckbox
                    name="magagine"
                    label="Magagine"
                    visibilities={visibilities}
                    updateVisibilities={updateVisibilities}
                />
            </Td>
        </Tr>
        <Tr>
            <Td>
                <VisibilityCheckbox
                    name="cards"
                    label="Cards"
                    visibilities={visibilities}
                    updateVisibilities={updateVisibilities}
                />
            </Td>
        </Tr>
        <Tr>
            <Td>
                <VisibilityCheckbox
                    name="article"
                    label="Article"
                    visibilities={visibilities}
                    updateVisibilities={updateVisibilities}
                />
            </Td>
        </Tr>
    </Table>;
};

export default OptionsTable;