import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";
import { getFoundations } from "../firebase/services/FoundationServices";
import LoadingSpinnerTable from "./LoadingSpinnerTable";
import { randomId, useDisclosure } from "@mantine/hooks";
import { Button } from "@mantine/core";
import { DetailModal } from "./DetailModal";
import { Foundation } from "../interfaces/Foundation";

const PAGE_SIZE = 5;


const FoundationsTable = () => {
    const [page, setPage] = useState(1);
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedFoundation, setSelectedFoundation] = useState(null);

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
                const recordsFormatted = foundations.map((d) => ({ ...d, key: d.id }))
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

    const handleOpenModal = (foundation: Foundation) => {
        setSelectedFoundation(foundation);
        open(); // Abre el modal
    };

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
                        render: ({ responsibleName }) => responsibleName
                    },
                    {
                        accessor: 'responsibleEmail',
                        title: 'Correo electrónico Responsable',
                        render: ({ responsibleEmail }) => responsibleEmail
                    },
                    {
                        accessor: 'actions',
                        title: 'Acciones',
                        render: (foundation) => (
                            <Button size="xs" onClick={() => handleOpenModal(foundation)}>
                                Ver Detalles
                            </Button>
                        )
                    }
                ]}
                records={paginatedRecords}
                totalRecords={records.length}
                noRecordsText="No hay registros"
                recordsPerPage={PAGE_SIZE}
                page={page}
                onPageChange={(p) => setPage(p)}
                highlightOnHover
                key={randomId()}
            />

            <DetailModal
                opened={opened}
                closeModal={close}
                foundation={selectedFoundation} // Pasar la fundación seleccionada al modal
            />
        </div>
    );
};

export default FoundationsTable;
