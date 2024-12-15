/* eslint-disable react-hooks/exhaustive-deps */
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
    List,
    Image
} from "@mantine/core";
import { useEffect, useState } from "react";

import {
    IconCheck,
    IconPlus
} from "@tabler/icons-react";
import { FileDropzone } from "../../components";

import { Link as LinkRouter, useNavigate, useParams } from "react-router-dom";

import GooglePlace from "../../components/Place";
import ConfidenceSelect from "../../components/ConfidenceSelect";

import { editFoundation, getFoundation } from "../../firebase/services/FoundationServices";
import ResponsibleSelect from "../../components/ResponsibleSelect";
import GiversLayout from "../../layout/GiversLayout";
import { showNotification } from "@mantine/notifications";
import { validationAdminEditFoundationSchema } from "../../schemas/foundation/admin/editSchema";
import { Foundation } from "../../interfaces/Foundation";

const EditFoundationPage = () => {

    const { id } = useParams();

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
    const [existingMultimedia, setExistingMultimedia] = useState<string[]>([]);

    const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);

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
                    city: formValues.city,
                    address: formValues.address,
                    lat: formValues.lat,
                    lng: formValues.lng,
                    confidenceLevel: formValues.confidenceLevel,
                    fono: formValues.fono,
                    multimedia: files,
                    responsible: formValues.responsible,
                }

                const response = await editFoundation(id, foundationData);

                if (!response.success) return setError('ocurrió un error al crear la fundación');

                // Show success notification
                showNotification({
                    title: 'Fundación Editada',
                    message: 'La fundación se ha editado exitosamente.',
                    color: 'green',
                    icon: <IconCheck size={18} />,
                });

                // Redirect to dashboard
                navigate('/panel/dashboard');
            }
        } catch (error) {
            setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const isValidForm = async (): Promise<boolean> => {
        try {
            await validationAdminEditFoundationSchema.validate(formValues, { abortEarly: false });
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

    useEffect(() => {
        const fetchFoundationData = async () => {
            setIsLoading(true);
            try {
                const foundation: Foundation = await getFoundation(id);

                if (foundation && typeof foundation === 'object') {
                    setFormValues({
                        ...formValues,
                        name: foundation.name || '',
                        description: foundation.description || '',
                        fono: foundation.fono || '',
                        country: foundation.country || '',
                        city: foundation.city || '',
                        address: foundation.address || '',
                        responsible: foundation.responsible.id || '',
                        confidenceLevel: foundation.confidenceLevel,
                        multimediaCount: foundation.multimedia.length || 0,
                    });
                    setExistingMultimedia(foundation.multimedia || []);
                } else {
                    setError("No se pudo cargar la fundación");
                }
            } catch (error) {
                setError("No se pudo cargar la fundación");
            } finally {
                setIsLoading(false);
            }
        }
        fetchFoundationData();
    }, [id]);

    return (
        <GiversLayout>
            <Helmet>
                <title>Editar Fundación</title>
            </Helmet>
            <Box>
                <Container my={36}>
                    <Title mb="xl" align="center">Editar fundación</Title>

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
                                    disabled={isLoading}
                                    required />

                                <ResponsibleSelect value={formValues.responsible} errorResponsible={errorMessages.responsible} handleSelectResponsible={updateResponsible} />

                                <TextInput
                                    label="Teléfono"
                                    placeholder="Ingresar teléfono"
                                    name='fono'
                                    value={formValues.fono}
                                    onChange={handleChange}
                                    error={errorMessages.fono}
                                    disabled={isLoading}
                                    required />
                                <ConfidenceSelect errorConfidence={errorMessages.confidenceLevel} updateSelectedConfidence={updateConfidenceLevel} value={formValues.confidenceLevel.toString()} />
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
                                <TextInput
                                    label="País"
                                    placeholder=""
                                    name='country'
                                    value={formValues.country}
                                    onChange={handleChange}
                                    error={errorMessages.country}
                                    disabled={true}
                                    required />
                                <TextInput
                                    label="Ciudad"
                                    placeholder="Antofagasta"
                                    name='city'
                                    value={formValues.city}
                                    onChange={handleChange}
                                    error={errorMessages.city}
                                    disabled={isLoading}
                                    required />


                                    <Text
                                        size={'sm'}
                                        weight={500}
                                    >
                                        Dirección Actual:
                                    </Text>
                                    <Text
                                        size={'sm'}
                                        weight={500}
                                        color={'gray'}
                                    >
                                        {formValues.address}
                                    </Text>

                                <GooglePlace updateAddress={updateAddressReferences} />
                            </SimpleGrid>
                        </Paper>

                        <Paper {...paperProps}>
                            <Title {...subTitleProps}>Imágen de Perfil</Title>
                            <Stack spacing="sm">
                                {/* Previsualización de Imágenes Existentes */}
                                {existingMultimedia.length > 0 && (
                                    <div>
                                        <Text size="sm" mb="xs">Imágenes Existentes:</Text>
                                        <SimpleGrid cols={6} spacing="sm">
                                            {existingMultimedia.map((imageUrl, index) => (
                                                <Card key={index} shadow="sm" padding="xs" radius="md" withBorder>
                                                    <Image src={imageUrl} alt={`Multimedia ${index + 1}`} height={100} width={100} sx={{ margin: 'auto' }} fit="cover" />
                                                </Card>
                                            ))}
                                        </SimpleGrid>
                                    </div>
                                )}
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
                                    Editar fundación
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

export default EditFoundationPage;
