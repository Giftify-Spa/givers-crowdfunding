import {
    Box,
    Button,
    Card,
    Container,
    Flex,
    Paper,
    PaperProps,
    Stack,
    Text,
    Title,
    TitleProps
} from "@mantine/core";
import {
    IconPlus,
    IconEdit
} from "@tabler/icons-react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import GiversLayout from "../layout/GiversLayout";
import { useEffect, useState } from "react";
import { getFoundation } from "../firebase/services/FoundationServices";
import { Foundation } from "../interfaces/Foundation";
import FoundationCampaignsTable from "../components/FoundationCampaignsTable";

const DashboardFoundationPage = () => {

    // const { user } = useContext(AuthContext)

    const [foundation, setFoundation] = useState<Foundation | null>(null);

    const { id } = useParams<{ id: string }>();

    const paperProps: PaperProps = {
        p: "md",
        shadow: "sm"
    }

    const subTitleProps: TitleProps = {
        size: 18,
        mb: "sm"
    }

    useEffect(() => {
        const searchFoundation = async () => {
            try {
                const response = await getFoundation(id);
                return response;
            } catch (error) {
                console.error("Error getting documents: ", error);
                throw error; // Re-lanza el error para que pueda ser capturado por el caller
            }
        };

        const fetchData = async () => {
            try {
                const foundation = await searchFoundation();
                setFoundation(foundation);
            } catch (error) {
                // Manejar errores aquí, por ejemplo, establecer un estado de error
                console.error("Failed to fetch foundations: ", error);
            }
        };

        fetchData();

    }, [id]);

    return (
        <GiversLayout>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <Box>
                <Container fluid my="xl">
                    <Stack spacing="xl">
                        <Flex align="center" justify="space-between">
                            <Title order={3}>{foundation && `Fundación ${foundation?.name}`}</Title>
                            <Button
                                leftIcon={<IconEdit size={18} />}
                                component={Link}
                                to={`/panel/my-foundation/edit/${id}`}
                            >
                                Editar datos Organización
                            </Button>
                        </Flex>
                        {/* Campaigns Table */}
                        <Paper {...paperProps}>
                            <Card.Section mb="lg">
                                <Flex align="center" justify="space-between">
                                    <Box>
                                        <Title {...subTitleProps}>Campañas</Title>
                                        <Text size="sm">Gestiona tus campañas</Text>
                                    </Box>
                                    <Button
                                        leftIcon={<IconPlus size={18} />}
                                        component={Link}
                                        to="/admin/create-campaign"
                                    >
                                        Crear una campaña
                                    </Button>
                                </Flex>
                            </Card.Section>
                            <Card.Section>
                                <FoundationCampaignsTable id={id} />
                            </Card.Section>
                        </Paper>

                        {/* Foundations Table */}
                        {/* <Paper {...paperProps}>
                            <Card.Section mb="lg">
                                <Flex align="center" justify="space-between">
                                    <Box>
                                        <Title {...subTitleProps}>Fundaciones</Title>
                                        <Text size="sm">Gestiona tus fundaciones</Text>
                                    </Box>
                                    <Button
                                        leftIcon={<IconPlus size={18} />}
                                        component={Link}
                                        to="/admin/create-foundation"
                                    >
                                        Crear una fundación
                                    </Button>
                                </Flex>
                            </Card.Section>
                            <Card.Section>
                                <FoundationsTable />
                            </Card.Section>
                        </Paper> */}



                        {/* Donators Table */}
                        {/* <Paper {...paperProps}>
                            <Card.Section>
                                <Title {...subTitleProps}>Top Colaboradores</Title>
                                <DonatorsTable />
                            </Card.Section>
                            <Card.Section></Card.Section>
                        </Paper> */}

                        {/* Yearly Donation Chart */}
                        {/* <Paper {...paperProps}>
                            <Title {...subTitleProps}>Donaciones por categoría</Title>
                            <YearlyDonationChart />
                        </Paper> */}
                    </Stack>
                </Container>
            </Box>
        </GiversLayout>
    );
};

export default DashboardFoundationPage;
