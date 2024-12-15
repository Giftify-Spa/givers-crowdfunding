/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Container, Title } from "@mantine/core";
import GiversLayout from "../../layout/GiversLayout";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import ManagementCampaignsWithStatusTable from "../../components/ManagementCampaignsWithStatusTable";

const ManagementActiveCampaignsPage = () => {
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
                <Title order={1} mb="lg">Gestión de Campañas Activas</Title>

                {/* Campaigns table with pagination and status toggle functionality */}
                <ManagementCampaignsWithStatusTable isExecutePage={false} isFinishedPage={false} status={true} />
            </Container>
        </GiversLayout>
    );
};

export default ManagementActiveCampaignsPage;
