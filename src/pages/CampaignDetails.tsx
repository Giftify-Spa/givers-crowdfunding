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
    Image,
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
import { getCampaign } from "../firebase/service";
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
    const [campaign, setCampaign] = useState<Campaign>();
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

    useEffect(() => {
        const searchCampaign = async () => {
            try {
                const response = await getCampaign(id);
                return response;
            } catch (error) {
                console.error("Error getting documents: ", error);
                throw error; // Re-lanza el error para que pueda ser capturado por el caller
            }
        };

        const fetchData = async () => {
            try {
                const campaign = await searchCampaign();
                setCampaign(campaign);
            } catch (error) {
                // Manejar errores aquí, por ejemplo, establecer un estado de error
                console.error("Failed to fetch foundations: ", error);
            }
        };

        fetchData();
    }, [id]);

    const boxProps: BoxProps = {
        mt: 24,
        mb: 0,
        py: 48
    }

    if (user) {
        return (
            <GiversLayout>
                <Helmet>
                    <title>{campaign?.name}</title>
                </Helmet>
                <Box {...boxProps}>
                    {campaign ? <Container size="lg">
                        <BackButton mt="xl" />
                        <Grid>
                            <Grid.Col lg={8}>
                                <Stack>
                                    <Card padding="md" shadow="sm">
                                        <Card.Section>
                                            <Image src={campaign.multimedia[0]} height={480} />
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
                                        <Button>
                                            <UserCard responsibleData={campaign.foundation} />
                                        </Button>
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
                                                <Accordion.Panel>Su pago se envía directamente a Dora para que inmediatamente
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
            </GiversLayout>
        );
    }

    return (
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
                                            <Carousel.Slide>
                                                <Image src={campaign.multimedia[0]} height={480} />
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
