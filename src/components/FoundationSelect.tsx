/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useEffect, useState } from 'react';
import { Group, Loader, Select, Text } from "@mantine/core";
import { getFoundationsSelect } from '../firebase/services/FoundationServices';

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
    value?: string;
    disabled?: boolean;
}


const FoundationSelect = ({ errorFoundation, handleSelectFoundation, value, disabled }: Props) => {

    const [foundations, setFoundations] = useState([]);
    const [loading, setLoading] = useState<boolean>(false); 

    useEffect(() => {
        chargedCategories();
    }, []);

    const chargedCategories = async () => {
        setLoading(true);
        try {
            const response = await getFoundationsSelect();
            setFoundations(response);
        } catch (error) {
            console.error('Error fetching foundations:', error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <Select
            label="Fundación"
            placeholder='Selecciona la fundación que organiza la campaña'
            itemComponent={FoundationSelectItem}
            data={foundations.map((foundation) => ({ value: foundation.id, label: foundation.name, ...foundation }))}
            searchable
            clearable
            maxDropdownHeight={300}
            nothingFound="No hay fundaciones"
            onChange={(val) => handleSelectFoundation(val)}
            error={errorFoundation}
            value={value}
            defaultValue={value}
            disabled={disabled || loading || foundations.length === 0} 
            rightSection={loading ? <Loader size={16} /> : null}
        />
    );
};

export default FoundationSelect;
