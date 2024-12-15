/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react';
import { Group, Text, Button, Badge } from '@mantine/core';
import { DataTable } from "mantine-datatable";
import LoadingSpinnerTable from "./LoadingSpinnerTable";
import { IconEye, IconToggleLeft, IconToggleRight, IconTrash } from '@tabler/icons-react';
import { deleteFoundation, getPaginatedFoundations, toggleFoundationStatus } from '../firebase/services/FoundationServices';
import MySwal from '../utils/swal';
import { FoundationDetailModal } from './modals/FoundationDetailModal';
import { useDisclosure } from '@mantine/hooks';
import { Foundation } from '../interfaces/Foundation';

const PAGE_SIZE = 5; // Number of items per page

const ManagementFoundationsTable = () => {
    const [page, setPage] = useState(1); // Current page in pagination
    const [records, setRecords] = useState([]); // Stores the current foundation data for display
    const [isLoading, setIsLoading] = useState(true); // Loading state for data fetching
    const [processing, setProcessing] = useState<string | null>(null); // Tracks the ID of the user being enabled/disabled
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedFoundation, setSelectedFoundation] = useState(null);

    /**
     * Fetches data for foundations from the backend and stores it in the cache.
     * If users are already cached, it uses them instead of refetching.
     */
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch up to 1000 users initially and cache the result
            const { foundations } = await getPaginatedFoundations(1000);
            setRecords(foundations.map(foundation => ({ ...foundation, key: foundation.id }))); // Format data for DataTable
        } catch (error) {
            console.error("Failed to fetch users: ", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Calls `fetchData` on component mount to load foundation data.
     */
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /**
     * Toggles the active status of a user between enabled and disabled.
     * Updates the local data state after the action is completed.
     *
     * @param foundationId - The ID of the foundation to toggle.
     * @param currentStatus - The current active status of the foundation.
     */
    const handleToggleStatus = async (foundationId: string, currentStatus: boolean) => {
        setProcessing(foundationId);
        try {
            await toggleFoundationStatus(foundationId, !currentStatus);
            setRecords((prevRecords) =>
                prevRecords.map(foundation =>
                    foundation.id === foundationId ? { ...foundation, status: !currentStatus } : foundation
                )
            );
        } catch (error) {
            console.error(`Error ${currentStatus ? 'disabling' : 'enabling'} foundation:`, error);
        } finally {
            setProcessing(null);
        }
    };

    const handleDelete = async (foundationId: string) => {
        const result = await MySwal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres eliminar esta fundación? Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await deleteFoundation(foundationId);
                setRecords(records => records.filter(foundation => foundation.id !== foundationId));
                MySwal.fire(
                    'Eliminado',
                    'La fundación ha sido eliminada correctamente.',
                    'success'
                );
            } catch (error) {
                console.error("Error eliminando la fundación:", error);
                MySwal.fire(
                    'Error',
                    'Hubo un problema al eliminar la fundación. Inténtalo de nuevo más tarde.',
                    'error'
                );
            }
        }
    };

    const handleViewDetails = async (foundation: Foundation) => {
        setSelectedFoundation(foundation);
        open(); // Abre el modal
    }

    // Calculate the records for the current page
    const paginatedRecords = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Display loading spinner for initial page load
    if (isLoading && page === 1) {
        return <LoadingSpinnerTable />;
    }

    return (
        <div className="animate__animated animate__fadeIn animate__fast">
            <DataTable
                sx={{ width: '100%' }}
                columns={[
                    {
                        accessor: 'name',
                        title: 'Nombre',
                        render: ({ name }) => (
                            <Text>{name}</Text>
                        ),
                    },
                    {
                        accessor: 'city',
                        title: 'Ciudad',
                        render: ({ city }) => (
                            <Text>{city}</Text>
                        ),
                    },
                    {
                        accessor: 'address',
                        title: 'Dirección',
                        render: ({ address }) => (
                            <Text>{address}</Text>
                        ),
                    },
                    {
                        accessor: 'fono',
                        title: 'Teléfono',
                        render: ({ fono }) => (
                            <Text>{fono}</Text>
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
                        render: (foundation) => (
                            <Group position="right" spacing="xs">
                                <Button
                                    size="xs"
                                    leftIcon={<IconEye size={18} />}
                                    onClick={() => handleViewDetails(foundation)}
                                >
                                    Ver Detalles
                                </Button>

                                <Button
                                    size="xs"
                                    leftIcon={foundation.status ? <IconToggleLeft size={18} /> : <IconToggleRight size={18} />}
                                    color={foundation.status ? "red" : "green"}
                                    onClick={() => handleToggleStatus(foundation.id, foundation.status)}
                                    disabled={processing === foundation.id}
                                    loading={processing === foundation.id}
                                >
                                    {foundation.status ? "Deshabilitar" : "Habilitar"}
                                </Button>

                                <Button
                                    size="xs"
                                    leftIcon={<IconTrash size={18} />}
                                    variant="outline"
                                    color="red"
                                    onClick={() => handleDelete(foundation.id)} // Asegúrate de corregir y definir esta función
                                >
                                    Eliminar
                                </Button>
                            </Group>
                        ),
                    }
                ]}
                records={paginatedRecords} // Only display current page records
                totalRecords={records.length} // Total records across all pages
                recordsPerPage={PAGE_SIZE} // Set page size for pagination
                page={page} // Current page
                onPageChange={setPage} // Function to update page number
                highlightOnHover // Highlight rows on hover
                verticalSpacing="sm" // Vertical spacing for table rows
            />
            <FoundationDetailModal
                opened={opened}
                closeModal={close}
                foundation={selectedFoundation} // Pasar la fundación seleccionada al modal
            />
        </div>
    );
};

export default ManagementFoundationsTable;
