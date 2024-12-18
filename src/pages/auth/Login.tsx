import {
    TextInput,
    Box,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    BoxProps,
    Container,
    Group,
    Button,
    Divider,
    List
} from '@mantine/core';
import { Helmet } from "react-helmet";
import { IconBrandGoogle } from "@tabler/icons-react";

import { Link } from "react-router-dom";
import * as yup from "yup";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth/AuthContext";
import GiversLayoutGuest from '../../layout/GiversLayoutGuest';

const validationLoginSchema = yup.object().shape({
    email: yup.string().email('Ingrese un correo electrónico válido').required('El correo electrónico es requerido'),
    password: yup.string().required('La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres')
});

const LoginPage = () => {
    const { startGoogleSignIn, startLoginWithEmailAndPasssword } = useContext(AuthContext);

    const [formValues, setFormValues] = useState<{ email: string; password: string }>({
        email: '',
        password: '',
    });

    const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingGoogle, setLoadingGoogle] = useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    }

    const onLogin = async () => {
        setLoading(true);
        const isValid = await isValidForm();

        if (isValid) {
            const response = await startLoginWithEmailAndPasssword(formValues.email, formValues.password);
            if (!response.success) setError(response.errorMessage);
        }
        setLoading(false);
    }

    const onLoginGoogle = async () => {
        try {
            setLoadingGoogle(true);
            await startGoogleSignIn();
            setLoadingGoogle(false);
        } catch (error) {
            console.log(error);
            setLoadingGoogle(false);
        }

    }

    const isValidForm = async (): Promise<boolean> => {
        try {
            await validationLoginSchema.validate(formValues, { abortEarly: false });
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

    const boxProps: BoxProps = {
        mt: 24,
        mb: 0,
        py: 48
    }

    return (
        <GiversLayoutGuest>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <Box {...boxProps}>
                <Container size={420} my={40}>
                    <Title
                        align="center"
                        sx={() => ({ fontWeight: 900 })}
                    >
                        Bienvenido a Givers
                    </Title>
                    <Text color="dimmed" size="sm" align="center" mt={5}>
                        No tienes cuenta?{' '}
                        <Link color={'inherit'} to="/register">
                            Crear una cuenta
                        </Link>
                    </Text>

                    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                        <Group grow mb="md" mt="md">
                            {/* <Button radius="xl" leftIcon={<IconBrandFacebook size={18} />}>Facebook</Button> */}
                            <Button
                                onClick={onLoginGoogle}
                                radius="xl"
                                leftIcon={<IconBrandGoogle size={18} />}
                                loading={loadingGoogle}
                                disabled={loading || loadingGoogle}
                            >
                                Google
                            </Button>
                        </Group>
                        <Divider label="O ingresa con tu correo electrónico" labelPosition="center" my="lg" />
                        <TextInput
                            label="Correo electrónico"
                            placeholder="givers@givers.com"
                            name='email'
                            value={formValues.email}
                            onChange={handleChange}
                            error={errorMessages.email}
                            disabled={loading || loadingGoogle}
                            required />
                        <PasswordInput
                            label="Contraseña"
                            placeholder="******"
                            name='password'
                            value={formValues.password}
                            onChange={handleChange}
                            error={errorMessages.password}
                            disabled={loading || loadingGoogle}
                            type="password"
                            required
                            mt="md" />
                        <Group position="apart" mt="lg">
                            <Checkbox label="Recordarme" />
                            <Anchor component="button" size="sm">
                                Olvidaste tu contraseña?
                            </Anchor>
                        </Group>
                        <Button
                            fullWidth
                            mt="xl"
                            onClick={onLogin}
                            loading={loading}
                        >
                            Iniciar sesión
                        </Button>
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
                    </Paper>
                </Container>
            </Box>
        </GiversLayoutGuest >
    );
}

export default LoginPage;
