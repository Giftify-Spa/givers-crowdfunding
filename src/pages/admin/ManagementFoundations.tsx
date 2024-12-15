/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Container, Title } from "@mantine/core";
import GiversLayout from "../../layout/GiversLayout";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import ManagementFoundationsTable from "../../components/ManagementFoundationsTable";

const ManagementFoundationsPage = () => {
    const navigate = useNavigate();

    return (
        <GiversLayout>
            {/* Back Button to return to the previous page */}
            <Button
                onClick={() => navigate(-1)} 
                leftIcon={<IconArrowLeft size={16} />} 
                mb="lg" 
                variant="outline"
                sx={(theme) => ({
                    transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
                    '&:hover': {
                        backgroundColor: theme.colors.primary[6],
                        borderColor: theme.colors.primary[6],
                        color: theme.white,
                    },
                })}
            >
                Volver
            </Button>

            <Container>
                {/* Page title */}
                <Title order={1} mb="lg">Gestión de Fundaciones</Title>

                {/* Foundations table with pagination and status toggle functionality */}
                <ManagementFoundationsTable />
            </Container>
        </GiversLayout>
    );
};

export default ManagementFoundationsPage;
