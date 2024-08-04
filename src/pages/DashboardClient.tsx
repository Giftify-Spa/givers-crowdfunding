import {
    Box,
    Card,
    Container,
    Paper,
    PaperProps,
    Stack,
    Title,
    TitleProps
} from "@mantine/core";
import { DonatorsTable } from "../components";
import { Helmet } from "react-helmet";
import GiversLayout from "../layout/GiversLayout";
import { useContext} from "react";
import { AuthContext } from "../context/auth/AuthContext";

const DashboardClientPage = () => {

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

                        {/* User Donators Table */}
                        <Paper {...paperProps}>
                            <Card.Section>
                                <Title {...subTitleProps}>Listado de Donaciones Realizadas</Title>
                                <DonatorsTable />
                            </Card.Section>
                            <Card.Section></Card.Section>
                        </Paper>

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

export default DashboardClientPage;
