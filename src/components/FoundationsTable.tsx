import { DataTable } from "mantine-datatable";
import { useEffect, useState } from "react";
import { getFoundations } from "../firebase/services/FoundationServices";
import LoadingSpinnerTable from "./LoadingSpinnerTable";
import { randomId, useDisclosure } from "@mantine/hooks";
import { Button, Grid } from "@mantine/core";
import { FundsTransferModal } from "./modals/FundsTransferModal";
import { Foundation } from "../interfaces/Foundation";
import { IconCash, IconPencil } from "@tabler/icons-react";
import { Link } from "react-router-dom";

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
        open(); // Open the modal
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
                            <Grid gutter="xs">
                                <Grid.Col span={6} xs={12}>
                                    <Button
                                        size="xs"
                                        leftIcon={<IconPencil size={18} />}
                                        component={Link}
                                        to={`/admin/edit-foundation/${foundation.id}`}
                                        color="yellow"
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
                                        size="xs"
                                        onClick={() => handleOpenModal(foundation)}
                                        leftIcon={<IconCash size={18} />}
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
                                        Ver Datos Bancarios
                                    </Button>
                                </Grid.Col>
                            </Grid>
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

            <FundsTransferModal
                opened={opened}
                closeModal={close}
                foundation={selectedFoundation} // Pasar la fundación seleccionada al modal
            />
        </div>
    );
};

export default FoundationsTable;
