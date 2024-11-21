/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useEffect, useState } from 'react';
import { Group, Select, Text } from "@mantine/core";
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
}

const CategorySelect = ({ errorCategory, handleSelectCategory }: Props) => {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        chargedCategories();
    }, []);

    const chargedCategories = async () => {
        try {
            const response = await getCategoriesSelect();
            setCategories(response);
        } catch (error) {
            console.error('Error fetching users:', error);
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
            onChange={(value) => handleSelectCategory(value)}
            error={errorCategory}
        />
    );
};

export default CategorySelect;
