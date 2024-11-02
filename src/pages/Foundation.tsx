/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    Box,
    BoxProps,
} from "@mantine/core";
import { getFoundation } from "../firebase/services/FoundationServices";
import LoadingSpinner from "../components/LoadingSpinner";
import FoundationCampaignsPage from "./FoundationCampaigns";
import { Foundation } from "../interfaces/Foundation";
import ProfileSection from '../sections/Home/ProfileSection';

const FoundationPage = (): JSX.Element => {
    const { id } = useParams();
    const [foundation, setFoundation] = useState<Foundation>();
    const [loading, setLoading] = useState(true);

    const boxProps: BoxProps = {
        mt: 36,
        mb: 0,
        py: 48
    }

    useEffect(() => {
        const searchFoundation = async () => {
            try {
                const response = await getFoundation(id);
                return response;
            } catch (error) {
                console.error("Error getting documents: ", error);
                throw error; // Re-lanza el error para que pueda ser capturado por el caller
            }
        };

        const fetchData = async () => {
            try {
                const foundation = await searchFoundation();
                setFoundation(foundation);
                setLoading(false);
            } catch (error) {
                // Manejar errores aquí, por ejemplo, establecer un estado de error
                console.error("Failed to fetch foundations: ", error);
            }
        };

        fetchData();

    }, [id]);

    return (
        <>
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
                {
                    loading ? (
                        <LoadingSpinner position="center" />
                    ) : (
                        <>
                            <ProfileSection data={foundation} />
                            <FoundationCampaignsPage />
                        </>
                    )
                }
            </Box>
        </>
    );
};

export default FoundationPage;
