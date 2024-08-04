import { useEffect, useState } from "react";
import { DataTable } from "mantine-datatable";
import LoadingSpinnerTable from "./LoadingSpinnerTable";
import { getDonorsByUser } from "../firebase/service";
import { formattingToCLPNumber } from "../helpers/formatCurrency";

const PAGE_SIZE = 10;

const DonatorsTable = () => {
    const [page, setPage] = useState(1);
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const chargedDonors = async () => {
            try {
                const response = await getDonorsByUser();
                return response;
            } catch (error) {
                console.error("Error getting documents: ", error);
                throw error; // Re-lanza el error para que pueda ser capturado por el caller
            }
        };

        const fetchData = async () => {
            try {
                const donors = await chargedDonors();
                setRecords(donors);
                setIsLoading(false);
            } catch (error) {
                // Manejar errores aquí, por ejemplo, establecer un estado de error
                console.error("Failed to fetch donors: ", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <LoadingSpinnerTable />;
    }

    return (
        <DataTable
            columns={[
                {
                    accessor: 'campaign',
                    title: 'Nombre de Campaña',
                    render: ({campaign}) => campaign.name
                },
                {
                    accessor: 'contributionAmount',
                    title: 'Monto Donado',
                    render: ({ contributionAmount }) => formattingToCLPNumber(contributionAmount)
                },
                {
                    accessor: 'dateContribution',
                    title: 'Fecha de Donación',
                    render: ({ dateContribution }) => new Date(dateContribution.seconds * 1000).toLocaleDateString(),
                }
            ]}
            records={records}
            totalRecords={records.length}
            noRecordsText="No hay registros"
            recordsPerPage={PAGE_SIZE}
            page={page}
            onPageChange={(p) => setPage(p)}
            highlightOnHover
            verticalSpacing="sm"
            striped
        />
    );
};

export default DonatorsTable;
