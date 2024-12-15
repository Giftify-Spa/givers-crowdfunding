/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useEffect, useState } from 'react';
import { Group, Loader, Select, Text } from "@mantine/core";
import { getCategoriesSelect } from '../firebase/services/CategoryServices';

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

interface Props {
    handleSelectCategory: (value: string) => void;
    errorCategory: string;
    value?: string;
    disabled?: boolean;
}

const CategorySelect = ({ errorCategory, handleSelectCategory, value, disabled }: Props) => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState<boolean>(false); 

    useEffect(() => {
        chargedCategories();
    }, []);

    const chargedCategories = async () => {
        setLoading(true);
        try {
            const response = await getCategoriesSelect();
            setCategories(response);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Select
            label="Subcategoría"
            placeholder='Selecciona la Subcategoría de la campaña'
            itemComponent={CategorySelectItem}
            data={categories.map(category => ({ value: category.id, label: category.name, ...category }))}
            searchable
            clearable
            maxDropdownHeight={300}
            nothingFound="No hay categorías"
            onChange={(val) => handleSelectCategory(val)}
            error={errorCategory}
            value={value}
            defaultValue={value}
            disabled={disabled || loading || categories.length === 0} 
            rightSection={loading ? <Loader size={16} /> : null}
        />
    );
};

export default CategorySelect;
