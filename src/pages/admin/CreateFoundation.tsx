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
    Text,
    TextInput,
    Title,
    TitleProps,
    useMantineTheme
} from "@mantine/core";
import { useState } from "react";

import {
    IconPlus
} from "@tabler/icons-react";
import { CountrySelect } from "../../components";

import { Link as LinkRouter, useNavigate } from "react-router-dom";

import GooglePlace from "../../components/Place";
import ConfidenceSelect from "../../components/ConfidenceSelect";

import * as yup from "yup";
import { addFoundation } from "../../firebase/service";
import ResponsibleSelect from "../../components/ResponsibleSelect";
import GiversLayout from "../../layout/GiversLayout";

const validationFoundationSchema = yup.object().shape({
    name: yup.string().required('El nombre es requerido'),
    country: yup.string().required('El país es requerido'),
    city: yup.string().required('La ciudad es requerida'),
    address: yup.string().required('La dirección es requerida'),
    fono: yup.string().required('El teléfono es requerido'),
    confidenceLevel: yup.number().notOneOf([0], 'El nivel de confianza es requerido'),
    responsible: yup.string().required('El responsable es requerido'),
});


const CreateFoundationPage = () => {

    const [formValues, setFormValues] = useState<{ name: string; country: string; city: string, address: string, lat: string, lng: string, confidenceLevel: number, fono: string, responsible: string }>({
        name: '',
        country: '',
        city: '',
        address: '',
        lat: '',
        lng: '',
        confidenceLevel: 0,
        fono: '',
        responsible: '',
    });

    const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);

    const [countrySelect, setCountrySelect] = useState<string>('');


    const navigate = useNavigate();
    const theme = useMantineTheme()
    // const [active, setActive] = useState(0);
    // const [target, setTarget] = useState('deadline');
    // const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
    // const [donationType, setDonationType] = useState('any');
    // const [minimumCheck, setMinimumCheck] = useState(false);


    // const nextStep = () => setActive((current: number) => (current < 4 ? current + 1 : current));
    // const prevStep = () => setActive((current: number) => (current > 0 ? current - 1 : current));


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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    }

    const onCreateFoundation = async () => {

        console.log(error);

        const isValid = await isValidForm();

        if (isValid) {
            // Format data
            const foundationData = {
                name: formValues.name,
                country: countrySelect,
                city: formValues.city,
                address: formValues.address,
                lat: formValues.lat,
                lng: formValues.lng,
                confidenceLevel: formValues.confidenceLevel,
                fono: formValues.fono,
                responsible: formValues.responsible,
            }

            const response = await addFoundation(foundationData);

            if (!response.success) return setError('ocurrió un error al crear la fundación');

            // Redirect to dashboard
            navigate('/panel/dashboard');
            
        }
    }

    const isValidForm = async (): Promise<boolean> => {
        try {
            await validationFoundationSchema.validate(formValues, { abortEarly: false });
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
                <title>Crear Fundación</title>
            </Helmet>
            <Box>
                <Container my={36}>
                    <Title mb="xl" align="center">Crea una fundación</Title>

                    <div>
                        <Title {...titleProps}>Información Fundación</Title>
                        <Paper {...paperProps}>
                            <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                                <TextInput
                                    label="Nombre"
                                    placeholder="Ingresar nombre de la fundación"
                                    name='name'
                                    value={formValues.name}
                                    onChange={handleChange}
                                    error={errorMessages.name}
                                    required />
                                <TextInput
                                    label="Teléfono"
                                    placeholder="Ingresar teléfono"
                                    name='fono'
                                    value={formValues.fono}
                                    onChange={handleChange}
                                    error={errorMessages.fono}
                                    required />
                                <ConfidenceSelect errorConfidence={errorMessages.confidenceLevel} updateSelectedConfidence={updateConfidenceLevel} />
                                <ResponsibleSelect errorResponsible={errorMessages.responsible} handleSelectResponsible={updateResponsible} />
                            </SimpleGrid>
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
                                    required />
                                <GooglePlace updateAddress={updateAddressReferences} />
                            </SimpleGrid>
                        </Paper>
                        {/* <Paper {...paperProps}>
                            <Stack spacing="sm">
                                <Title {...subTitleProps}>Información de Donación</Title>
                                <CurrencySelect />
                                <Radio.Group
                                    label="What kind of fundraiser would you like to create?"
                                    value={target}
                                    onChange={setTarget}
                                >
                                    <Group mt="xs">
                                        <Radio value="deadline" label="Fundraiser with a specific end date?" />
                                        <Radio value="no-deadline" label="Ongoing (no deadline) fundraiser?" />
                                    </Group>
                                </Radio.Group>
                                <Paper {...paperProps}>
                                    {target === 'deadline' ?
                                        <Stack spacing="xs">
                                            <Text size="sm">Fundraiser with a specific end date?</Text>
                                            <Text size="sm">This creates urgency and should always be used when
                                                money is needed before a certain time.</Text>
                                            <DateInput
                                                value={deadlineDate}
                                                onChange={setDeadlineDate}
                                                label="Deadline"
                                                placeholder="Date input"
                                                icon={<IconCalendar size={18} />}
                                            />
                                            <NumberInput
                                                label="Target amount"
                                                icon={<IconCurrencyDollar size={18} />} />
                                            <Checkbox
                                                label="Allow your fundraiser to be funded over the needed amount?" />
                                        </Stack> :
                                        <Stack spacing="xs">
                                            <Text size="sm">Ongoing (no deadline) fundraiser?</Text>
                                            <Text size="sm">This should be used if you are collecting money on a
                                                regular
                                                basis.</Text>
                                            <Checkbox
                                                checked={minimumCheck}
                                                onChange={(event) => setMinimumCheck(event.currentTarget.checked)}
                                                label="Select this if you would like to set a specific a minimum financial target" />
                                            {minimumCheck &&
                                                <NumberInput
                                                    label="Target amount"
                                                    icon={<IconCurrencyDollar size={18} />}
                                                />}
                                        </Stack>}
                                </Paper>
                            </Stack>
                        </Paper> */}
                        {/* <Paper {...paperProps}>
                            <Title {...subTitleProps}>Tipo de donación</Title>
                            <SegmentedControl
                                size="md"
                                value={donationType}
                                onChange={setDonationType}
                                data={[
                                    { label: 'Any (popular option)', value: 'any' },
                                    { label: 'Minimum', value: 'minimum' },
                                    { label: 'Fixed', value: 'fixed' },
                                ]}
                                mb="sm"
                            />
                            {donationType === 'minimum' ?
                                <NumberInput label="Minimum amount(s)" /> :
                                <NumberInput label="Fixed amount(s)" />}
                            <Checkbox
                                label="Would you like your fundraising page shown in more than one language?"
                                mt="sm"
                            />
                        </Paper> */}
                        {/* <Paper {...paperProps}>
                            <Stack spacing="sm">
                                <Title {...subTitleProps}>Fund & Registration details</Title>
                                <Text size="sm">*Name of the person receiving funds. For organizations, the legal
                                    representative
                                    name (this can be amended later).</Text>
                                <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                                    <TextInput label="First name" />
                                    <TextInput label="Last name" />
                                </SimpleGrid>
                                <FileDropzone
                                    label="Upload your profile picture"
                                    description="This picture will be shown next to your name"
                                />
                                <Checkbox label={
                                    <>
                                        I agree to the Givers{' '}
                                        <Anchor href="#" target="_blank">
                                            terms and conditions & privacy policy
                                        </Anchor>
                                    </>
                                } />
                            </Stack>
                        </Paper> */}

                        <Card.Section mb="lg">
                            <Flex align="center" justify="center">
                                <Button
                                    // leftIcon={<IconPlus size={18} />}
                                    component={LinkRouter}
                                    to="/panel/dashboard"
                                    style={{ marginRight: 20 }}
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
                        </Card.Section>
                    </div>
                </Container>
            </Box>
        </GiversLayout>
    );
};

export default CreateFoundationPage;
