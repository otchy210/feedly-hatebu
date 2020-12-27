import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getSynced, setSynced } from '../common';
import VisibilityCheckbox from './VisibilityCheckbox';
import PositionRadioButtonGroup from './PositionRadioButtonGroup';

const defaultOptions = {
    visibilities: {
        titleOnly: true,
        magagine: false,
        cards: false,
        article: true
    },
    positions: {
        titleOnly: 'left',
        magagine: 'left',
        cards: 'left',
        article: 'left'
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
                    label="リスト (Title-Only) "
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
                    label="マガジン"
                    visibilities={visibilities}
                    updateVisibilities={updateVisibilities}
                />
            </Td>
            <Td>
                <PositionRadioButtonGroup
                    name="magagine"
                    values={[['left', '左側'], ['right', '右側'], ['top', '上部'], ['image', '画像上']]}
                    visibilities={visibilities}
                    positions={positions}
                    updatePositions={updatePositions}
                />
            </Td>
        </Tr>
        <Tr>
            <Td>
                <VisibilityCheckbox
                    name="cards"
                    label="カード"
                    visibilities={visibilities}
                    updateVisibilities={updateVisibilities}
                />
            </Td>
            <Td>
                <PositionRadioButtonGroup
                    name="cards"
                    values={[['left', '左側'], ['right', '右側'], ['image', '画像上']]}
                    visibilities={visibilities}
                    positions={positions}
                    updatePositions={updatePositions}
                />
            </Td>
        </Tr>
        <Tr>
            <Td>
                <VisibilityCheckbox
                    name="article"
                    label="記事 (詳細) "
                    visibilities={visibilities}
                    updateVisibilities={updateVisibilities}
                />
            </Td>
            <Td>
                <PositionRadioButtonGroup
                    name="article"
                    values={[['left', '左側'], ['right', '右側']]}
                    visibilities={visibilities}
                    positions={positions}
                    updatePositions={updatePositions}
                />
            </Td>
        </Tr>
    </Table>;
};

export default OptionsTable;