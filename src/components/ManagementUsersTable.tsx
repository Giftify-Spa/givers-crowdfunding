/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useCallback } from 'react';
import { Avatar, Group, Text, Button, Badge } from '@mantine/core';
import { DataTable } from "mantine-datatable";
import { getPaginatedUsers, toggleUserStatus } from '../firebase/services/UserServices';
import LoadingSpinnerTable from "./LoadingSpinnerTable";
import { IconUserOff, IconUserCheck } from '@tabler/icons-react';

const PAGE_SIZE = 5; // Number of items per page

const ManagementUsersTable = () => {
    const [page, setPage] = useState(1); // Current page in pagination
    const [records, setRecords] = useState([]); // Stores the current user data for display
    const [isLoading, setIsLoading] = useState(true); // Loading state for data fetching
    const [processing, setProcessing] = useState<string | null>(null); // Tracks the ID of the user being enabled/disabled
    const [usersCache, setUsersCache] = useState<any[]>([]); // Cache for storing fetched users

    /**
     * Fetches data for users from the backend and stores it in the cache.
     * If users are already cached, it uses them instead of refetching.
     */
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Use cached users if available
            if (usersCache.length > 0) {
                setRecords(usersCache);
                setIsLoading(false);
                return;
            }
            
            // Fetch up to 1000 users initially and cache the result
            const { users } = await getPaginatedUsers(1000);
            setUsersCache(users); // Save users to cache
            setRecords(users.map(user => ({ ...user, key: user.id }))); // Format data for DataTable
        } catch (error) {
            console.error("Failed to fetch users: ", error);
        } finally {
            setIsLoading(false);
        }
    }, [usersCache]);

    /**
     * Calls `fetchData` on component mount to load user data.
     */
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /**
     * Toggles the active status of a user between enabled and disabled.
     * Updates the local data state after the action is completed.
     *
     * @param userId - The ID of the user to toggle.
     * @param currentStatus - The current active status of the user.
     */
    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        setProcessing(userId);
        try {
            await toggleUserStatus(userId, !currentStatus);
            setRecords((prevRecords) =>
                prevRecords.map(user =>
                    user.id === userId ? { ...user, status: !currentStatus } : user
                )
            );
        } catch (error) {
            console.error(`Error ${currentStatus ? 'disabling' : 'enabling'} user:`, error);
        } finally {
            setProcessing(null);
        }
    };

    // Calculate the records for the current page
    const paginatedRecords = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Display loading spinner for initial page load
    if (isLoading && page === 1) {
        return <LoadingSpinnerTable />;
    }

    return (
        <div className="animate__animated animate__fadeIn animate__fast">
            <DataTable
                columns={[
                    {
                        accessor: 'name',
                        title: 'Nombre',
                        render: ({ name, photoURL }) => (
                            <Group>
                                <Avatar src={photoURL} alt={`${name}'s avatar`} size="sm" radius="xl" />
                                <Text>{name}</Text>
                            </Group>
                        ),
                    },
                    {
                        accessor: 'email',
                        title: 'Correo electrónico',
                    },
                    {
                        accessor: 'profile',
                        title: 'Perfil',
                        render: ({ profile }) => (
                            <Badge color="blue" variant="light">
                                {profile === "Client" ? "Cliente" : "Administrador"}
                            </Badge>
                        ),
                    },
                    {
                        accessor: 'status',
                        title: 'Estado',
                        render: ({ status }) => (
                            <Badge color={status ? "green" : "red"} variant="dot">
                                {status ? "Habilitado" : "Deshabilitado"}
                            </Badge>
                        ),
                    },
                    {
                        accessor: 'actions',
                        title: 'Acción',
                        render: ({ id, status }) => (
                            <Button
                                leftIcon={status ? <IconUserOff size={18} /> : <IconUserCheck size={18} />}
                                color={status ? "red" : "green"}
                                onClick={() => handleToggleStatus(id, status)}
                                disabled={processing === id}
                                loading={processing === id}
                            >
                                {status ? "Deshabilitar" : "Habilitar"}
                            </Button>
                        ),
                    },
                ]}
                records={paginatedRecords} // Only display current page records
                totalRecords={records.length} // Total records across all pages
                recordsPerPage={PAGE_SIZE} // Set page size for pagination
                page={page} // Current page
                onPageChange={setPage} // Function to update page number
                highlightOnHover // Highlight rows on hover
                verticalSpacing="sm" // Vertical spacing for table rows
            />
        </div>
    );
};

export default ManagementUsersTable;
