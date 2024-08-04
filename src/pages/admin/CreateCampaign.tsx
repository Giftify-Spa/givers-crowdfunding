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
import { DateInput } from "@mantine/dates";
import { CategorySelect, FileDropzone } from "../../components";

import { Link as LinkRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FoundationSelect from "../../components/FoundationSelect";

import * as yup from 'yup';
import { IconCalendar, IconCurrencyDollar } from "@tabler/icons-react";
import { addCampaign } from "../../firebase/service";
import GiversLayout from "../../layout/GiversLayout";
import ResponsibleSelect from "../../components/ResponsibleSelect";
import { AuthContext } from "../../context/auth/AuthContext";

const validationCampaignSchema = yup.object().shape({
    name: yup.string().required('El nombre de la campaña es requerido'),
    description: yup.string().required('La descripción de la campaña es requerida'),
    category: yup.string().required('La categoría de la campaña es requerida'),
    foundation: yup.string().required('La fundación de la campaña es requerida'),
    responsible: yup.string().required('El responsable de la campaña es requerido'),
    initDate: yup.string().required('La fecha de inicio de la campaña es requerida'),
    finishDate: yup.string().required('La fecha de finalización de la campaña es requerida'),
    isCause: yup.boolean().required('El tipo de campaña es requerido'),
    isExperience: yup.boolean().required('El tipo de campaña es requerido'),
    requestAmount: yup.number().required('El monto de la campaña es requerido').min(1000, 'El monto de la campaña debe ser mayor a 1000'),
    multimediaCount: yup.number().required('El contenido multimedia es requerido').min(1, 'Al menos una imagen es requerida')
});

const CreateCampaignPage = () => {


    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    const [formValues, setFormValues] = useState<{ name: string; description: string; requestAmount: number; category: string; foundation: string; responsible: string; initDate: Date; finishDate: Date; isCause: boolean; isExperience: boolean, multimediaCount: number }>({
        name: '',
        description: '',
        category: '',
        foundation: '',
        responsible: '',
        initDate: null,
        finishDate: null,
        isCause: false,
        isExperience: false,
        requestAmount: 0,
        multimediaCount: 0,
    });

    const [files, setFiles] = useState<File[]>([]);

    const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);


    const theme = useMantineTheme()
    const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);

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

    const onCreateCampaign = async () => {

        console.log(error);
        const isValid = await isValidForm();

        if (isValid) {
            // Format data
            const campaignData = {
                name: formValues.name,
                description: formValues.description,
                category: formValues.category,
                foundation: formValues.foundation,
                initDate: formValues.initDate,
                endDate: formValues.finishDate,
                isCause: formValues.isCause,
                isExperience: formValues.isExperience,
                requestAmount: formValues.requestAmount,
                multimedia: files,
                responsible: formValues.responsible,
                createdBy: user.uid,
            }

            const response = await addCampaign(campaignData);

            if (!response.success) return setError('ocurrió un error al crear la fundación');

            // Redirect to dashboard
            navigate('/panel/dashboard');

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
                                <FoundationSelect errorFoundation={errorMessages.foundation} handleSelectFoundation={updateFoundation} />
                            </SimpleGrid>

                            <ResponsibleSelect errorResponsible={errorMessages.responsible} handleSelectResponsible={updateResponsible} />

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
                                        <DateInput
                                            name="initDate"
                                            value={formValues.initDate}
                                            onChange={(value) => setFormValues({ ...formValues, initDate: value })}
                                            label="Fecha inicial campaña"
                                            placeholder="Fecha inicial"
                                            lang="es"
                                            icon={<IconCalendar size={18} />}
                                            error={errorMessages.initDate}
                                            required
                                        />

                                        <DateInput
                                            value={deadlineDate}
                                            onChange={(value) => {
                                                setFormValues({ ...formValues, finishDate: value })
                                                setDeadlineDate(value)
                                            }}
                                            label="Fecha final campaña"
                                            placeholder="Fecha final"
                                            lang="es"
                                            icon={<IconCalendar size={18} />}
                                            error={errorMessages.finishDate}
                                            required
                                        />

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

export default CreateCampaignPage;
