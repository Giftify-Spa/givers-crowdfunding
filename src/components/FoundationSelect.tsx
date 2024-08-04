/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useEffect, useState } from 'react';
import { Group, Select, Text } from "@mantine/core";
import { getFoundationsSelect } from '../firebase/service';

const FoundationSelectItem = forwardRef<HTMLDivElement, any>(
    ({ name, ...others }: any, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <div>
                    <Text size="sm">{name}</Text>
                </div>
            </Group>
        </div>
    )
);

interface Props {
    handleSelectFoundation: (value: string) => void;
    errorFoundation: string;
}


const FoundationSelect = ({ errorFoundation, handleSelectFoundation }: Props) => {

    const [foundations, setFoundations] = useState([]);

    useEffect(() => {
        chargedCategories();
    }, []);

    const chargedCategories = async () => {
        try {
            const response = await getFoundationsSelect();
            setFoundations(response);
        } catch (error) {
            console.error('Error fetching foundations:', error);
        }
    }
    return (
        <Select
            label="Fundación"
            itemComponent={FoundationSelectItem}
            data={foundations.map((foundation) => ({ value: foundation.id, label: foundation.id, ...foundation }))}
            searchable
            clearable
            maxDropdownHeight={300}
            nothingFound="No hay fundaciones"
            onSelect={(v) => {
                const event = v.target as HTMLSelectElement;
                handleSelectFoundation(event.value)
            }}
            error={errorFoundation}
        />
    );
};

export default FoundationSelect;
