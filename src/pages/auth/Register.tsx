import {
    Anchor,
    Button,
    Box,
    BoxProps,
    Container,
    Divider,
    Group,
    List,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { Helmet } from "react-helmet";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Link } from 'react-router-dom';

import * as yup from 'yup';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/auth/AuthContext';
import GiversLayoutGuest from '../../layout/GiversLayoutGuest';

const validationRegisterSchema = yup.object().shape({
    name: yup.string().required('El nombre es requerido'),
    email: yup.string().email('Ingrese un correo electrónico válido').required('El correo electrónico es requerido'),
    password: yup.string().required('La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres')
});


const RegisterPage = () => {

    const { startCreatingUserWithEmailAndPassword, startGoogleSignIn } = useContext(AuthContext);

    const [formValues, setFormValues] = useState<{ name: string; email: string; password: string }>({
        name: '',
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

    const onRegister = async () => {
        setLoading(true);
        const isValid = await isValidForm();

        if (isValid) {
            const response = await startCreatingUserWithEmailAndPassword(formValues.name, formValues.email, formValues.password);
            if (!response.success) setError(response.errorMessage);
        }
        setLoading(false);
    }

    const onRegisterGoogle = async () => {
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
            await validationRegisterSchema.validate(formValues, { abortEarly: false });
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
                <title>Signup</title>
            </Helmet>
            <Box {...boxProps}>
                <Container size={420} my={40}>
                    <Title
                        align="center"
                        sx={() => ({ fontWeight: 900 })}
                    >
                        Bienvenido Nuevamente!
                    </Title>
                    <Text color="dimmed" size="sm" align="center" mt={5}>
                        Ya tienes una cuenta?{' '}
                        <Link color={'inherit'} to="/login">
                            Iniciar Sesión
                        </Link>
                    </Text>

                    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                        <Group grow mb="md" mt="md">
                            <Button
                                onClick={onRegisterGoogle}
                                radius="xl"
                                leftIcon={<IconBrandGoogle size={18} />}
                                loading={loadingGoogle}
                            >
                                Google
                            </Button>
                        </Group>
                        <Divider label="O continua con tu correo electrónico" labelPosition="center" my="lg" />
                        <TextInput
                            label="Nombre"
                            placeholder="Diego"
                            name='name'
                            value={formValues.name}
                            onChange={handleChange}
                            error={errorMessages.name}
                            required />
                        <TextInput
                            label="Correo electrónico"
                            placeholder="givers@givers.cl"
                            name='email'
                            value={formValues.email}
                            onChange={handleChange}
                            error={errorMessages.email}
                            required
                            mt="md" />
                        <PasswordInput
                            label="Contraseña"
                            placeholder="********"
                            name='password'
                            value={formValues.password}
                            onChange={handleChange}
                            error={errorMessages.password}
                            type="password"
                            required
                            mt="md" />
                        <Group position="center" mt="lg">
                            {/* <Checkbox label="Remember me" /> */}
                            <Anchor component="button" size="sm">
                                Olvidaste tu contraseña?
                            </Anchor>
                        </Group>
                        <Button
                            fullWidth
                            mt="xl"
                            onClick={onRegister}
                            loading={loading}
                        >
                            Crear cuenta
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
        </GiversLayoutGuest>
    );
}

export default RegisterPage;
