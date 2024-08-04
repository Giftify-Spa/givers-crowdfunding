import { Avatar, Group, Text } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";
import { getCampaigns } from "../firebase/service";
import { formattingToCLPNumber } from "../helpers/formatCurrency";
import LoadingSpinnerTable from "./LoadingSpinnerTable";

const PAGE_SIZE = 10;

const CampaignsTable = () => {
    const [page, setPage] = useState(1);
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const chargedCampaigns = async () => {
            try {
                const response = await getCampaigns();
                return response;
            } catch (error) {
                console.error("Error getting documents: ", error);
                throw error; // Re-lanza el error para que pueda ser capturado por el caller
            }
        };

        const fetchData = async () => {
            try {
                const campaigns = await chargedCampaigns();
                setRecords(campaigns);
                setIsLoading(false);
            } catch (error) {
                // Manejar errores aquí, por ejemplo, establecer un estado de error
                console.error("Failed to fetch foundations: ", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <LoadingSpinnerTable />;
    }
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
                    }

                ]}
                records={records}
                totalRecords={records.length}
                recordsPerPage={PAGE_SIZE}
                page={page}
                onPageChange={(p) => setPage(p)}
                highlightOnHover
                verticalSpacing="sm"
            />
        </div>
    );
};

export default CampaignsTable;
