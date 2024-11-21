/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { CampaignCard } from "../components";
import HeroSection from "../sections/Home/HeroSection";
import { Box, BoxProps, Button, Container, Flex, SimpleGrid, Stack } from "@mantine/core";
import LoadingSpinner from "../components/LoadingSpinner";
import { getCampaignsByType } from "../firebase/services/CampaignServices";
import EmptyState from "../components/EmptyState";

const Campaignspage = (): JSX.Element => {
    // State to store campaigns, loading status, filter type, etc.
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"cause" | "experience">("cause"); // Default filter
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastDoc, setLastDoc] = useState<any>(null); // Last fetched document for pagination
    const [hasMore, setHasMore] = useState(true); // Flag to check if more campaigns are available
    const [displayCount, setDisplayCount] = useState(3); // Number of campaigns to display

    // Using useRef to cache campaigns for both types (cause and experience)
    const campaignCache = useRef<{ cause: any[]; experience: any[] }>({
        cause: [],
        experience: [],
    });

    // Box properties for styling
    const boxProps: BoxProps = {
        mt: 36,
        mb: 0,
        py: 48
    }

    // Function to fetch campaigns based on the filter type
    const fetchCampaigns = async (filterType: "cause" | "experience", loadMore = false) => {
        // Set loading state based on whether we are loading more campaigns
        if (loadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            // Fetch campaigns from the service
            const { campaigns: newCampaigns, lastVisible } = await getCampaignsByType(filterType, lastDoc);
            if (newCampaigns.length === 0) {
                setHasMore(false); // Disable loading more if no campaigns are returned
            } else {
                // Update the cache with new campaigns
                campaignCache.current[filterType] = loadMore
                    ? [...campaignCache.current[filterType], ...newCampaigns]
                    : newCampaigns;

                setLastDoc(lastVisible); // Update the last visible document for pagination
                // Update the displayed campaigns based on the current filter
                setCampaigns(campaignCache.current[filter]);
            }
        } catch (error) {
            console.error("Failed to fetch campaigns: ", error); // Log error if fetching fails
        } finally {
            // Reset loading state after fetching
            if (loadMore) {
                setLoadingMore(false);
            } else {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        // Effect to prefetch campaigns for both types when the component mounts
        const preFetchData = async () => {
            await Promise.all([
                fetchCampaigns("experience"),
                fetchCampaigns("cause"),
            ]);
        };
        preFetchData(); // Invoke pre-fetching
    }, []);

    // Effect to reset campaigns and related states when filter changes
    useEffect(() => {
        setCampaigns(campaignCache.current[filter]); // Update campaigns based on selected filter
        setDisplayCount(3); // Reset display count
        setHasMore(true); // Reset has more flag
        setLastDoc(null); // Reset last document
    }, [filter]);

    // Function to load more campaigns when the button is clicked
    const loadMoreCampaigns = () => {
        if (hasMore) {
            const newDisplayCount = displayCount + 3; // Increase count for next load
            setDisplayCount(newDisplayCount); // Update display count

            const totalItems = campaignCache.current[filter].length; // Get total items in cache

            // Check if the current displayed items reach the total
            if (newDisplayCount >= totalItems) {
                setHasMore(false); // Hide button if no more items are available
            }
        }
    };

    // Mapping campaigns to CampaignCard components
    const items = campaigns.slice(0, displayCount).map((c) => (
        <CampaignCard key={c.id} data={c} showActions={true} />
    ));

    const subtitle = filter === "cause"
        ? "Las causas son iniciativas que buscan generar un impacto positivo en la sociedad y el medio ambiente."
        : "Las experiencias son eventos o actividades que permiten a las personas vivir momentos significativos y memorables.";


    return (
        <>
            <>
                {/* <HeroSection title="Nuestros proyectos" /> Render HeroSection with title */}
                <HeroSection
                    title={filter === "cause" ? "Causas" : "Experiencias"}
                    subtitle={subtitle}
                /> {/* Dynamic title based on filter */}

                <Box
                    sx={{
                        ...boxProps.sx,
                        width: '100vw', // Full viewport width
                        position: 'relative',
                        left: '50%',
                        right: '50%',
                        marginLeft: '-50vw',
                        marginRight: '-50vw',
                        backgroundColor: '#FFF', // White background
                    }}
                >
                    <Container size="lg"> {/* Container for content */}
                        <Stack>
                            <Box {...boxProps}>
                                <Flex justify="start" gap={8} style={{ marginBottom: 10 }}>
                                    {/* Filter buttons for cause and experience */}
                                    <Button
                                        variant={filter === "cause" ? "filled" : "default"}
                                        onClick={() => setFilter("cause")} // Set filter to cause
                                    >
                                        Causas
                                    </Button>
                                    <Button
                                        variant={filter === "experience" ? "filled" : "default"}
                                        onClick={() => setFilter("experience")} // Set filter to experience
                                    >
                                        Experiencias
                                    </Button>
                                </Flex>
                                {loading ? (
                                    <LoadingSpinner position={'start'} /> // Show loading spinner if loading
                                ) : (campaigns.length > 0) ? (
                                    <div className="animate__animated animate__fadeIn animate__fast">
                                        <SimpleGrid
                                            cols={3}
                                            spacing="lg"
                                            breakpoints={[
                                                { maxWidth: 'md', cols: 2, spacing: 'md' },
                                                { maxWidth: 'sm', cols: 1, spacing: 0 },
                                            ]}
                                        >
                                            {items} {/* Render campaign cards */}
                                        </SimpleGrid>
                                        {hasMore && !loadingMore && (
                                            <Button onClick={loadMoreCampaigns} mt="lg">
                                                Cargar más {/* Button to load more campaigns */}
                                            </Button>
                                        )}
                                        {loadingMore && <LoadingSpinner position={"start"} />} {/* Show spinner if loading more */}
                                    </div>
                                ) : (
                                    <EmptyState title="No hay campañas disponibles" description="En este momento no podemos mostrarte nuestras campañas. Intentalo más tarde." /> // Reemplazo del mensaje
                                )}
                            </Box>
                        </Stack>
                    </Container>
                </Box>
            </>
        </>
    );
};

export default Campaignspage;