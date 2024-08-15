import { Box, BoxProps, Container, createStyles, Flex, rem, Select, SimpleGrid, Stack, TextInput, Title } from "@mantine/core";
import { CampaignCard } from "../components";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { getCampaigns } from "../firebase/service";
import LoadingSpinner from "../components/LoadingSpinner";

const CampaignsPage = (): JSX.Element => {

    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);


    const matchesMobile = useMediaQuery('(max-width: 768px)');

    const boxProps: BoxProps = {
        mt: matchesMobile ? 4 : 24,
        mb: matchesMobile ? 4 : 48,
        py: matchesMobile ? 16 : 24
    }


    const useStyles = createStyles((theme) => ({
        title: {
            fontWeight: 800,
            fontSize: rem(36),
            letterSpacing: rem(-1),
            paddingLeft: theme.spacing.md,
            paddingRight: theme.spacing.md,
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
                const response = await getCampaigns(3);
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
                        <Title className={classes.title} align="center">Campañas que inspiran</Title>
                        <Flex
                            justify="space-between"
                            gap={{ base: 'sm', sm: 'lg' }}
                            direction={{ base: 'column-reverse', sm: 'row' }}
                        >
                            <TextInput placeholder="buscar campaña..." sx={{ width: 500 }} />
                            <Flex align="center" gap="sm" justify={{ base: 'space-between', sm: 'flex-start' }}>
                                <Select
                                    label=""
                                    placeholder="campaigns in"
                                    defaultValue=""
                                    data={[
                                        { value: '10', label: 'show: 10' },
                                        { value: '25', label: 'show: 25' },
                                        { value: '50', label: 'show: 50' },
                                        { value: '100', label: 'show: 100' },
                                    ]}
                                />
                            </Flex>
                        </Flex>
                        {
                            loading ? (
                                <LoadingSpinner />
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
    );
};

export default CampaignsPage;
