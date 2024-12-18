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
import { formattingToCLPNumber } from '../helpers/formatCurrency';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import axios from 'axios';



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

    const [preference_id, setPreference_id] = useState<string | null>(null);

    initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_KEY_DEV, {
        locale: "es-CL"
    });

    const createPreference = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:5001/givers-48277/us-central1/mercadoPagoGivers/create-preference", {
                title: "Donación",
                price: 1000,
                quantity: 1
            });
            const { id } = response.data;
            console.log(id);
            setPreference_id(id);
            // return id;
        } catch (error) {
            console.log(error);
        }
    }

    // const navigate = useNavigate();

    const [formValues, setFormValues] = useState<{ name: string, lastname: string, email: string, amount: number | string, payment: string }>({
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
        try {
            const isValid = await isValidForm();
            if (isValid) {
                console.log('Formulario válido');
            }
        } catch (error) {
            console.log(error);
        } finally {
            console.log('Finalizado');
        }
        // const isValid = await isValidForm();
        // if (isValid) {
        //     try {

        //         const userId = await checkUser(formValues);

        //         const formattedOrderData = {
        //             contributionAmount: Number(formValues.amount),
        //             status: 'INITIALIZED',
        //             os: 'WEB',
        //             userId,
        //             campaignId: campaign.id
        //         };

        //         const { success, order } = await addOrder(formattedOrderData);

        //         if (success) {
        //             navigate('/transbank/request', { state: { order, campaignId: campaign?.id, userId: formattedOrderData.userId } });
        //         }
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }


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
                        <Text>Tu aporte a <b>{campaign?.name}</b></Text>
                    </Flex>
                    <NumberInput
                        size="md"
                        label="Ingresa el monto de donación"
                        name="amount"
                        value={typeof formValues.amount === 'string' ? parseFloat(formValues.amount) : formValues.amount}
                        onChange={(value) => handleChange({ currentTarget: { name: 'amount', value } } as any)}
                        precision={0}
                        rightSection={<IconCurrencyDollar size={iconSize} />}
                        error={errorMessages.amount}
                        placeholder='0'
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
                                name="email"
                                placeholder="Correo electrónico"
                                value={formValues.email}
                                onChange={handleChange}
                                error={errorMessages.email}
                                required
                            />
                            <Group grow>
                                <TextInput
                                    label="Nombre"
                                    name="name"
                                    placeholder="Nombre"
                                    value={formValues.name}
                                    onChange={handleChange}
                                    error={errorMessages.name}
                                    required
                                />
                                <TextInput
                                    label="Apellidos"
                                    name="lastname"
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

                            <Group mt="sm">
                                <Radio
                                    onClick={createPreference}
                                    value="gpay"
                                    label={<Group spacing="xs"><IconCash size={iconSize} /><Text>Mercado Pago</Text></Group>} />
                            </Group>
                        </Radio.Group>
                    </Paper>

                    <Paper {...paperProps}>
                        <Stack>
                            <Text fw={700} size="lg">Tu donación</Text>
                            <Group position="apart">
                                <Text>Tu donación</Text>
                                <Text fw={500}>{formattingToCLPNumber(Number(formValues.amount))}</Text>
                            </Group>
                            <Group position="apart">
                                <Text>Total</Text>
                                <Text fw={500}>{formattingToCLPNumber(Number(formValues.amount))}</Text>
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
            {preference_id && <Wallet initialization={{ preferenceId: preference_id, redirectMode: 'blank' }} />}
        </Drawer >
    );
};

export default DonationDrawer;
