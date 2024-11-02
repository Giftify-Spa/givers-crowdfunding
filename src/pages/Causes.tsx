import { Box, BoxProps, Container, createStyles, rem, SimpleGrid, Stack, Title } from '@mantine/core';
import { CampaignCard } from "../components";
import { useEffect, useState } from "react";
import { getCampaignsWithCauses } from "../firebase/services/CampaignServices";
import LoadingSpinner from "../components/LoadingSpinner";
import HeroSection from '../sections/Home/HeroSection';

const CausesPage = (): JSX.Element => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    const boxProps: BoxProps = {
        mt: 36,
        mb: 0,
        py: 48
    }

    const useStyles = createStyles((theme) => ({
        title: {
            fontWeight: 800,
            fontSize: rem(36),
            letterSpacing: rem(-1),
            paddingLeft: theme.spacing.md,
            paddingRight: theme.spacing.md,
            marginBottom: 24,
            color: theme.black,
            textAlign: 'center',

            [theme.fn.smallerThan('md')]: {
                fontSize: rem(48),
            },

            [theme.fn.smallerThan('sm')]: {
                fontSize: rem(28),
                textAlign: 'left',
                fontWeight: 800,
                padding: 0,
                marginLeft: theme.spacing.md,
            },
        },
    }));


    useEffect(() => {

        const chargedCampaigns = async () => {
            try {
                const response = await getCampaignsWithCauses(0);
                return response;
            } catch (error) {
                console.error("Error getting documents: ", error);
                throw error; // Re-lanza el error para que pueda ser capturado por el caller
            }
        };

        const fetchData = async () => {
            try {
                const campaigns = await chargedCampaigns();
                setCampaigns(campaigns);
                setLoading(false);
            } catch (error) {
                // Manejar errores aquí, por ejemplo, establecer un estado de error
                console.error("Failed to fetch foundations: ", error);
            }
        };

        fetchData();

    }, []);

    const { classes } = useStyles();

    const items = campaigns.map(c => (<CampaignCard key={c.id} data={c} showActions={true} />))

    return (
        <>
            <HeroSection title="Causas" />
            <Box
                sx={{
                    ...boxProps.sx,
                    width: '100vw',
                    position: 'relative',
                    left: '50%',
                    right: '50%',
                    marginLeft: '-50vw',
                    marginRight: '-50vw',
                    backgroundColor: '#FFF',
                }}
            >
                <Container size="lg">
                    <Stack>

                        <Box {...boxProps}>
                            <Title className={classes.title} align="center">Causas que inspiran</Title>
                            {
                                loading ? (
                                    <LoadingSpinner position="center" />
                                ) : (
                                    <div className="animate__animated animate__fadeIn animate__fast">
                                        <SimpleGrid
                                            cols={3}
                                            spacing="lg"
                                            breakpoints={[
                                                { maxWidth: 'md', cols: 2, spacing: 'md' },
                                                { maxWidth: 'sm', cols: 1, spacing: 0 },
                                            ]}
                                        >
                                            {items}
                                        </SimpleGrid>
                                    </div>
                                )
                            }
                        </Box>
                    </Stack >
                </Container >
            </Box >
        </>
    );
};

export default CausesPage;
