import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";
import { getFoundations } from "../firebase/service";
import LoadingSpinnerTable from "./LoadingSpinnerTable";

const PAGE_SIZE = 10;


const FoundationsTable = () => {
    const [page, setPage] = useState(1);
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const chargedFoundations = async () => {
            try {
                const response = await getFoundations();
                return response;
            } catch (error) {
                console.error("Error getting documents: ", error);
                throw error; // Re-lanza el error para que pueda ser capturado por el caller
            }
        };

        const fetchData = async () => {
            try {
                const foundations = await chargedFoundations();
                setRecords(foundations);
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
                    { accessor: 'name', title: 'Nombre' },
                    { accessor: 'city', title: 'Ciudad' },
                    { accessor: 'address', title: 'Dirección' },
                    { accessor: 'fono', title: 'Teléfono' },
                    { 
                        accessor: 'responsibleName', 
                        title: 'Nombre Responsable',
                        render: ({responsibleName}) => responsibleName 
                    },
                    { 
                        accessor: 'responsibleEmail', 
                        title: 'Correo electrónico Responsable',
                        render: ({responsibleEmail}) => responsibleEmail 
                    },
                ]}
                records={records}
                totalRecords={records.length}
                noRecordsText="No hay registros"
                recordsPerPage={PAGE_SIZE}
                page={page}
                onPageChange={(p) => setPage(p)}
                highlightOnHover
                verticalSpacing="sm"
            />
        </div>
    );
};

export default FoundationsTable;
