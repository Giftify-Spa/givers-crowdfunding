/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Container, Title } from "@mantine/core";
import GiversLayout from "../../layout/GiversLayout";
import ManagementUsersTable from "../../components/ManagementUsersTable";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const ManagementUsersPage = () => {
    const navigate = useNavigate();

    return (
        <GiversLayout>
            {/* Back Button to return to the previous page */}
            <Button
                onClick={() => navigate(-1)} 
                leftIcon={<IconArrowLeft size={16} />} 
                mb="lg" 
                variant="outline"
            >
                Volver
            </Button>

            <Container>
                {/* Page title */}
                <Title order={1} mb="lg">Gestión de Usuarios</Title>

                {/* Users table with pagination and status toggle functionality */}
                <ManagementUsersTable />
            </Container>
        </GiversLayout>
    );
};

export default ManagementUsersPage;
