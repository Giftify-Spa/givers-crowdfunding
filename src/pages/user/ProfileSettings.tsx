
import { Helmet } from "react-helmet";
import {
    Avatar,
    Box,
    Button,
    Card,
    Container,
    Flex,
    Group,
    List,
    Loader,
    Overlay,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";

import { useContext, useState } from "react";
import { AuthContext } from "../../context/auth/AuthContext";

import { useNavigate } from "react-router-dom";
import GiversLayout from "../../layout/GiversLayout"

import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { validationUserProfileSettingsSchema } from "../../schemas/user/profileSchema";
import { editUser } from "../../firebase/services/UserServices";


const ProfileSettings = () => {
    const { user, refreshUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const [formValues, setFormValues] = useState<{ rut: string; name: string; lastname: string; phone: string; }>({
        rut: user?.rut,
        name: user?.name,
        lastname: user?.lastname,
        phone: (user?.phone) ? user?.phone.toString() : "",
    });

    const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);


    const onEditProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const isValid = isValidForm();
            if (isValid) {

                const userData = {
                    name: formValues.name,
                    email: user?.email,
                    rut: formValues.rut,
                    lastname: formValues.lastname,
                    phone: parseInt(formValues.phone),
                };

                const response = await editUser(user.id, userData);
                if (!response.success) return setError('ocurrió un error al editar el perfil');

                const refreshResponse = refreshUser(userData);

                if (!refreshResponse) return setError('ocurrió un error al actualizar el perfil');

                // Show success notification
                showNotification({
                    title: 'Perfil Actualizado',
                    message: 'Tu perfil ha sido actualizado correctamente.',
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
            await validationUserProfileSettingsSchema.validate(formValues, { abortEarly: false });
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.currentTarget;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    }

    return (
        <GiversLayout>
            <Helmet>
                <title>Ajustes de Cuenta</title>
            </Helmet>
            {/* Back Button to return to the previous page */}
            <Button
                onClick={() => navigate(-1)}
                leftIcon={<IconArrowLeft size={16} />}
                mb="lg"
                variant="outline"
                sx={(theme) => ({
                    transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
                    '&:hover': {
                        backgroundColor: theme.colors.primary[6],
                        borderColor: theme.colors.primary[6],
                        color: theme.white,
                    },
                })}
            >
                Volver
            </Button>
            <Box>
                <Container size="lg" py="lg">
                    <Stack spacing="md">
                        {/* Page title */}
                        <Title order={1} mb="lg">Ajustes de Cuenta</Title>

                        {/* Profile Card */}
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Group position="apart">
                                <Group spacing="sm">
                                    <Avatar
                                        src={(user?.photoURL as string) || ""}
                                        size={80}
                                        radius="xl"
                                    />
                                    <Stack spacing={0}>
                                        <Text weight={600} size="lg">
                                            {user?.name}
                                        </Text>
                                        <Text size="sm" color="dimmed">
                                            {user?.email}
                                        </Text>
                                    </Stack>
                                </Group>
                                <Button
                                    onClick={onEditProfile}
                                    disabled={isLoading}
                                >
                                    Editar Perfil
                                </Button>
                            </Group>

                            <SimpleGrid cols={2} spacing="md" mt="md" breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
                                {/* Rut */}
                                <TextInput
                                    placeholder="1.111.111-1"
                                    label="Rut"
                                    name="rut"
                                    value={formValues?.rut || ""}
                                    onChange={handleChange}
                                    error={errorMessages.rut}
                                    disabled={isLoading}
                                    required
                                />
                                {/* Name */}
                                <TextInput
                                    label="Nombre"
                                    name="name"
                                    value={formValues?.name || ""}
                                    onChange={handleChange}
                                    error={errorMessages.name}
                                    disabled={isLoading}
                                    required
                                />
                                {/* Lastnames */}
                                <TextInput
                                    label="Apellidos"
                                    name="lastname"
                                    value={formValues?.lastname || ""}
                                    onChange={handleChange}
                                    error={errorMessages.lastname}
                                    disabled={isLoading}
                                    required
                                />

                                {/* Gender */}
                                {/* <Select
                                label="Genero"
                                placeholder="Selecionar Genero"
                                data={[
                                    { value: "M", label: "Hombre" },
                                    { value: "F", label: "Mujer" },
                                    { value: "O", label: "Otro" },
                                    { value: "E", label: "Prefiero no decirlo" },
                                ]}
                            /> */}

                                {/* Fono */}
                                <TextInput
                                    label="Teléfono"
                                    name="phone"
                                    value={formValues?.phone || ""}
                                    onChange={handleChange}
                                    error={errorMessages.phone}
                                    disabled={isLoading}
                                    required
                                />
                            </SimpleGrid>

                            {/* Email Section */}
                            <Box mt="xl">
                                <Title order={4} size="h5">
                                    Mi correo electrónico
                                </Title>
                                <Stack spacing="xs" mt="sm">
                                    <Group>
                                        <Avatar color="blue" radius="xl" size="sm">
                                            @
                                        </Avatar>
                                        <div>
                                            <Text size="sm">{user?.email}</Text>
                                            <Text size="xs" color="dimmed">
                                                1 month ago
                                            </Text>
                                        </div>
                                    </Group>
                                    <Button variant="outline" size="xs" color="blue">
                                        + Add Email Address
                                    </Button>
                                </Stack>
                            </Box>
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
                        </Card>
                    </Stack>
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
    )
}

export default ProfileSettings