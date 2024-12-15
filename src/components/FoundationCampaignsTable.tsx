/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Button } from '@mantine/core';
import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";
import { getCampaignsWithFoundation } from "../firebase/services/campaigns/getCampaigns";
import { formattingToCLPNumber } from "../helpers/formatCurrency";
import LoadingSpinnerTable from "./LoadingSpinnerTable";
// import { Link } from 'react-router-dom';
// import { IconPencil } from '@tabler/icons-react';

const PAGE_SIZE = 5;

const campaignsCache: any[] = [];

interface Props {
    id: string;
}

const FoundationCampaignsTable = ({ id }: Props) => {
    const [page, setPage] = useState(1);
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const chargedCampaigns = async () => {
            try {
                console.log(id);
                const response = await getCampaignsWithFoundation(id);

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
    }, [id]);

    const paginatedRecords = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    if (isLoading) {
        return <LoadingSpinnerTable />;
    }

    return (
        <div className="animate__animated animate__fadeIn animate__fast">
            <DataTable
                columns={[
                    {
                        accessor: 'name',
                        title: 'Nombre',
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
                        accessor: 'status', title: 'Estado',
                        render: ({ status, isFinished, isExecute }) => (!status) ? 'Pendiente de Aprobación' : ((!isFinished && !isExecute && status) ? 'Activa' : ((isExecute && !isFinished) ? 'En Ejecución' : (isFinished) && 'Finalizada')),
                    },
                    // {
                    //     accessor: 'actions', title: 'Acciones',
                    //     render: ({ id }) => <Button
                    //         leftIcon={<IconPencil size={18} />}
                    //         component={Link}
                    //         to={`/admin/edit-campaign/${id}`}
                    //     ></Button>,
                    // }
                ]}
                records={paginatedRecords}
                totalRecords={records.length}
                recordsPerPage={PAGE_SIZE}
                page={page}
                onPageChange={(p) => setPage(p)}
                highlightOnHover
                verticalSpacing="sm"
            />
        </div >
    );
};

export default FoundationCampaignsTable;
