/* eslint-disable react-hooks/exhaustive-deps */
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
    TextInput,
    Title,
    TitleProps,
    useMantineTheme
} from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import { CategorySelect } from "../../components";

import { Link as LinkRouter, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FoundationSelect from "../../components/FoundationSelect";

import { IconCheck, IconCurrencyDollar } from "@tabler/icons-react";
import { getCampaign } from "../../firebase/services/campaigns/getCampaign";
import { editCampaign } from "../../firebase/services/campaigns/editCampaign";
import GiversLayout from "../../layout/GiversLayout";
import ResponsibleSelect from "../../components/ResponsibleSelect";
import { AuthContext } from "../../context/auth/AuthContext";
import { showNotification } from "@mantine/notifications";
import { validationEditCampaignSchema } from "../../schemas/campaign/admin/editSchema";

const EditCampaignPage = () => {


    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [formValues, setFormValues] = useState<{
        name: string;
        description: string;
        requestAmount: number;
        category: string;
        foundation: string;
        responsible: string;
        initVideo: string;
        isCause: boolean;
        isExperience: boolean
    }>({
        name: '',
        description: '',
        category: '',
        foundation: '',
        responsible: '',
        initVideo: '',
        isCause: false,
        isExperience: false,
        requestAmount: 0,
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    }

    const onEditCampaign = async () => {
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
                    initVideo: formValues.initVideo,
                    isCause: formValues.isCause,
                    isExperience: formValues.isExperience,
                    requestAmount: formValues.requestAmount,
                    responsible: formValues.responsible,
                    createdBy: user.uid,
                }

                const response = await editCampaign(id, campaignData);

                if (!response.success) return setError('ocurrió un error al editar la campaña');

                // Show success notification
                showNotification({
                    title: 'Campaña Editada',
                    message: 'La campaña se ha editado exitosamente.',
                    color: 'green',
                    icon: <IconCheck size={18} />,
                });

                // Redirect to dashboard
                navigate('/panel/dashboard');
            }
        } catch (error) {
            setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    }

    const isValidForm = async (): Promise<boolean> => {
        try {
            await validationEditCampaignSchema.validate(formValues, { abortEarly: false });
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

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const campaign = await getCampaign(id);
                console.log(campaign);
                if (campaign && typeof campaign === 'object') {
                    setFormValues({
                        ...formValues,
                        name: campaign.name,
                        description: campaign.description,
                        initVideo: campaign.initVideo,
                        isCause: campaign.isCause,
                        isExperience: campaign.isExperience,
                        requestAmount: campaign.requestAmount,
                        category: campaign.category.id,
                        foundation: campaign.foundation.id,
                        responsible: campaign.responsible.id,
                    });
                }
            } catch (error) {
                setError("No se pudo cargar la campaña");
            }
        }
        fetchCampaign();
    }, [id])

    return (
        <GiversLayout>
            <Helmet>
                <title>Editar Campaña</title>
            </Helmet>
            <Box>
                <Container my={36}>
                    <Title mb="xl" align="center">Editar campaña - {formValues.name}</Title>

                    <div>
                        <Title {...titleProps}>Información Campaña</Title>
                        <Paper {...paperProps}>
                            <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]} style={{ marginBottom: 20 }}>
                                <TextInput
                                    label="Nombre"
                                    name="name"
                                    value={formValues.name}
                                    onChange={handleChange}
                                    error={errorMessages.name}
                                    required
                                />
                                <TextInput
                                    label="Descripción"
                                    name="description"
                                    value={formValues.description}
                                    onChange={handleChange}
                                    error={errorMessages.description}
                                    required
                                />
                                <CategorySelect value={formValues.category} errorCategory={errorMessages.category} handleSelectCategory={updateCategory} />
                                <FoundationSelect value={formValues.foundation} errorFoundation={errorMessages.foundation} handleSelectFoundation={updateFoundation} />
                            </SimpleGrid>

                            <ResponsibleSelect value={formValues.responsible} errorResponsible={errorMessages.responsible} handleSelectResponsible={updateResponsible} />

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
                                >
                                    Volver
                                </Button>

                                <Button
                                    to=""
                                    // leftIcon={<IconPlus size={18} />}
                                    component={LinkRouter}
                                    onClick={onEditCampaign}
                                >
                                    Editar campaña
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

export default EditCampaignPage;
