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
} from "@tabler/icons-react";
import { CampaignsTable } from "../components";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
// import { DashboardLayout } from "../layout";
import GiversLayout from "../layout/GiversLayout";
import { useContext} from "react";
import { AuthContext } from "../context/auth/AuthContext";
import FoundationsTable from "../components/FoundationsTable";

const DashboardAdminPage = () => {

    const { user } = useContext(AuthContext)

    const paperProps: PaperProps = {
        p: "md",
        shadow: "sm"
    }

    const subTitleProps: TitleProps = {
        size: 18,
        mb: "sm"
    }

    return (
        <GiversLayout>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <Box>
                <Container fluid my="xl">
                    <Stack spacing="xl">
                        <Title order={3}>Hola, {user.name}</Title>

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
                                <CampaignsTable />
                            </Card.Section>
                        </Paper>

                        {/* Foundations Table */}
                        <Paper {...paperProps}>
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
                        </Paper>

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

export default DashboardAdminPage;
