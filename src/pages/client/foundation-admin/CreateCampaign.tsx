import { Helmet } from "react-helmet";
import {
    Box,
    Button,
    Card,
    Checkbox,
    Container,
    Flex,
    NumberInput,
    Paper,
    PaperProps,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    Title,
    TitleProps,
    useMantineTheme
} from "@mantine/core";
import React, { useContext, useState } from "react";
import { CategorySelect, FileDropzone } from "../../../components";

import { Link as LinkRouter, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { IconCurrencyDollar } from "@tabler/icons-react";
import { addCampaign } from "../../../firebase/services/CampaignServices";
import GiversLayout from "../../../layout/GiversLayout";
import { AuthContext } from "../../../context/auth/AuthContext";
import { getYouTubeEmbedUrl } from "../../../helpers/getYoutubeEmbedUrl";
import { validationAdminFoundationCampaignSchema } from '../../../schemas/campaign/admin-foundation/createSchema';


const FoundationAdminCreateCampaignPage = () => {
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    const [formValues, setFormValues] = useState<{ name: string; description: string; requestAmount: number; category: string; initVideo: string; isCause: boolean; isExperience: boolean, multimediaCount: number }>({
        name: '',
        description: '',
        category: '',
        isCause: false,
        isExperience: false,
        requestAmount: 0,
        multimediaCount: 0,
        initVideo: '',
    });

    const [files, setFiles] = useState<File[]>([]);

    const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);

    const { id } = useParams<{ id: string }>();

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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    }

    const onCreateCampaign = async () => {
        const isValid = await isValidForm();

        try {
            if (isValid) {
                // Format data
                const campaignData = {
                    name: formValues.name,
                    description: formValues.description,
                    category: formValues.category,
                    foundation: user.foundation,
                    initVideo: getYouTubeEmbedUrl(formValues.initVideo),
                    isCause: formValues.isCause,
                    isExperience: formValues.isExperience,
                    requestAmount: formValues.requestAmount,
                    multimedia: files,
                    responsible: user.id,
                    createdBy: user.uid,
                }
                const response = await addCampaign(campaignData, "Client");

                if (!response.success) return setError('ocurrió un error al crear la fundación');

                // Redirect to dashboard
                navigate('/panel/dashboard');

            }
        } catch (e) {
            console.log(error);
        }
    }

    const isValidForm = async (): Promise<boolean> => {
        try {
            await validationAdminFoundationCampaignSchema.validate(formValues, { abortEarly: false });
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

    const updateHandleDrop = (dropFiles: File[]) => {
        setFiles(dropFiles)
        setFormValues({ ...formValues, multimediaCount: dropFiles.length })
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
                                <CategorySelect errorCategory={errorMessages.category} handleSelectCategory={updateCategory} />
                            </SimpleGrid>

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
                            <Stack spacing="sm">
                                <Title {...subTitleProps}>Contenido Multimedia</Title>
                                <FileDropzone
                                    label="Sube las fotos de tu campaña"
                                    description="Estas imágenes se mostrarán junto a su nombre"
                                    handleDropFile={updateHandleDrop}
                                />
                                {
                                    errorMessages.multimediaCount &&
                                    <Text color="red" size="sm">{errorMessages.multimediaCount}</Text>
                                }
                            </Stack>
                            <TextInput
                                label="Enlace vídeo inicial de campaña"
                                name="initVideo"
                                placeholder="https://www.youtube.com/embed/fJ9rUzIMcZQ"
                                value={formValues.initVideo}
                                onChange={handleChange}
                                error={errorMessages.initVideo}
                                style={{ marginTop: 20 }}
                                required
                            />
                        </Paper>

                        <Card.Section mb="lg">
                            <Flex align="center" justify="center">
                                <Button
                                    component={LinkRouter}
                                    to={`/panel/my-foundation/${id}`}
                                    style={{ marginRight: 20 }}
                                >
                                    Volver
                                </Button>

                                <Button
                                    to=""
                                    // leftIcon={<IconPlus size={18} />}
                                    component={LinkRouter}
                                    onClick={onCreateCampaign}
                                >
                                    Crear una campaña
                                </Button>
                            </Flex>
                        </Card.Section>
                    </div>
                </Container>
            </Box>
        </GiversLayout>
    );
};

export default FoundationAdminCreateCampaignPage;
