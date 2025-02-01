/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Container, createStyles, rem, Title } from "@mantine/core";
import GiversLayout from "../../layout/GiversLayout";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import ManagementCampaignsWithStatusTable from "../../components/ManagementCampaignsWithStatusTable";

const useStyles = createStyles((theme) => ({
    title: {
        fontWeight: 700,
        fontSize: rem(36),
        letterSpacing: rem(-1),
        color: theme.black,
        textAlign: 'start',

        [theme.fn.smallerThan('md')]: {
            fontSize: rem(32),
        },

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(24),
            textAlign: 'left',
            fontWeight: 700,
            padding: 0,
        },
    },
}));

const ManagementExecuteCampaignsPage = () => {
    const { classes } = useStyles();
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
                <Title className={classes.title} order={1} mb="lg">Gestión de Campañas en Ejecución</Title>

                {/* Campaigns table with pagination and status toggle functionality */}
                <ManagementCampaignsWithStatusTable isExecutePage={true} isFinishedPage={false} status={true} />
            </Container>
        </GiversLayout>
    );
};

export default ManagementExecuteCampaignsPage;
