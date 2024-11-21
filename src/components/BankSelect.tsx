import { forwardRef, useEffect, useState } from 'react';
import { Group, Select, Text } from "@mantine/core";
import { IBank } from "../types";
import { getBanks } from '../firebase/service';
import { Bank } from '../interfaces/Bank';

const BankSelectItem = forwardRef<HTMLDivElement, IBank>(
    ({ name, ...others }: IBank, ref) => (
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
    handleSelectBank: (name: string) => void;
    errorBank: string;
}

const BankSelect = ({ handleSelectBank, errorBank }: Props) => {
    const [banks, setBanks] = useState<Bank[]>([]);

    useEffect(() => {
        getInstitutions();
    }, [])


    const getInstitutions = async () => {
        try {
            const response = await getBanks();
            if (Array.isArray(response)) {
                setBanks(response);
            } else {
                setBanks([]);
            }
        } catch (error) {
            setBanks([]);
        }
    }

    return (
        <Select
            label="Banco"
            itemComponent={BankSelectItem}
            data={banks.map(c => ({ value: c.id, label: c.name, ...c }))}
            onSelect={(v) => {
                const event = v.target as HTMLSelectElement;
                handleSelectBank(event.value)
            }}
            searchable
            clearable
            maxDropdownHeight={300}
            placeholder='Seleccione un banco'
            nothingFound="Nothing found"
            filter={(value, item) =>
                item?.name?.toLowerCase().includes(value?.toLowerCase().trim()) ||
                item?.code?.toLowerCase().includes(value?.toLowerCase().trim())
            }
            error={errorBank}
        />
    );
};

export default BankSelect;
