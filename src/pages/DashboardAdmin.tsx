/**
 * DashboardAdminPage
 *
 * This is the administration dashboard page for Givers. It allows users with an admin profile
 * to view key metrics such as user count, active campaigns, pending campaigns for approval, and completed campaigns.
 * It also provides interfaces for managing campaigns and foundations.
 */

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
    IconBrowserCheck,
    IconBuildingStore,
    IconClockCheck,
    IconPlus,
    IconSquareArrowUp,
    IconUser
} from "@tabler/icons-react";
import { CampaignsTable } from "../components";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import GiversLayout from "../layout/GiversLayout";
import { useContext } from "react";
import { AuthContext } from "../context/auth/AuthContext";
import FoundationsTable from "../components/FoundationsTable";
import useAdminDashboardData from "../hooks/useAdminDashboardData";

const DashboardAdminPage = () => {
    // Retrieve user data from AuthContext
    const { user } = useContext(AuthContext);

    // Get dashboard data and loading states using the custom hook useAdminDashboardData
    const {
        usersCount,
        foundationsCount,
        pendingApprovedCampaignsCount,
        activeCampaignsCount,
        executedCampaignsCount,
        finishCampaignsCount,
        loading,
        error,
    } = useAdminDashboardData();

    // Props configuration for the Paper components
    const paperProps: PaperProps = {
        p: "md",
        shadow: "sm"
    };

    // Props configuration for the Subtitle components
    const subTitleProps: TitleProps = {
        size: 18,
        mb: "sm"
    };

    // Conditional link props for pending campaigns (only for Admin profile)
    const linkProps = (user.profile === "Admin") && { to: "/admin/pending-campaigns" };
    const linkPropsManagement = (user.profile === "Admin") && { to: "/admin/management-users" };

    return (
        <GiversLayout>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <Box>
                <Container fluid my="xl">
                    <Stack spacing="xl">
                        {/* Greeting message displaying the user's name */}
                        <Title order={3}>Hola, {user.name}</Title>

                        {/* Grid displaying key metrics as cards */}
                        <SimpleGrid
                            cols={3}
                            spacing="lg"
                            breakpoints={[
                                { maxWidth: 'lg', cols: 3 },
                                { maxWidth: 'md', cols: 2 },
                                { maxWidth: 'sm', cols: 2 },
                                { maxWidth: 'xs', cols: 1 },
                            ]}
                        >
                            {/* Display an error message if loading the dashboard data fails */}
                            {error && <Text color="red">{error}</Text>}

                            {/* Card showing the total user count */}
                            <Card
                                shadow="sm"
                                padding="xl"
                                component={Link}
                                {...linkPropsManagement}
                                radius="md"
                                withBorder
                                sx={(theme) => ({
                                    borderWidth: '2px',
                                    borderColor: theme.colors.gray[3],
                                })}
                            >
                                <Flex align="center" justify="space-between">
                                    <Text fw={600} size="md" mt="md">Total Usuarios</Text>
                                    <IconUser size={24} />
                                </Flex>
                                <Text mt="xs" c="dimmed" size="xl" fw={700} sx={{ fontSize: "2rem" }}>
                                    {loading ? <Loader color="violet" size="sm" /> : usersCount}
                                </Text>
                            </Card>

                            {/* Card showing the total foundation count */}
                            <Card
                                shadow="sm"
                                padding="xl"
                                component={Link}
                                {...linkPropsManagement}
                                radius="md"
                                withBorder
                                sx={(theme) => ({
                                    borderWidth: '2px',
                                    borderColor: theme.colors.gray[3],
                                })}
                            >
                                <Flex align="center" justify="space-between">
                                    <Text fw={600} size="md" mt="md">Total Fundaciones</Text>
                                    <IconBuildingStore size={24} />
                                </Flex>
                                <Text mt="xs" c="dimmed" size="xl" fw={700} sx={{ fontSize: "2rem" }}>
                                    {loading ? <Loader color="violet" size="sm" /> : foundationsCount}
                                </Text>
                            </Card>

                            {/* Card showing the count of campaigns pending approval */}
                            <Card
                                shadow="sm"
                                padding="xl"
                                component={Link}
                                {...linkProps}
                                radius="md"
                                withBorder
                                sx={(theme) => ({
                                    borderWidth: '2px',
                                    borderColor: theme.colors.gray[3],
                                })}
                            >
                                <Flex align="center" justify="space-between">
                                    <Text fw={600} size="md" mt="md">Campañas Pendientes de Aprobación</Text>
                                    <IconClockCheck size={24} />
                                </Flex>
                                <Text mt="xs" c="dimmed" size="xl" fw={700} sx={{ fontSize: "2rem" }}>
                                    {loading ? <Loader color="violet" size="sm" /> : pendingApprovedCampaignsCount}
                                </Text>
                            </Card>

                            {/* Card showing the count of active campaigns */}
                            <Card
                                shadow="sm"
                                padding="xl"
                                component="a"
                                radius="md"
                                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Example link
                                target="_blank"
                                withBorder
                                sx={(theme) => ({
                                    borderWidth: '2px',
                                    borderColor: theme.colors.gray[3],
                                })}
                            >
                                <Flex align="center" justify="space-between">
                                    <Text fw={600} size="md" mt="md">Campañas Activas</Text>
                                    <IconSquareArrowUp size={24} />
                                </Flex>
                                <Text mt="xs" c="dimmed" size="xl" fw={700} sx={{ fontSize: "2rem" }}>
                                    {loading ? <Loader color="violet" size="sm" /> : activeCampaignsCount}
                                </Text>
                            </Card>

                            {/* Card showing the count of execute campaigns */}
                            <Card
                                shadow="sm"
                                padding="xl"
                                component="a"
                                radius="md"
                                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Example link
                                target="_blank"
                                withBorder
                                sx={(theme) => ({
                                    borderWidth: '2px',
                                    borderColor: theme.colors.gray[3],
                                })}
                            >
                                <Flex align="center" justify="space-between">
                                    <Text fw={600} size="md" mt="md">Campañas En Ejecución</Text>
                                    <IconActivity size={24} />
                                </Flex>
                                <Text mt="xs" c="dimmed" size="xl" fw={700} sx={{ fontSize: "2rem" }}>
                                    {loading ? <Loader color="violet" size="sm" /> : executedCampaignsCount}
                                </Text>
                            </Card>

                            {/* Card showing the count of finished campaigns */}
                            <Card
                                shadow="sm"
                                padding="xl"
                                component="a"
                                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Example link
                                target="_blank"
                                radius="md"
                                withBorder
                                sx={(theme) => ({
                                    borderWidth: '2px',
                                    borderColor: theme.colors.gray[3],
                                })}
                            >
                                <Flex align="center" justify="space-between">
                                    <Text fw={600} size="md" mt="md">Campañas Completadas</Text>
                                    <IconBrowserCheck size={24} />
                                </Flex>
                                <Text mt="xs" c="dimmed" size="xl" fw={700} sx={{ fontSize: "2rem" }}>
                                    {loading ? <Loader color="violet" size="sm" /> : finishCampaignsCount}
                                </Text>
                            </Card>
                        </SimpleGrid>

                        {/* Campaigns management section */}
                        <Paper {...paperProps}>
                            <Card.Section mb="lg">
                                <Flex align="center" justify="space-between">
                                    <Box>
                                        <Title {...subTitleProps}>Campañas</Title>
                                        <Text size="sm">Gestiona tus Campañas</Text>
                                    </Box>
                                    <Button
                                        leftIcon={<IconPlus size={18} />}
                                        component={Link}
                                        to="/admin/create-campaign"
                                    >
                                        Crear Campaña
                                    </Button>
                                </Flex>
                            </Card.Section>
                            <Card.Section>
                                <CampaignsTable />
                            </Card.Section>
                        </Paper>

                        {/* Foundations management section */}
                        <Paper {...paperProps}>
                            <Card.Section mb="lg">
                                <Flex align="center" justify="space-between">
                                    <Box>
                                        <Title {...subTitleProps}>Fundaciones</Title>
                                        <Text size="sm">Gestiona las Organizaciones</Text>
                                    </Box>
                                    <Button
                                        leftIcon={<IconPlus size={18} />}
                                        component={Link}
                                        to="/admin/create-foundation"
                                    >
                                        Crear Organización
                                    </Button>
                                </Flex>
                            </Card.Section>
                            <Card.Section>
                                <FoundationsTable />
                            </Card.Section>
                        </Paper>
                    </Stack>
                </Container>
            </Box>
        </GiversLayout>
    );
};

export default DashboardAdminPage;
