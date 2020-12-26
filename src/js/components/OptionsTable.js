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
        article: false
    },
    positions: {
        titleOnly: 'left',
        titleOnly_Meta: 'left',
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

const Flex = styled.div`
    display: flex;
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
                <Flex>
                    <PositionRadioButtonGroup
                        name="titleOnly"
                        values={[['left', '一覧左側'], ['right', '一覧右側']]}
                        visibilities={visibilities}
                        positions={positions}
                        updatePositions={updatePositions}
                    />
                    <PositionRadioButtonGroup
                        name="titleOnly_Meta"
                        values={[['left', '詳細左側'], ['right', '詳細右側']]}
                        visibilities={visibilities}
                        positions={positions}
                        updatePositions={updatePositions}
                    />
                </Flex>
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
            <Td>
                <Flex>
                    <PositionRadioButtonGroup
                        name="magagine"
                        values={[['left', '左側'], ['right', '右側'], ['top', '上部'], ['image', '画像上']]}
                        visibilities={visibilities}
                        positions={positions}
                        updatePositions={updatePositions}
                    />
                </Flex>
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
            <Td>
                <Flex>
                    <PositionRadioButtonGroup
                        name="cards"
                        values={[['left', '左側'], ['right', '右側']]}
                        visibilities={visibilities}
                        positions={positions}
                        updatePositions={updatePositions}
                    />
                </Flex>
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
            <Td>
                <Flex>
                    <PositionRadioButtonGroup
                        name="article"
                        values={[['left', '左側'], ['right', '右側']]}
                        visibilities={visibilities}
                        positions={positions}
                        updatePositions={updatePositions}
                    />
                </Flex>
            </Td>
        </Tr>
    </Table>;
};

export default OptionsTable;