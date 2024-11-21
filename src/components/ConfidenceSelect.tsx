import { forwardRef } from 'react';
import { Group, Select, Text } from "@mantine/core";

interface CategorySelectItemProps extends React.ComponentPropsWithoutRef<'div'> {
    label: string;
    value: string;
}

const ConfidenceSelectItem = forwardRef<HTMLDivElement, CategorySelectItemProps>(
    ({ label, ...others }, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <div>
                    <Text size="sm">{label}</Text>
                </div>
            </Group>
        </div>
    )
);

const mockdata = [
    {
        id: "1",
        name: "Baja",
    },
    {
        id: "2",
        name: "Media",
    },
    {
        id: "3",
        name: "Alta",
    },
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
            itemComponent={ConfidenceSelectItem}
            data={mockdata.map(c => ({ value: c.id, label: c.name }))}
            searchable
            clearable
            maxDropdownHeight={300}
            nothingFound="Nothing found"
            filter={(value, item) =>
                item?.label?.toLowerCase().includes(value?.toLowerCase().trim())
            }
            onChange={updateSelectedConfidence}
            error={errorConfidence}
        />
    );
};

export default ConfidenceSelect;
