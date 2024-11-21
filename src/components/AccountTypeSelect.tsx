import { forwardRef } from 'react';
import { Group, Select, Text } from "@mantine/core";
import { IBank } from "../types";

const data = [
    {
        id: 'CE',
        name: 'Chequera Electrónica'
    },
    {
        id: 'CC',
        name: 'Cuenta Corriente'
    },
    {
        id: 'CA',
        name: 'Cuenta de Ahorro'
    }
]

const AccountTypeSelectItem = forwardRef<HTMLDivElement, IBank>(
    ({ name, ...others }, ref) => (
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
    handleSelectAccountType: (name: string) => void;
    errorAccountType: string;
}

const AccountTypeSelect = ({ handleSelectAccountType, errorAccountType }: Props) => {

    return (
        <Select
            label="Tipo de cuenta"
            itemComponent={AccountTypeSelectItem}
            data={data.map(c => ({ value: c.id, label: c.name, ...c }))}
            onSelect={(v) => {
                const event = v.target as HTMLSelectElement;
                handleSelectAccountType(event.value)
            }}
            searchable
            clearable
            maxDropdownHeight={300}
            placeholder='Seleccione un tipo de cuenta'
            nothingFound="No se pudieron encontrar coincidencias."
            filter={(value, item) =>
                item?.name?.toLowerCase().includes(value?.toLowerCase().trim()) ||
                item?.code?.toLowerCase().includes(value?.toLowerCase().trim())
            }
            error={errorAccountType}
        />
    );
};

export default AccountTypeSelect;
