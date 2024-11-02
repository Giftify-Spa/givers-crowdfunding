import { Helmet } from "react-helmet";
import {
    Box,
    Button,
    Card,
    Container,
    Flex,
    List,
    Paper,
    PaperProps,
    SimpleGrid,
    Text,
    TextInput,
    Title,
    TitleProps,
    useMantineTheme
} from "@mantine/core";
import { useEffect, useState } from "react";

import { IconEdit } from "@tabler/icons-react";
import { Link as LinkRouter, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import { getFoundation, updateFoundationPaymentInfo } from "../../../firebase/services/FoundationServices";
import GiversLayout from "../../../layout/GiversLayout";
import BankSelect from "../../../components/BankSelect";
import AccountTypeSelect from '../../../components/AccountTypeSelect';
import { validationPaymentInfoFoundationSchema } from "../../../schemas/foundation/paymentInfoSchema";

// Validation schema for the foundation form


const EditFoundationPage = () => {
    const { id } = useParams<{ id: string }>();

    const [formValues, setFormValues] = useState({
        rut: '',
        bank: '',
        accountType: '',
        holderName: '',
        accountNumber: '',
        email: ''
    });
    const [foundation, setFoundation] = useState(null);
    const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [bankSelect, setBankSelect] = useState<string>('');
    const [accountTypeSelect, setAccountTypeSelect] = useState<string>('');

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

    const handleSelectBank = (name: string) => {
        setBankSelect(name);
        setFormValues({ ...formValues, bank: name });
    }

    const handleSelectAccountType = (name: string) => {
        setAccountTypeSelect(name);
        setFormValues({ ...formValues, accountType: name });
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    }

    const onEditFoundation = async () => {
        setLoading(true);
        const isValid = await isValidForm();

        if (isValid) {
            const foundationData = {
                bank: bankSelect,
                accountType: accountTypeSelect,
                ...formValues
            };

            const response = await updateFoundationPaymentInfo(id, foundationData);

            if (!response?.success) return setError('Ocurrió un error al crear la fundación');

            navigate('/panel/dashboard');
        }
        setLoading(false);
    }

    const isValidForm = async (): Promise<boolean> => {
        try {
            await validationPaymentInfoFoundationSchema.validate(formValues, { abortEarly: false });
            return true;
        } catch (error) {
            const errors: Record<string, string> = {};
            error.inner.forEach((err: yup.ValidationError) => {
                errors[err.path] = err.message;
            });
            setErrorMessages(errors);
            return false;
        }
    }

    useEffect(() => {
        const fetchFoundationData = async () => {
            try {
                const response = await getFoundation(id);
                setFoundation(response);
            } catch (error) {
                console.error("Failed to fetch foundation: ", error);
                setError("No se pudo cargar la fundación");
            }
        };

        fetchFoundationData();
    }, [id]);

    return (
        <GiversLayout>
            <Helmet>
                <title>Editar Fundación</title>
            </Helmet>
            <Box>
                <Container my={36}>
                    <Title mb="xl" align="center">Edita tu fundación</Title>

                    <div>
                        <Paper {...paperProps}>
                            <Title {...subTitleProps}>Datos fundación</Title>
                            <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                                <TextInput
                                    label="Nombre"
                                    name='name'
                                    value={foundation?.name}
                                    disabled />
                                <TextInput
                                    label="Teléfono"
                                    name='fono'
                                    value={foundation?.fono}
                                    disabled />
                            </SimpleGrid>
                        </Paper>
                        <Paper {...paperProps}>
                            <Title {...titleProps}>Información de pago</Title>
                            <Text size="sm" mb="sm">
                                Ingrese la información de la cuenta en la que se depositará el dinero recaudado de las campañas.
                            </Text>

                            <Title {...subTitleProps}>Datos personales</Title>
                            <SimpleGrid cols={1} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                                <TextInput
                                    label="Rut"
                                    name='rut'
                                    value={formValues.rut}
                                    onChange={handleChange}
                                    error={errorMessages.rut}
                                    required />
                                <TextInput
                                    label="Nombre y Apellido"
                                    name='holderName'
                                    value={formValues.holderName}
                                    onChange={handleChange}
                                    error={errorMessages.holderName}
                                    required />

                                <Title {...subTitleProps}>Datos bancarios</Title>

                                <BankSelect handleSelectBank={handleSelectBank} errorBank={errorMessages.bank} />
                                <AccountTypeSelect handleSelectAccountType={handleSelectAccountType} errorAccountType={errorMessages.accountType} />

                                <TextInput
                                    label="Número de cuenta"
                                    name='accountNumber'
                                    value={formValues.accountNumber}
                                    onChange={handleChange}
                                    error={errorMessages.accountNumber}
                                    required />

                                <TextInput
                                    label="Correo electrónico"
                                    name='email'
                                    value={formValues.email}
                                    onChange={handleChange}
                                    error={errorMessages.email}
                                    required />
                            </SimpleGrid>
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
                                    leftIcon={<IconEdit size={18} />}
                                    onClick={onEditFoundation}
                                    loading={loading}
                                >
                                    Guardar Cambios
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
            </Box>
        </GiversLayout>
    );
};

export default EditFoundationPage;
