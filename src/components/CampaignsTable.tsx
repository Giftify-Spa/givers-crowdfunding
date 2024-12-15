/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Group, Text, Button, Grid } from '@mantine/core';
import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";
import { getCampaigns } from "../firebase/services/campaigns/getCampaigns";
import { deleteCampaign } from "../firebase/services/campaigns/deleteCampaign";
import { formattingToCLPNumber } from "../helpers/formatCurrency";
import LoadingSpinnerTable from "./LoadingSpinnerTable";
import { Link } from 'react-router-dom';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import MySwal from '../utils/swal';

const PAGE_SIZE = 5;

const campaignsCache: any[] = [];

const CampaignsTable = () => {
    const [page, setPage] = useState(1);
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const chargedCampaigns = async () => {
            try {
                if (campaignsCache.length > 0) {
                    return campaignsCache;
                }
                const response = await getCampaigns(1000);

                const newCampaigns = response.filter(campaign =>
                    !campaignsCache.some(cached => cached.id === campaign.id) // Asegúrate de que 'id' es el campo correcto
                );

                campaignsCache.push(...newCampaigns);
                return campaignsCache;
            } catch (error) {
                console.error("Error getting documents: ", error);
                throw error; // Re-lanza el error para que pueda ser capturado por el caller
            }
        };

        const fetchData = async () => {
            try {
                const campaigns = await chargedCampaigns();
                const recordsFormatted = campaigns.map((d) => ({ ...d, key: d.ID }))
                setRecords(recordsFormatted);
                setIsLoading(false);
            } catch (error) {
                // Manejar errores aquí, por ejemplo, establecer un estado de error
                console.error("Failed to fetch foundations: ", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const paginatedRecords = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    if (isLoading) {
        return <LoadingSpinnerTable />;
    }

    const handleApprove = async (campaignId: string) => {
        const result = await MySwal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres eliminar esta campaña? Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await deleteCampaign(campaignId);
                setRecords(prevCampaigns => prevCampaigns.filter(campaign => campaign.id !== campaignId));
                MySwal.fire(
                    'Eliminado',
                    'La campaña ha sido eliminada correctamente.',
                    'success'
                );
            } catch (error) {
                console.error("Error eliminando campaña:", error);
                MySwal.fire(
                    'Error',
                    'Hubo un problema al eliminar la campaña. Inténtalo de nuevo más tarde.',
                    'error'
                );
            }
        }
    };

    return (
        <div className="animate__animated animate__fadeIn animate__fast">
            <DataTable
                columns={[
                    {
                        accessor: 'createdBy',
                        title: 'Creado por',
                        render: ({ createdBy }) =>
                            <Group>
                                <Avatar src={createdBy.photoURL ? createdBy.photoURL : ''} alt={`${createdBy ? createdBy.name : 'default'} profile avatar`} size="sm" radius="xl" />
                                <Text>{createdBy ? createdBy.name : ''}</Text>
                            </Group>
                    },
                    {
                        accessor: 'name',
                        title: 'Nombre',
                    },
                    {
                        accessor: 'foundation',
                        title: 'Fundación',
                        render: ({ foundation }) => foundation.name
                    },
                    {
                        accessor: 'cumulativeAmount', title: 'Monto acumulado',
                        render: ({ cumulativeAmount }) => formattingToCLPNumber(cumulativeAmount)
                    },
                    {
                        accessor: 'requestAmount', title: 'Monto solicitado',
                        render: ({ requestAmount }) => formattingToCLPNumber(requestAmount)
                    },
                    {
                        accessor: 'initDate', title: 'Fecha de inicio',
                        render: ({ initDate }) => new Date(initDate.seconds * 1000).toLocaleDateString(),
                    },
                    {
                        accessor: 'endDate', title: 'Fecha de término',
                        render: ({ endDate }) => new Date(endDate.seconds * 1000).toLocaleDateString(),
                    },
                    {
                        accessor: 'actions', title: 'Acciones',
                        render: ({ id }) =>
                            <Grid gutter="xs">
                                <Grid.Col span={6} xs={12}>
                                    <Button
                                        leftIcon={<IconPencil size={18} />}
                                        component={Link}
                                        to={`/admin/edit-campaign/${id}`}
                                        color='yellow'
                                        variant='outline'
                                        sx={(theme) => ({
                                            transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
                                            '&:hover': {
                                                backgroundColor: theme.colors.yellow[6],
                                                borderColor: theme.colors.yellow[6],
                                                color: theme.white,
                                            },
                                        })}
                                    >
                                        Editar
                                    </Button>
                                </Grid.Col>

                                <Grid.Col span={6} xs={12}>
                                    <Button
                                        onClick={() => handleApprove(id)}
                                        leftIcon={<IconTrash size={18} />}
                                        color="red"
                                        variant='outline'
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
                                </Grid.Col>
                            </Grid>
                    }

                ]}
                records={paginatedRecords}
                totalRecords={records.length}
                noRecordsText="No hay registros"
                recordsPerPage={PAGE_SIZE}
                page={page}
                onPageChange={(p) => setPage(p)}
                highlightOnHover
                verticalSpacing="sm"


            />
        </div >
    );
};

export default CampaignsTable;
