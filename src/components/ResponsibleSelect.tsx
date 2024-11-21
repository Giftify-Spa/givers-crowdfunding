/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useEffect, useState } from 'react';
import { Group, Select, Text } from "@mantine/core";
import { getUsersSelect } from '../firebase/services/UserServices';

const ResponsibleSelectItem = forwardRef<HTMLDivElement, any>(
    ({ name, email, ...others }: any, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <div>
                    <Text size="sm">{name} - {email}</Text>
                </div>
            </Group>
        </div>
    )
);

interface Props {
    handleSelectResponsible: (value: string) => void;
    errorResponsible: string;
}

const ResponsibleSelect = ({ handleSelectResponsible, errorResponsible }: Props) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        chargedUsers();
    }, []);

    const chargedUsers = async () => {
        try {
            const response = await getUsersSelect();
            setUsers(response);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
    return (
        <Select
            label="Responsable"
            placeholder='Selecciona al responsable de la fundación'
            itemComponent={ResponsibleSelectItem}
            data={users.map((user) => ({ value: user.id, label: `${user.name} - ${user.email}`, ...user }))}
            searchable
            clearable
            maxDropdownHeight={300}
            nothingFound="No se encontró nada"
            onChange={(value) => handleSelectResponsible(value)}
            error={errorResponsible}
        />
    );
};
export default ResponsibleSelect;
