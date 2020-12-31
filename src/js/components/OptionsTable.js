import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { defaultOptions, getSynced, setSynced } from '../common';
import VisibilityCheckbox from './VisibilityCheckbox';
import PositionRadioButtonGroup from './PositionRadioButtonGroup';
import { lineGrey } from './colors';
import DesignRadioButton from './DesignRadioButton';
import { designs } from '../badgeStyle';

const Table = styled.table`
    border-collapse: collapse;
`;

const Tr = styled.tr`
    border-top: 1px solid ${lineGrey};
    border-bottom: 1px solid ${lineGrey};
    &:first-child {
        border-top: none;
    }
`;

const Th = styled.th`
    text-align: left;
    padding: 8px 0;
`;

const Td = styled.td`
    padding: 8px 0;
`;

const OptionsTable = ({ setEdited }) => {
    const [options, setOptions] = useState();

    useEffect(async () => {
        const savedOptions = await getSynced('options', defaultOptions);
        const currentOptions = {...defaultOptions,
            ...savedOptions,
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

    const { visibilities, positions, selectedDesign } = options;

    const setAndSyncOptions = (newOptions) => {
        setOptions(newOptions);
        setSynced('options', newOptions);
    };

    const updateVisibilities = (name, value) => {
        if (options.visibilities[name] === value) {
            return;
        }
        setEdited(true);
        const newOptions = {...options,
            visibilities: {
                ...options?.visibilities,
                [name]: value
            }
        };
        setAndSyncOptions(newOptions);
    };

    const updatePositions = (name, value) => {
        if (options.positions[name] === value) {
            return;
        }
        setEdited(true);
        const newOptions = {...options,
            positions: {
                ...options?.positions,
                [name]: value
            }
        };
        setAndSyncOptions(newOptions);
    };

    const selectDesign = (design) => {
        if (options.selectedDesign === design) {
            return;
        }
        setEdited(true);
        const newOptions = {...options,
            selectedDesign: design
        };
        setAndSyncOptions(newOptions);
    };

    return <>
        <Table>
            <Tr>
                <Th>はてブの表示</Th>
            </Tr>
            <Tr>
                <Td>
                    <VisibilityCheckbox
                        name="titleOnly"
                        label="リスト"
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
        </Table>
        <Table>
            <Tr>
                <Th>はてブのデザイン</Th>
            </Tr>
            <Tr>
                <Td>
                    {designs.map(design => <DesignRadioButton
                        design={design}
                        selectedDesign={selectedDesign}
                        selectDesign={selectDesign}
                    />)}
                </Td>
            </Tr>
        </Table>
    </>;
};

export default OptionsTable;