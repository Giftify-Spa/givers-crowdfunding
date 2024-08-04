/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from 'react';
import { Group, Select, Text } from "@mantine/core";

const CategorySelectItem = forwardRef<HTMLDivElement, any>(
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

const mockdata = [
    {
        id: '1',
        name: 'Alta',
    },
    {
        id: '2',
        name: 'Media',
    },
    {
        id: '3',
        name: 'Baja',
    }
];

interface Props {
    updateSelectedConfidence: (value: string) => void;
    errorConfidence: string;
}

const ConfidenceSelect = ({ updateSelectedConfidence, errorConfidence }: Props) => {
    return (
        <Select
            label="Nivel de confianza"
            placeholder='Selecciona un nivel de confianza'
            itemComponent={CategorySelectItem}
            data={mockdata.map(c => ({ value: c.id, label: c.name }))}
            searchable
            clearable
            maxDropdownHeight={300}
            nothingFound="Nothing found"
            filter={(value, item) =>
                item?.title?.toLowerCase().includes(value?.toLowerCase().trim())
            }
            onChange={updateSelectedConfidence}
            error={errorConfidence}
        />
    );
};

export default ConfidenceSelect;
