/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Container, createStyles, rem, Title } from "@mantine/core";
import GiversLayout from "../../layout/GiversLayout";
import ManagementUsersTable from "../../components/ManagementUsersTable";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

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

const ManagementUsersPage = () => {
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
            >
                Volver
            </Button>

            <Container>
                {/* Page title */}
                <Title className={classes.title} order={1} mb="lg">Gestión de Usuarios</Title>

                {/* Users table with pagination and status toggle functionality */}
                <ManagementUsersTable />
            </Container>
        </GiversLayout>
    );
};

export default ManagementUsersPage;
