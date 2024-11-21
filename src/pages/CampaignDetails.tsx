/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
    Accordion,
    ActionIcon,
    Box,
    BoxProps,
    Button,
    Card,
    Container,
    Divider,
    Flex,
    Grid,
    Paper,
    PaperProps,
    Progress,
    Stack,
    Text,
    TextProps,
    Title,
    TitleProps
} from "@mantine/core";
import { IconShare } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { BackButton, DonationDrawer, ShareModal, UserCard } from "../components";
import { Helmet } from "react-helmet";
import { Campaign } from "../interfaces/Campaign";
import { getCampaign } from "../firebase/services/CampaignServices";
import { formattingToCLPNumber } from "../helpers/formatCurrency";
import { calculatePercentage, calculatePercentageString } from '../helpers/percentageCampaign';
import LoadingSpinner from "../components/LoadingSpinner";
import { AuthContext } from "../context/auth/AuthContext";
import GiversLayout from "../layout/GiversLayout";
import GiversLayoutGuest from "../layout/GiversLayoutGuest";
import { Carousel } from "@mantine/carousel";

const CampaignDetailsPage = (): JSX.Element => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [donateOpened, { open: donateOpen, close: donateClose }] = useDisclosure(false);
    const matchesMobile = useMediaQuery('(max-width: 768px)');

    const paperProps: PaperProps = {
        p: "md",
        shadow: "sm",
    }

    const titleProps: TitleProps = {
        size: 32,
        weight: 700,
        transform: 'capitalize',
        sx: { lineHeight: '40px' }
    }

    const subTitleProps: TextProps = {
        size: 20,
        weight: 600,
        sx: { lineHeight: '28px' }
    }

    const iconSize = 18;

    const boxProps: BoxProps = {
        mt: 24,
        mb: 0,
        py: 48
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedCampaign = await getCampaign(id!);
                if (fetchedCampaign) {
                    setCampaign(fetchedCampaign);
                } else {
                    setError("Campaign not found");
                }
            } catch (error) {
                console.error("Failed to fetch campaign: ", error);
                setError("An error occurred while fetching the campaign.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return <LoadingSpinner position="center" />;
    }

    if (error) {
        return <Text color="red" align="center">{error}</Text>;
    }

    return user ? (
        <GiversLayout>
            <Helmet>
                <title>{campaign?.name}</title>
            </Helmet>
            <Box mt={24} py={48}>
                {campaign ? (
                    <Container size="lg">
                        <BackButton mt="xl" />
                        <Grid>
                            <Grid.Col lg={8}>
                                <Stack>
                                    <Card padding="md" shadow="sm">
                                        <Card.Section>
                                            <Carousel
                                                withIndicators
                                                height={480}
                                                slideSize="100%"
                                                align="start"
                                            >
                                                <Carousel.Slide>
                                                    <iframe
                                                        width="100%"
                                                        height="100%"
                                                        src={campaign.isFinished ? campaign.endVideo : campaign.initVideo}
                                                        title={`Video campaign ${campaign.name}`}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                        allowFullScreen
                                                    />
                                                </Carousel.Slide>
                                            </Carousel>
                                        </Card.Section>
                                        <Stack mt="md">
                                            <Title>{campaign?.name}</Title>
                                            <Text size="sm">{campaign?.description}</Text>
                                            {matchesMobile && (
                                                <>
                                                    <Divider />
                                                    <Flex align="flex-end" gap="sm">
                                                        <Title align="center">{formattingToCLPNumber(campaign?.cumulativeAmount || 0)}</Title>
                                                        <Text fw={500} align="center" color="dimmed">
                                                            Meta {formattingToCLPNumber(campaign?.requestAmount || 0)}
                                                        </Text>
                                                    </Flex>
                                                    <Progress value={calculatePercentageString(campaign?.requestAmount?.toString() || "0", campaign?.cumulativeAmount?.toString() || "0")} size="md" />
                                                    <Flex justify="space-between">
                                                        <Text fw={500}>
                                                            {calculatePercentage(campaign?.requestAmount || 0, campaign?.cumulativeAmount || 0)} % Reunido
                                                        </Text>
                                                        <Text fw={500}>{campaign?.donorsCount || 0} Donadores</Text>
                                                    </Flex>
                                                    <Flex align="center" gap="xs">
                                                        <Button onClick={donateOpen} fullWidth>Donar</Button>
                                                        <ActionIcon variant="subtle" onClick={open} color="blue" title="Share with your friends" size="lg">
                                                            <IconShare size={18} />
                                                        </ActionIcon>
                                                    </Flex>
                                                </>
                                            )}
                                        </Stack>
                                    </Card>
                                    <Paper p="md" shadow="sm">
                                        <Text mb="sm">Organizador</Text>
                                        <UserCard responsibleData={campaign?.foundation || {}} />
                                    </Paper>
                                    <Paper p="md" shadow="sm">
                                        <Text>Creado el {campaign?.createdAt ? new Date(campaign.createdAt.seconds * 1000).toLocaleDateString() : "Desconocido"}</Text>
                                    </Paper>
                                </Stack>
                            </Grid.Col>
                            <Grid.Col lg={4}>
                                <Stack>
                                    {!matchesMobile && (
                                        <Paper p="md" shadow="sm">
                                            <Stack spacing="sm">
                                                <Title align="center">{formattingToCLPNumber(campaign?.cumulativeAmount || 0)} recaudados</Title>
                                                <Text fw={500} align="center" color="dimmed">
                                                    Meta {formattingToCLPNumber(campaign?.requestAmount || 0)}
                                                </Text>
                                                <Progress value={calculatePercentageString(campaign?.requestAmount?.toString() || "0", campaign?.cumulativeAmount?.toString() || "0")} size="md" />
                                                <Flex justify="space-between">
                                                    <Text fw={500}>{calculatePercentage(campaign?.requestAmount || 0, campaign?.cumulativeAmount || 0)}% Reunido</Text>
                                                    <Text fw={500}>{campaign?.donorsCount || 0} Donadores</Text>
                                                </Flex>
                                                <Button size="xl" onClick={donateOpen}>Donar</Button>
                                                <Button leftIcon={<IconShare size={18} />} variant="outline" onClick={open} color="blue">
                                                    Compartir con tus amigos
                                                </Button>
                                            </Stack>
                                        </Paper>
                                    )}
                                    <Paper p="md" shadow="sm">
                                        <Text mb="md">Donación FAQ</Text>
                                        <Accordion defaultValue="customization" variant="separated">
                                            <Accordion.Item value="customization">
                                                <Accordion.Control>¿Cuándo recibirá el publicante mi pago?</Accordion.Control>
                                                <Accordion.Panel>Su pago se envía directamente al publicante para que ayude inmediatamente a su campaña.</Accordion.Panel>
                                            </Accordion.Item>
                                            <Accordion.Item value="flexibility">
                                                <Accordion.Control>¿Qué tan seguro es el proceso de pago?</Accordion.Control>
                                                <Accordion.Panel>Los pagos se realizan en un entorno seguro. Usamos Webpay Transbank para proteger su información.</Accordion.Panel>
                                            </Accordion.Item>
                                        </Accordion>
                                    </Paper>
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    </Container>
                ) : (
                    <LoadingSpinner position="center" />
                )}
                <ShareModal opened={opened} onClose={close} campaign={campaign} iconSize={18} />
                <DonationDrawer campaign={campaign} opened={donateOpened} onClose={donateClose} iconSize={18} />
            </Box>
        </GiversLayout>
    ) : (
        <GiversLayoutGuest>
            <Helmet>
                <title>{campaign?.name}</title>
            </Helmet>
            <Box  {...boxProps}>
                {campaign ? <Container size="lg">
                    <BackButton mt="xl" />
                    <Grid>
                        <Grid.Col lg={8}>
                            <Stack>
                                <Card padding="md" shadow="sm">
                                    <Card.Section>
                                        <Carousel
                                            withIndicators
                                            height={480} // Ajusta la altura del carrusel
                                            slideSize="100%" // Asegúrate de que las imágenes ocupen todo el ancho
                                            align="start" // Alinea las imágenes al inicio
                                        >
                                            <Carousel.Slide>
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src="https://www.youtube.com/embed/fJ9rUzIMcZQ"
                                                    title="What is Givers?"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    allowFullScreen
                                                />
                                            </Carousel.Slide>
                                        </Carousel>
                                    </Card.Section>
                                    <Stack mt="md">
                                        <Title>{campaign?.name}</Title>
                                        <Text {...subTitleProps}>Nuestra historia</Text>
                                        <Text size="sm">{campaign?.description}</Text>
                                        {matchesMobile && <>
                                            <Divider />
                                            <Flex align="flex-end" gap="sm">
                                                <Title {...titleProps} align="center">{campaign?.cumulativeAmount}</Title>
                                                <Text fw={500} align="center" color="dimmed">Meta {formattingToCLPNumber(campaign?.requestAmount)}</Text>
                                            </Flex>
                                            <Progress value={calculatePercentageString(campaign.requestAmount.toString(), campaign.cumulativeAmount.toString())} size="md" />
                                            <Flex justify="space-between">
                                                <Text fw={500}>{calculatePercentage(campaign.requestAmount, campaign.cumulativeAmount)} % Reunido</Text>
                                                <Text fw={500}>{campaign?.donorsCount} Donadores</Text>
                                            </Flex>
                                            <Flex align="center" gap="xs">
                                                <Button onClick={donateOpen} fullWidth>Donar</Button>
                                                <ActionIcon
                                                    variant="subtle"
                                                    onClick={open}
                                                    color="blue"
                                                    title="Share with your friends"
                                                    size="lg"
                                                >
                                                    <IconShare size={iconSize} />
                                                </ActionIcon>
                                            </Flex>
                                        </>}
                                    </Stack>
                                </Card>
                                <Paper {...paperProps}>
                                    <Text {...subTitleProps} mb="sm">Organizador</Text>
                                    <UserCard responsibleData={campaign.foundation} />
                                </Paper>
                                <Paper {...paperProps}>
                                    <Text>Creado el {new Date(campaign.createdAt.seconds * 1000).toLocaleDateString()}</Text>
                                </Paper>
                            </Stack>
                        </Grid.Col>
                        <Grid.Col lg={4}>
                            <Stack>
                                {!matchesMobile &&
                                    <Paper {...paperProps}>
                                        <Stack spacing="sm">
                                            <Title {...titleProps} align="center">{formattingToCLPNumber(campaign?.cumulativeAmount)} recaudados</Title>
                                            <Text fw={500} align="center" color="dimmed">Meta {formattingToCLPNumber(campaign?.requestAmount)}</Text>
                                            <Progress value={calculatePercentageString(campaign.requestAmount.toString(), campaign.cumulativeAmount.toString())} size="md" />
                                            <Flex justify="space-between">
                                                <Text fw={500}>{calculatePercentage(campaign.requestAmount, campaign.cumulativeAmount)}% Reunido</Text>
                                                <Text fw={500}>{campaign?.donorsCount} Donadores</Text>
                                            </Flex>
                                            <Button size="xl" onClick={donateOpen}>Donar</Button>
                                            <Button
                                                leftIcon={<IconShare size={iconSize} />}
                                                variant="outline"
                                                onClick={open}
                                                color="blue"
                                            >
                                                Compartir con tus amigos
                                            </Button>
                                        </Stack>
                                    </Paper>
                                }
                                <Paper {...paperProps}>
                                    <Text {...subTitleProps} mb="md">Donacion FAQ</Text>
                                    <Accordion defaultValue="customization" variant="separated">
                                        <Accordion.Item value="customization">
                                            <Accordion.Control>¿Cuándo recibirá el publicante mi
                                                pago?</Accordion.Control>
                                            <Accordion.Panel>Su pago se envía directamente al publicante para que inmediatamente
                                                ayude a
                                                su campaña.</Accordion.Panel>
                                        </Accordion.Item>

                                        <Accordion.Item value="flexibility">
                                            <Accordion.Control>¿Qué tan seguro es el proceso de pago?</Accordion.Control>
                                            <Accordion.Panel>
                                                Los pagos se realizan en un entorno altamente seguro. Usamos Webpay Transbank para mantener su información segura</Accordion.Panel>
                                        </Accordion.Item>
                                    </Accordion>
                                </Paper>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Container> : <LoadingSpinner position="center" />}
                <ShareModal opened={opened} onClose={close} campaign={campaign} iconSize={iconSize} />
                <DonationDrawer campaign={campaign} opened={donateOpened} onClose={donateClose} iconSize={iconSize} />
            </Box>
        </GiversLayoutGuest>
    );
};

export default CampaignDetailsPage;
