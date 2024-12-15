/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react';
import { Group, Text, Button, Badge, Center, Paper, Stack } from '@mantine/core';
import { DataTable } from "mantine-datatable";
import LoadingSpinnerTable from "./LoadingSpinnerTable";
import { IconEye, IconInbox, IconToggleLeft, IconToggleRight, IconTrash } from '@tabler/icons-react';
import { deleteFoundation } from '../firebase/services/FoundationServices';
import MySwal from '../utils/swal';
import { FoundationDetailModal } from './modals/FoundationDetailModal';
import { useDisclosure } from '@mantine/hooks';
import { Foundation } from '../interfaces/Foundation';
import { getPaginatedCampaignsByStatus } from '../firebase/services/campaigns';
import { formattingToCLPNumber } from '../helpers/formatCurrency';
import { toggleCampaignStatus } from '../firebase/services/campaigns/editCampaign';

const PAGE_SIZE = 5; // Number of items per page

interface ManagementCampaignsWithStatusTableProps {
    isExecutePage?: boolean;
    isFinishedPage?: boolean;
    status: boolean;

}

const ManagementCampaignsWithStatusTable = ({ isExecutePage, isFinishedPage, status }: ManagementCampaignsWithStatusTableProps) => {
    const [page, setPage] = useState(1); // Current page in pagination
    const [records, setRecords] = useState([]); // Stores the current foundation data for display
    const [isLoading, setIsLoading] = useState(true); // Loading state for data fetching
    const [processing, setProcessing] = useState<string | null>(null); // Tracks the ID of the user being enabled/disabled
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedFoundation, setSelectedFoundation] = useState(null);

    /**
     * Fetches data for campaigns from the backend and stores it in the cache.
     * If users are already cached, it uses them instead of refetching.
     */
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // Fetch up to 1000 users initially and cache the result
            const { campaigns } = await getPaginatedCampaignsByStatus(1000, isExecutePage, isFinishedPage, status);
            setRecords(campaigns.map(campaign => ({ ...campaign, key: campaign.id }))); // Format data for DataTable
        } catch (error) {
            console.error("Failed to fetch users: ", error);
        } finally {
            setIsLoading(false);
        }
    }, [isExecutePage, isFinishedPage, status]);

    /**
     * Calls `fetchData` on component mount to load campaign data.
     */
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    /**
     * Toggles the active status of a user between enabled and disabled.
     * Updates the local data state after the action is completed.
     *
     * @param campaignId - The ID of the campaign to toggle.
     * @param currentStatus - The current active status of the campaign.
     */
    const handleToggleStatus = async (campaignId: string, currentStatus: boolean) => {
        setProcessing(campaignId);
        try {
            await toggleCampaignStatus(campaignId, !currentStatus);
            setRecords((prevRecords) =>
                prevRecords.map(foundation =>
                    foundation.id === campaignId ? { ...foundation, status: !currentStatus } : foundation
                )
            );
        } catch (error) {
            console.error(`Error ${currentStatus ? 'disabling' : 'enabling'} foundation:`, error);
        } finally {
            setProcessing(null);
        }
    };

    const handleDelete = async (campaignId: string) => {
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
                await deleteFoundation(campaignId);
                setRecords(records => records.filter(foundation => foundation.id !== campaignId));
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
        (records.length === 0) ? (
            <Center style={{ height: 200 }}>
                <Paper p="lg" shadow="sm" radius="md" withBorder>
                    <Stack align="center" spacing="xs">
                        <IconInbox size={48} color="gray" />
                        <Text size="lg" weight={500} color="dimmed">
                            {isExecutePage ? "No hay campañas en ejecución" : isFinishedPage ? "No hay campañas completadas" : "No hay campañas activas"}
                        </Text>
                        <Text size="sm" color="dimmed">
                            {isExecutePage ? "No hay campañas en ejecución en este momento." : 
                             isFinishedPage ? "No hay campañas completadas en este momento." : 
                             "No hay campañas activas en este momento."}
                        </Text>
                    </Stack>
                </Paper>
            </Center>
        ) : (
            <div className="animate__animated animate__fadeIn animate__fast" >
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
                            accessor: 'responsible',
                            title: 'Responsable',
                            render: ({ responsible }) => (
                                <Text>{`${responsible.name} ${responsible.email}`}</Text>
                            ),
                        },
                        {
                            accessor: 'requestAmount',
                            title: 'Monto Solicitado',
                            render: ({ requestAmount }) => (
                                <Text>{formattingToCLPNumber(requestAmount)}</Text>
                            ),
                        },
                        {
                            accessor: 'cumulativeAMount',
                            title: 'Monto Recaudado',
                            render: ({ cumulativeAmount }) => (
                                <Text>{formattingToCLPNumber(cumulativeAmount)}</Text>
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
                            render: (campaign) => (
                                <Group position="right" spacing="xs">
                                    <Button
                                        size="xs"
                                        leftIcon={<IconEye size={18} />}
                                        onClick={() => handleViewDetails(campaign)}
                                        variant='outline'
                                        sx={(theme) => ({
                                            transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
                                            '&:hover': {
                                                backgroundColor: theme.colors.primary[6],
                                                borderColor: theme.colors.primary[6],
                                                color: theme.white,
                                            },
                                        })}
                                    >
                                        Ver Detalles
                                    </Button>

                                    <Button
                                        size="xs"
                                        leftIcon={campaign.status ? <IconToggleLeft size={18} /> : <IconToggleRight size={18} />}
                                        onClick={() => handleToggleStatus(campaign.id, campaign.status)}
                                        loading={processing === campaign.id}
                                        disabled={processing === campaign.id}
                                        color={campaign.status ? "orange" : "green"}
                                        variant='outline'
                                        sx={(theme) => ({
                                            transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
                                            '&:hover': {
                                                backgroundColor: campaign.status ? theme.colors.orange[6] : theme.colors.green[6],
                                                borderColor: campaign.status ? theme.colors.orange[6] : theme.colors.green[6],
                                                color: theme.white,
                                            },
                                        })}
                                    >
                                        {campaign.status ? "Deshabilitar" : "Habilitar"}
                                    </Button>

                                    <Button
                                        size="xs"
                                        leftIcon={<IconTrash size={18} />}
                                        onClick={() => handleDelete(campaign.id)} // Asegúrate de corregir y definir esta función
                                        color="red"
                                        variant="outline"
                                        sx={(theme) => ({
                                            transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
                                            '&:hover': {
                                                backgroundColor: theme.colors.red[6],
                                                borderColor: theme.colors.red[6],
                                                color: theme.white,
                                            },
                                        })}
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
            </div >
        )
    );
};

export default ManagementCampaignsWithStatusTable;
