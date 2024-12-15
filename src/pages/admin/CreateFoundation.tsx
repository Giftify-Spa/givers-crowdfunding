import { Helmet } from "react-helmet";
import {
    Box,
    Button,
    Card,
    Container,
    Flex,
    Paper,
    PaperProps,
    SimpleGrid,
    Stack,
    Loader,
    Overlay,
    Text,
    Textarea,
    TextInput,
    Title,
    TitleProps,
    useMantineTheme,
    List
} from "@mantine/core";
import { useState } from "react";

import {
    IconCheck,
    IconPlus
} from "@tabler/icons-react";
import { CountrySelect, FileDropzone } from "../../components";

import { Link as LinkRouter, useNavigate } from "react-router-dom";

import GooglePlace from "../../components/Place";
import ConfidenceSelect from "../../components/ConfidenceSelect";

import { addFoundation } from "../../firebase/services/FoundationServices";
import ResponsibleSelect from "../../components/ResponsibleSelect";
import GiversLayout from "../../layout/GiversLayout";
import { showNotification } from "@mantine/notifications";
import { validationAdminCreateFoundationSchema } from "../../schemas/foundation/admin/createSchema";

const CreateFoundationPage = () => {

    const [formValues, setFormValues] = useState<{ name: string; description: string; country: string; city: string; address: string; lat: string; lng: string; confidenceLevel: number; fono: string; responsible: string; multimediaCount: number; }>({
        name: '',
        description: '',
        country: '',
        city: '',
        address: '',
        lat: '',
        lng: '',
        confidenceLevel: 0,
        fono: '',
        responsible: '',
        multimediaCount: 0,
    });

    const [files, setFiles] = useState<File[]>([]);

    const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);

    const [countrySelect, setCountrySelect] = useState<string>('');

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
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

    const handleSelectCountry = (name: string) => {
        setCountrySelect(name);
        setFormValues({ ...formValues, country: name });
    }

    const updateAddressReferences = (name: string, lat: string, lng: string) => {
        setFormValues({ ...formValues, address: name, lat: lat, lng: lng });
    }

    const updateConfidenceLevel = (value: string) => {
        if (!value) return setFormValues({ ...formValues, confidenceLevel: 0 });

        setFormValues({ ...formValues, confidenceLevel: parseInt(value) });
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

    const onCreateFoundation = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const isValid = await isValidForm();
            if (isValid) {
                // Format data
                const foundationData = {
                    name: formValues.name,
                    description: formValues.description,
                    country: countrySelect,
                    city: formValues.city,
                    address: formValues.address,
                    lat: formValues.lat,
                    lng: formValues.lng,
                    confidenceLevel: formValues.confidenceLevel,
                    fono: formValues.fono,
                    multimedia: files,
                    responsible: formValues.responsible,
                }

                const response = await addFoundation(foundationData);

                if (!response.success) return setError('ocurrió un error al crear la fundación');

                // Show success notification
                showNotification({
                    title: 'Fundación Creada',
                    message: 'La fundación se ha creado exitosamente.',
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
            await validationAdminCreateFoundationSchema.validate(formValues, { abortEarly: false });
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
                <title>Crear Fundación</title>
            </Helmet>
            <Box>
                <Container my={36}>
                    <Title mb="xl" align="center">Crea una fundación</Title>

                    <div>
                        <Title {...titleProps}>Información Fundación</Title>
                        <Paper {...paperProps}>
                            <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]} sx={{ marginBottom: 20 }}>
                                <TextInput
                                    label="Nombre"
                                    placeholder="Ingresar nombre de la fundación"
                                    name='name'
                                    value={formValues.name}
                                    onChange={handleChange}
                                    error={errorMessages.name}
                                    required />

                                <ResponsibleSelect errorResponsible={errorMessages.responsible} handleSelectResponsible={updateResponsible} />

                                <TextInput
                                    label="Teléfono"
                                    placeholder="Ingresar teléfono"
                                    name='fono'
                                    value={formValues.fono}
                                    onChange={handleChange}
                                    error={errorMessages.fono}
                                    disabled={isLoading}
                                    required />
                                <ConfidenceSelect errorConfidence={errorMessages.confidenceLevel} updateSelectedConfidence={updateConfidenceLevel} />
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
                        </Paper>
                        <Paper {...paperProps}>
                            <Title {...subTitleProps}>Localización campaña</Title>
                            <Text size="sm" mb="sm">
                                Seleccione el país al que enviaremos los fondos (normalmente, donde reside).
                            </Text>
                            <SimpleGrid cols={1} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                                <CountrySelect handleSelectCountry={handleSelectCountry} errorCountry={errorMessages.country} />
                                <TextInput
                                    label="Ciudad"
                                    placeholder="Antofagasta"
                                    name='city'
                                    value={formValues.city}
                                    onChange={handleChange}
                                    error={errorMessages.city}
                                    disabled={isLoading}
                                    required />
                                <GooglePlace updateAddress={updateAddressReferences} />
                            </SimpleGrid>
                        </Paper>

                        <Paper {...paperProps}>
                            <Title {...subTitleProps}>Imágen de Perfil</Title>
                            <Stack spacing="sm">
                                <FileDropzone
                                    label="Sube la imágen de perfil de la fundación"
                                    description="Esta imágen se mostrarán junto a su nombre"
                                    handleDropFile={updateHandleDrop}
                                    multiple={false}
                                />
                                {
                                    errorMessages.multimediaCount &&
                                    <Text color="red" size="sm">{errorMessages.multimediaCount}</Text>
                                }
                            </Stack>
                        </Paper>

                        <Card.Section mb="lg">
                            <Flex align="center" justify="center">
                                <Button
                                    // leftIcon={<IconPlus size={18} />}
                                    component={LinkRouter}
                                    to="/panel/dashboard"
                                    style={{ marginRight: 20 }}
                                    disabled={isLoading}
                                >
                                    Volver
                                </Button>

                                <Button
                                    leftIcon={<IconPlus size={18} />}
                                    component={LinkRouter}
                                    onClick={onCreateFoundation} to={""}                                >
                                    Crear una fundación
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

export default CreateFoundationPage;
