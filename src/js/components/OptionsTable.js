import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getSynced, setSynced } from '../common';
import VisibilityCheckbox from './VisibilityCheckbox';

const defaultOptions = {
    visibilities: {
        titleOnly: true,
        magagine: true,
        cards: true,
        article: true
    }
};

const Table = styled.table`
`;

const Tr = styled.tr`
`;

const Th = styled.th`
`;

const Td = styled.td`
`;

const OptionsTable = () => {
    const [options, setOptions] = useState();

    useEffect(async () => {
        const savedOptions = await getSynced('options', {});
        const currentOptions = {...defaultOptions,
            visibilities: {
                ...defaultOptions?.visibilities,
                ...savedOptions?.visibilities
            }
        };
        setOptions(currentOptions);
    }, []);

    if (!options) {
        return null;
    }

    const { visibilities } = options;

    const setAndSyncOptions = (newOptions) => {
        setOptions(newOptions);
        setSynced('options', newOptions);
    };

    const updateVisibilities = (name, value) => {
        const newOptions = {...options,
            visibilities: {
                ...options?.visibilities,
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
            <Td><VisibilityCheckbox
                name="titleOnly"
                label="Title-Only"
                visibilities={visibilities}
                updateVisibilities={updateVisibilities}
            /></Td>
        </Tr>
        <Tr>
            <Td><VisibilityCheckbox
                name="magagine"
                label="Magagine"
                visibilities={visibilities}
                updateVisibilities={updateVisibilities}
            /></Td>
        </Tr>
        <Tr>
            <Td><VisibilityCheckbox
                name="cards"
                label="Cards"
                visibilities={visibilities}
                updateVisibilities={updateVisibilities}
            /></Td>
        </Tr>
        <Tr>
            <Td><VisibilityCheckbox
                name="article"
                label="Article"
                visibilities={visibilities}
                updateVisibilities={updateVisibilities}
            /></Td>
        </Tr>
    </Table>;
};

export default OptionsTable;