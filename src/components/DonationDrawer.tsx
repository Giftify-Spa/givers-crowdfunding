/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
    Anchor,
    Button,
    Container,
    Drawer,
    DrawerProps,
    Flex,
    Group,
    Image,
    NumberInput,
    Paper,
    PaperProps,
    Radio,
    ScrollArea,
    Stack,
    Text,
    TextInput,
    ThemeIcon,
    useMantineTheme
} from "@mantine/core";
import {
    IconCash,
    IconCurrencyDollar,
    IconShieldCheckFilled
} from "@tabler/icons-react";
import * as yup from 'yup';
import { Campaign } from '../interfaces/Campaign';

interface IProps extends Pick<DrawerProps, 'opened' | 'onClose' | 'size'> {
    campaign?: Campaign
    iconSize: number
}

const validationDonationSchema = yup.object().shape({
    name: yup.string().required('El nombre es requerido'),
    lastname: yup.string().required('El apellido es requerido'),
    email: yup.string().required('El correo electrónico es requerido').email('El correo electrónico no es válido'),
    payment: yup.string().required('El método de pago es requerido'),
    amount: yup.number().required('El monto es requerido').min(1, 'El monto debe ser mayor a 0')
});

const DonationDrawer = ({ campaign, iconSize, ...others }: IProps) => {
    const [formValues, setFormValues] = useState<{ name: string, lastname: string, email: string, amount: number, payment: string }>({
        name: '',
        lastname: '',
        email: '',
        amount: 0,
        payment: ''
    });

    const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
    // const [error, setError] = useState<string | null>(null);

    const theme = useMantineTheme()

    const paperProps: PaperProps = {
        p: "md",
        withBorder: true,
        sx: { backgroundColor: theme.white }
    }


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    }

    const isValidForm = async (): Promise<boolean> => {
        try {
            await validationDonationSchema.validate(formValues, { abortEarly: false });
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

    const onCreateDonation = async () => {

        const isValid = isValidForm();
        if(!isValid){
            console.log('Formulario enviado');
            // Call API
            // window.location.href = import.meta.env.VITE_API_URL_TRANSBANK_CREATE2 as string;
        }
    }
    return (
        <Drawer
            position="bottom"
            title=""
            size="100%"
            scrollAreaComponent={ScrollArea.Autosize}
            {...others}
        >
            <Container>
                <Stack>
                    <Flex gap="xs" align="center">
                        <Image src={campaign?.multimedia[0]} height={96} width={120} fit="contain" radius="sm" />
                        <Text>Tu aporte a la <b>{campaign?.name}</b></Text>
                    </Flex>
                    <NumberInput
                        size="md"
                        label="Ingresa el monto de donación"
                        name="amount"
                        value={formValues.amount}
                        onChange={(value) => handleChange({ currentTarget: { name: 'amount', value } } as any)}
                        precision={2}
                        rightSection={<IconCurrencyDollar size={iconSize} />}
                        error={errorMessages.amount}
                        required
                    />
                    <Paper
                        p="md"
                        radius="sm"
                        mt="sm"
                        {...paperProps}
                    >
                        <Stack sx={{ width: '100%' }}>
                            <TextInput 
                                label="Correo electrónico" 
                                placeholder="Correo electrónico"
                                value={formValues.email}
                                onChange={handleChange}
                                error={errorMessages.email}
                                required    
                            />
                            <Group grow>
                                <TextInput
                                    label="Nombre"
                                    placeholder="Nombre"
                                    value={formValues.name}
                                    onChange={handleChange}
                                    error={errorMessages.name}
                                    required
                                />
                                <TextInput
                                    label="Apellidos"
                                    placeholder="Apellidos"
                                    value={formValues.lastname}
                                    onChange={handleChange}
                                    error={errorMessages.lastname}
                                    required
                                />
                            </Group>
                        </Stack>
                    </Paper>
                    <Paper {...paperProps}>
                        <Radio.Group
                            name="payment"
                            label="Método de pago"
                            value={formValues.payment}
                            onChange={(value) => handleChange({ currentTarget: { name: 'payment', value } } as any)}
                            mb="md"
                        >
                            <Group mt="sm">
                                <Radio
                                    value="gpay"
                                    label={<Group spacing="xs"><IconCash size={iconSize} /><Text>Webpay Transbank</Text></Group>} />
                            </Group>
                        </Radio.Group>
                    </Paper>

                    <Paper {...paperProps}>
                        <Stack>
                            <Text fw={700} size="lg">Tu donación</Text>
                            <Group position="apart">
                                <Text>Tu donación</Text>
                                <Text fw={500}>${formValues.amount}</Text>
                            </Group>
                            {/* <Group position="apart">
                                <Text>Givers tip</Text>
                                <Text fw={500}>$0.00</Text>
                            </Group> */}
                            <Group position="apart">
                                <Text>Total</Text>
                                <Text fw={500}>$0</Text>
                            </Group>
                            <Button onClick={onCreateDonation} size="lg">Ir al pago</Button>
                        </Stack>
                    </Paper>
                    <Paper {...paperProps}>
                        <Stack>
                            <Text size="sm">Al continuar, aceptas los <Anchor>términos de Givers</Anchor> y el <Anchor>aviso de privacidad.</Anchor></Text>
                            <Text size="sm">Aprende más sobre <Anchor>precios y tarifas.</Anchor></Text>
                            <Flex gap="sm">
                                <ThemeIcon size="lg" variant="light" color="blue">
                                    <IconShieldCheckFilled size={18} />
                                </ThemeIcon>
                                <Text size="sm">Te garantizamos un reembolso completo hasta por un año en el raro caso de que ocurra un fraude.&nbsp;<Anchor>Consulta nuestra Garantía de Donación de Givers.</Anchor>
                                </Text>
                            </Flex>
                        </Stack>
                    </Paper>
                </Stack>
            </Container >
        </Drawer >
    );
};

export default DonationDrawer;
