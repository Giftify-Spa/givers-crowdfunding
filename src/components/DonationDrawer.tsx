/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
    Anchor,
    Button,
    Container,
    Drawer,
    Flex,
    Group,
    Loader,
    NumberInput,
    Paper,
    ScrollArea,
    Stack,
    Text,
    TextInput,
    ThemeIcon,
    useMantineTheme
} from "@mantine/core";
import {
    IconCurrencyDollar,
    IconShieldCheckFilled
} from "@tabler/icons-react";
import * as yup from 'yup';
import { Campaign } from '../interfaces/Campaign';
import { formattingToCLPNumber } from '../helpers/formatCurrency';
import { initMercadoPago } from '@mercadopago/sdk-react';
import axios from 'axios';
import { addDocument } from '../firebase/service';
import { useDisclosure } from '@mantine/hooks';
import PaymentModal from './PaymentModal';

// Validate form with Yup
const donationSchema = yup.object().shape({
    name: yup.string().required('El nombre es requerido'),
    lastname: yup.string().required('El apellido es requerido'),
    email: yup
        .string()
        .email('El correo electrónico no es válido')
        .required('El correo electrónico es requerido'),
    amount: yup
        .number()
        .min(1, 'El monto debe ser mayor a 0')
        .required('El monto es requerido'),
});

interface IProps {
    campaign?: Campaign;
    iconSize: number;
    opened: boolean;
    onClose: () => void;
    size?: string | number;
}

const DonationDrawer = ({ campaign, iconSize, opened, onClose, size }: IProps) => {
    const theme = useMantineTheme();

    const [formValues, setFormValues] = useState({
        name: '',
        lastname: '',
        email: '',
        amount: 0,
    });

    // Manage Yup errors
    const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

    // Loader while the preference is being created
    const [loadingMP, setLoadingMP] = useState(false);

    // Save the preferenceId when it is ready and control the opening of the modal
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [paymentModalOpened, { open: openPaymentModal, close: closePaymentModal }] = useDisclosure(false);

    // Initialize MercadoPago
    initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_KEY_DEV, { locale: 'es-CL' });

    // Styles for Paper
    const paperProps = {
        p: 'md',
        withBorder: true,
        sx: { backgroundColor: theme.white },
    } as const;

    // Function to handle changes in text and number inputs
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement> | { currentTarget: { name: string; value: any } }
    ) => {
        const { name, value } = event.currentTarget;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    // Validate form with Yup
    const validateForm = async () => {
        try {
            await donationSchema.validate(formValues, { abortEarly: false });
            return true;
        } catch (error: any) {
            const fieldErrors: Record<string, string> = {};
            error.inner.forEach((err: any) => {
                fieldErrors[err.path] = err.message;
            });
            setErrorMessages(fieldErrors);
            return false;
        }
    };

    // Call your backend to create the MercadoPago preference
    const createPreference = async (orderId: string) => {
        try {
            const { data } = await axios.post(
                'https://us-central1-givers-48277.cloudfunctions.net/transbankWebpayGiversProd/create-preference',
                {
                    orderId,
                    campaignId: campaign?.id,
                    userId: 'Y0wTza0DEVJLBF6yuAkw',
                    title: `Donación a campaña ${campaign?.name}`,
                    price: formValues.amount,
                    quantity: 1,
                }
            );
            return data.id as string;
        } catch {
            return null;
        }
    };

    // Principal action: validate, create contribution, get preferenceId and open PaymentModal
    const onCreateDonation = async () => {
        if (!(await validateForm())) return;

        setErrorMessages({});

        // Check if the amount is less than the requestAmount
        const newAmount = formValues.amount + campaign.cumulativeAmount;
        if (newAmount > campaign.requestAmount) {
            setErrorMessages({ amount: 'El monto supera la meta de la campaña' });
            return;
        }

        try {
            setLoadingMP(true);

            // Create contribution in Firestore
            const docRef = await addDocument('contributions', {
                ...formValues,
                campaignId: campaign?.id,
                userId: 'Y0wTza0DEVJLBF6yuAkw',
                createdAt: new Date(),
                status: 'INITIALIZED',
                os: 'WEB',
            });

            // Create the preference in your backend
            const newPrefId = await createPreference(docRef);
            setLoadingMP(false);

            if (newPrefId) {
                setPreferenceId(newPrefId);
                openPaymentModal();
            }
        } catch {
            setLoadingMP(false);
        }
    };

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            position="bottom"
            size={size || '100%'}
            title=""
            scrollAreaComponent={ScrollArea.Autosize}
        >
            <Container>
                <Stack>
                    <Flex gap="xs" align="center">
                        <Text>
                            Tu aporte a <b>{campaign?.name}</b> - <b>Meta de la campaña {formattingToCLPNumber(campaign?.requestAmount)}</b>
                        </Text>
                    </Flex>

                    {/* Amount of donation */}
                    <NumberInput
                        size="md"
                        label="Ingresa el monto de donación"
                        name="amount"
                        value={
                            typeof formValues.amount === 'string'
                                ? parseFloat(formValues.amount)
                                : formValues.amount
                        }
                        onChange={(value) =>
                            handleChange({ currentTarget: { name: 'amount', value } })
                        }
                        precision={0}
                        rightSection={<IconCurrencyDollar size={iconSize} />}
                        error={errorMessages.amount}
                        placeholder="0"
                        required
                    />

                    {/* Information of the donor */}
                    <Paper p="md" radius="sm" mt="sm" {...paperProps}>
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

                    {/* Summary and continue button */}
                    <Paper {...paperProps}>
                        <Stack>
                            <Text fw={700} size="lg">
                                Tu donación
                            </Text>
                            <Group position="apart">
                                <Text>Total</Text>
                                <Text fw={500}>
                                    {formattingToCLPNumber(Number(formValues.amount))}
                                </Text>
                            </Group>

                            <Button size="lg" onClick={onCreateDonation} disabled={loadingMP}>
                                Continuar el pago
                            </Button>

                            {loadingMP && (
                                <Flex justify="center" align="center">
                                    <Loader size="sm" color="blue" />
                                </Flex>
                            )}
                        </Stack>
                    </Paper>

                    {/* Terms */}
                    <Paper {...paperProps}>
                        <Stack>
                            <Text size="sm">
                                Al continuar, aceptas los <Anchor>términos de Givers</Anchor> y el{" "}
                                <Anchor>aviso de privacidad.</Anchor>
                            </Text>
                            <Text size="sm">
                                Aprende más sobre <Anchor>precios y tarifas.</Anchor>
                            </Text>
                            <Flex gap="sm">
                                <ThemeIcon size="lg" variant="light" color="blue">
                                    <IconShieldCheckFilled size={18} />
                                </ThemeIcon>
                                <Text size="sm">
                                    Te garantizamos un reembolso completo hasta por un año en caso de fraude.&nbsp;
                                    <Anchor>Consulta nuestra Garantía de Donación.</Anchor>
                                </Text>
                            </Flex>
                        </Stack>
                    </Paper>
                </Stack>
            </Container>

            <PaymentModal
                opened={paymentModalOpened}
                onClose={closePaymentModal}
                preferenceId={preferenceId}
            />
        </Drawer>
    );
};

export default DonationDrawer;
