/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, useEffect, useState } from 'react';
import { Group, Loader, Select, Text } from "@mantine/core";
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
    value?: string;
    disabled?: boolean;
}

const ResponsibleSelect = ({ handleSelectResponsible, errorResponsible, value, disabled }: Props) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        chargedUsers();
    }, []);

    const chargedUsers = async () => {
        setLoading(true);
        try {
            const response = await getUsersSelect();
            setUsers(response);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
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
            onChange={(val) => handleSelectResponsible(val)}
            error={errorResponsible}
            value={value}
            defaultValue={value}
            disabled={disabled || loading || users.length === 0}
            rightSection={loading ? <Loader size={16} /> : null}
        />
    );
};
export default ResponsibleSelect;
