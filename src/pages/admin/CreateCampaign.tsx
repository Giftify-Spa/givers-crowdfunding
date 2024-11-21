import { Helmet } from "react-helmet";
import {
    Box,
    Button,
    Card,
    Checkbox,
    Container,
    Flex,
    List,
    Loader,
    NumberInput,
    Overlay,
    Paper,
    PaperProps,
    SimpleGrid,
    Stack,
    Textarea,
    TextInput,
    Title,
    TitleProps,
    useMantineTheme
} from "@mantine/core";
import React, { useContext, useState } from "react";
import { CategorySelect } from "../../components";

import { Link as LinkRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FoundationSelect from "../../components/FoundationSelect";

import { IconCheck, IconCurrencyDollar } from "@tabler/icons-react";
import { addCampaign } from "../../firebase/services/CampaignServices";
import GiversLayout from "../../layout/GiversLayout";
import ResponsibleSelect from "../../components/ResponsibleSelect";
import { AuthContext } from "../../context/auth/AuthContext";
import { getYouTubeEmbedUrl } from "../../helpers/getYoutubeEmbedUrl";
import { showNotification } from "@mantine/notifications";
import { validationCampaignSchema } from "../../schemas/campaign/admin/createSchema";

const CreateCampaignPage = () => {
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    const [formValues, setFormValues] = useState<{ name: string; description: string; requestAmount: number; category: string; foundation: string; responsible: string; initVideo: string; isCause: boolean; isExperience: boolean }>({
        name: '',
        description: '',
        category: '',
        foundation: '',
        responsible: '',
        initVideo: '',
        isCause: false,
        isExperience: false,
        requestAmount: 0
    });

    const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);


    const theme = useMantineTheme()

    const titleProps: TitleProps = {
        size: 24,
        mb: "md"
    }

    const subTitleProps: TitleProps = {
        size: 18,
        mb: "sm"
    }

    const paperProps: PaperProps = {
        p: "md",
        withBorder: false,
        shadow: 'sm',
        mb: "md",
        sx: { backgroundColor: theme.white }
    }


    const updateCategory = (value: string) => {
        if (!value) return setFormValues({ ...formValues, category: '' });

        setFormValues({ ...formValues, category: value });
    }

    const updateFoundation = (value: string) => {
        if (!value) return setFormValues({ ...formValues, foundation: '' });

        setFormValues({ ...formValues, foundation: value });
    }

    const updateResponsible = (value: string) => {
        if (!value) return setFormValues({ ...formValues, responsible: '' });

        setFormValues({ ...formValues, responsible: value });
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.currentTarget;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    }

    const onCreateCampaign = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const isValid = await isValidForm();
            if (isValid) {
                // Format data
                const campaignData = {
                    name: formValues.name,
                    description: formValues.description,
                    category: formValues.category,
                    foundation: formValues.foundation,
                    isCause: formValues.isCause,
                    isExperience: formValues.isExperience,
                    requestAmount: formValues.requestAmount,
                    responsible: formValues.responsible,
                    createdBy: user.id,
                    initVideo: getYouTubeEmbedUrl(formValues.initVideo),
                }

                const response = await addCampaign(campaignData, "Admin");

                if (!response.success) return setError('ocurrió un error al crear la fundación');

                // Show success notification
                showNotification({
                    title: 'Campaña Creada',
                    message: 'La campaña se ha creado exitosamente.',
                    color: 'green',
                    icon: <IconCheck size={18} />,
                });

                // Redirect to dashboard
                navigate('/panel/dashboard');

            }
        } catch (e) {
            setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    }

    const isValidForm = async (): Promise<boolean> => {
        try {
            await validationCampaignSchema.validate(formValues, { abortEarly: false });
            return true;
        } catch (error) {
            const errors: Record<string, string> = {};
            error.inner.forEach((err) => {
                errors[err.path] = err.message;
            });
            setErrorMessages(errors);
            return false;
        }
    }


    return (
        <GiversLayout>
            <Helmet>
                <title>Crear Campaña</title>
            </Helmet>
            <Box>
                <Container my={36}>
                    <Title mb="xl" align="center">Crea tu campaña</Title>

                    <div>
                        <Title {...titleProps}>Información Campaña</Title>
                        <Paper {...paperProps}>
                            <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]} sx={{ marginBottom: 20 }}>
                                <TextInput
                                    label="Nombre"
                                    name="name"
                                    value={formValues.name}
                                    onChange={handleChange}
                                    error={errorMessages.name}
                                    disabled={isLoading}
                                    required
                                />

                                <ResponsibleSelect errorResponsible={errorMessages.responsible} handleSelectResponsible={updateResponsible} />
                                <CategorySelect errorCategory={errorMessages.category} handleSelectCategory={updateCategory} />
                                <FoundationSelect errorFoundation={errorMessages.foundation} handleSelectFoundation={updateFoundation} />
                            </SimpleGrid>


                            <Textarea
                                label="Descripción"
                                name="description"
                                value={formValues.description}
                                onChange={handleChange}
                                minRows={2}
                                maxRows={5}
                                error={errorMessages.description}
                                disabled={isLoading}
                                required
                            />

                            <SimpleGrid cols={2} style={{ marginTop: 25 }} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                                <Checkbox
                                    label="Es una causa?"
                                    name="isCause"
                                    checked={formValues.isCause}
                                    onChange={(event) => setFormValues({ ...formValues, isCause: event.currentTarget.checked })}
                                />
                                <Checkbox
                                    label="Es una experiencia?"
                                    name="isExperience"
                                    checked={formValues.isExperience}
                                    onChange={(event) => setFormValues({ ...formValues, isExperience: event.currentTarget.checked })}
                                />
                            </SimpleGrid>
                        </Paper>

                        <Paper {...paperProps}>
                            <Stack spacing="sm">
                                <Title {...subTitleProps}>Información de Donación</Title>
                                <Paper {...paperProps}>
                                    <Stack spacing="xs">
                                        <NumberInput
                                            label="Monto a recaudar"
                                            icon={<IconCurrencyDollar size={18} />}
                                            name="requestAmount"
                                            value={formValues.requestAmount}
                                            onChange={(value) => { setFormValues({ ...formValues, requestAmount: parseInt(String(value)) }) }}
                                            error={errorMessages.requestAmount}
                                            disabled={isLoading}
                                        />
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Paper>
                        <Paper {...paperProps}>
                            <Title {...subTitleProps}>Contenido Multimedia</Title>
                            <TextInput
                                label="Enlace vídeo inicial de campaña"
                                name="initVideo"
                                placeholder="https://www.youtube.com/embed/fJ9rUzIMcZQ"
                                value={formValues.initVideo}
                                onChange={handleChange}
                                error={errorMessages.initVideo}
                                style={{ marginTop: 20 }}
                                disabled={isLoading}
                                required
                            />
                        </Paper>

                        <Card.Section mb="lg">
                            <Flex align="center" justify="center">
                                <Button
                                    component={LinkRouter}
                                    to="/panel/dashboard"
                                    style={{ marginRight: 20 }}
                                    disabled={isLoading}
                                >
                                    Volver
                                </Button>

                                <Button
                                    to=""
                                    // leftIcon={<IconPlus size={18} />}
                                    component={LinkRouter}
                                    onClick={onCreateCampaign}
                                    disabled={isLoading}
                                >
                                    Crear una campaña
                                </Button>
                            </Flex>
                            {
                                error && (
                                    <List style={{ marginTop: 10 }}>
                                        <List.Item
                                            style={{ color: '#ad3838' }}
                                        >
                                            {error}
                                        </List.Item>
                                    </List>
                                )
                            }
                        </Card.Section>
                    </div>
                </Container>
                {isLoading && (
                    <Overlay
                        opacity={0.6}
                        color="#000"
                        zIndex={1000}
                        styles={{
                            root: {
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                            },
                        }}
                    >
                        <Flex justify="center" align="center" style={{ height: '100vh' }}>
                            <Loader size="xl" color="blue" />
                        </Flex>
                    </Overlay>
                )}
            </Box>
        </GiversLayout>
    );
};

export default CreateCampaignPage;
