import { Box, BoxProps, Container, Flex, Select, SimpleGrid, Stack, TextInput, Title, TitleProps } from "@mantine/core";
import { CampaignCard } from "../components";
import { Helmet } from "react-helmet";
import { useMediaQuery } from "@mantine/hooks";
import GiversLayoutGuest from "../layout/GiversLayoutGuest";
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

    const titleProps: TitleProps = {
        size: 32,
        weight: 700,
        mb: "lg",
        transform: 'capitalize',
        sx: { lineHeight: '40px' }
    }


    useEffect(() => {

        const chargedCampaigns = async () => {
            try {
                const response = await getCampaigns();
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

    const items = campaigns.map(c => (<CampaignCard key={c.id} data={c} showActions={true} />))

    return (
        <GiversLayoutGuest>
            <Helmet>
                <title>Descubra campañas para financiar</title>
            </Helmet>
            {
                loading ? (
                    <LoadingSpinner />
                ) : (
                    <Box>
                        <Container size="lg">
                            <Stack>
                                <Box {...boxProps}>
                                    <Title {...titleProps} align="center">Descubra campañas para financiar</Title>
                                </Box>
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
                            </Stack >
                        </Container >
                    </Box >
                )
            }
        </GiversLayoutGuest >
    );
};

export default CampaignsPage;
