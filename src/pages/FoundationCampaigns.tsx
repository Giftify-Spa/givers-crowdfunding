/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Box,
    BoxProps,
    Container,
    SimpleGrid,
    Stack
} from "@mantine/core";
import { CampaignCard } from "../components";
import { getCampaignsWithFoundation } from "../firebase/services/CampaignServices";
import LoadingSpinner from "../components/LoadingSpinner";

const FoundationCampaignsPage = (): JSX.Element => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    console.log(id);
    const boxProps: BoxProps = {
        mt: 36,
        mb: 0,
        py: 48
    }

    useEffect(() => {

        const chargedCampaignsWithFoundation = async () => {
            try {
                const response = await getCampaignsWithFoundation(id);
                return response;
            } catch (error) {
                console.error("Error getting documents: ", error);
                throw error; // Re-lanza el error para que pueda ser capturado por el caller
            }
        };

        const fetchData = async () => {
            try {
                const campaigns = await chargedCampaignsWithFoundation();
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
    );
};

export default FoundationCampaignsPage;
