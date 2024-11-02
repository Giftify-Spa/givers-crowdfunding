import {
    Box,
    Button,
    Card,
    Container,
    Flex,
    Loader,
    Paper,
    PaperProps,
    SimpleGrid,
    Stack,
    Text,
    Title,
    TitleProps
} from "@mantine/core";
import {
    IconActivity,
    IconArchiveFilled,
    IconHeartHandshake,
    IconPlus,
    IconUserFilled,
} from "@tabler/icons-react";
import { CampaignsTable } from "../components";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import GiversLayout from "../layout/GiversLayout";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth/AuthContext";
import FoundationsTable from "../components/FoundationsTable";
import { countUsers } from "../firebase/services/UserServices";
import { countActiveCampaigns, countFinishedCampaigns } from "../firebase/services/CampaignServices";

const DashboardAdminPage = () => {

    const { user } = useContext(AuthContext)

    const [usersCount, setUsersCount] = useState(null);
    const [activeCampaignsCount, setActiveCampaignsCount] = useState(null);
    const [finishCampaignsCount, setFinishCampaignsCount] = useState(null);

    const paperProps: PaperProps = {
        p: "md",
        shadow: "sm"
    }

    const subTitleProps: TitleProps = {
        size: 18,
        mb: "sm"
    }

    useEffect(() => {
        checkCountUsers();
        checkCountActiveCampaigns();
        checkCountFinishCampaigns();
    }, []);



    const checkCountActiveCampaigns = async () => {
        const count = await countActiveCampaigns();
        setActiveCampaignsCount(count);
    }

    const checkCountFinishCampaigns = async () => {
        const count = await countFinishedCampaigns();
        setFinishCampaignsCount(count);
    }

    const checkCountUsers = async () => {
        const count = await countUsers();
        setUsersCount(count);
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

                        {/* Grid for Cards */}
                        <SimpleGrid
                            cols={4} // 3 columns by default
                            breakpoints={[
                                { maxWidth: 'md', cols: 2 }, // 2 columns on medium screens
                                { maxWidth: 'sm', cols: 1 }, // 1 column on small screens
                            ]}
                        >
                            {/* Card Donations */}
                            <Card
                                shadow="sm"
                                padding="xl"
                                component="a"
                                radius="md" // Rounded corners
                                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                target="_blank"
                                withBorder // Adds a border
                                sx={(theme) => ({
                                    borderWidth: '2px', // Thicker border
                                    borderColor: theme.colors.gray[3], // Border color
                                })}
                            >
                                <Flex align="center" justify="space-between">
                                    <Text fw={600} size="md" mt="md">
                                        Total de Donaciones
                                    </Text>
                                    <IconHeartHandshake size={24} /> {/* Ícono a la derecha del título */}
                                </Flex>
                                <Text mt="xs" c="dimmed" size="xl" fw={700} sx={{ fontSize: "2rem" }}>
                                    500 {/* Número más grande */}
                                </Text>
                            </Card>

                            {/* Card Users */}
                            <Card
                                shadow="sm"
                                padding="xl"
                                component="a"
                                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                target="_blank"
                                radius="md" // Rounded corners
                                withBorder // Adds a border
                                sx={(theme) => ({
                                    borderWidth: '2px', // Thicker border
                                    borderColor: theme.colors.gray[3], // Border color
                                })}
                            >
                                <Flex align="center" justify="space-between">
                                    <Text fw={600} size="md" mt="md">
                                        Total de Usuarios
                                    </Text>
                                    <IconUserFilled size={24} /> {/* Ícono a la derecha del título */}
                                </Flex>
                                <Text mt="xs" c="dimmed" size="xl" fw={700} sx={{ fontSize: "2rem" }}>
                                    {
                                        !usersCount ? <Loader color="violet" size="sm" /> : usersCount
                                    }
                                </Text>
                            </Card>

                            {/* Card Actives Campaigns */}
                            <Card
                                shadow="sm"
                                padding="xl"
                                component="a"
                                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                target="_blank"
                                radius="md" // Rounded corners
                                withBorder // Adds a border
                                sx={(theme) => ({
                                    borderWidth: '2px', // Thicker border
                                    borderColor: theme.colors.gray[3], // Border color
                                })}
                            >
                                <Flex align="center" justify="space-between">
                                    <Text fw={600} size="md" mt="md">
                                        Campañas Activas
                                    </Text>
                                    <IconActivity size={24} /> {/* Ícono a la derecha del título */}
                                </Flex>
                                <Text mt="xs" c="dimmed" size="xl" fw={700} sx={{ fontSize: "2rem" }}>
                                    {
                                        !activeCampaignsCount ? <Loader color="violet" size="sm" /> : activeCampaignsCount
                                    }
                                </Text>
                            </Card>

                            {/* Card Finish Campaigns */}
                            <Card
                                shadow="sm"
                                padding="xl"
                                component="a"
                                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                target="_blank"
                                radius="md" // Rounded corners
                                withBorder // Adds a border
                                sx={(theme) => ({
                                    borderWidth: '2px', // Thicker border
                                    borderColor: theme.colors.gray[3], // Border color
                                })}
                            >
                                <Flex align="center" justify="space-between">
                                    <Text fw={600} size="md" mt="md">
                                        Campañas Finalizadas
                                    </Text>
                                    <IconArchiveFilled size={24} /> {/* Ícono a la derecha del título */}
                                </Flex>
                                <Text mt="xs" c="dimmed" size="xl" fw={700} sx={{ fontSize: "2rem" }}>
                                    {
                                        !finishCampaignsCount ? <Loader color="violet" size="sm" /> : finishCampaignsCount
                                    }
                                </Text>
                            </Card>

                        </SimpleGrid>
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
