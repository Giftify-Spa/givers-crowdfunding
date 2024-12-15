import { Card, Divider, Group, Modal, Stack, Text, Title } from '@mantine/core';
import { Foundation } from '../../interfaces/Foundation';

interface CustomModalProps {
    opened: boolean;
    closeModal: () => void;
    foundation: Foundation;
}

export const FundsTransferModal = ({ opened, closeModal, foundation }: CustomModalProps) => {

    return (
        <Modal opened={opened} onClose={closeModal} size={"sm"} withinPortal centered>
            <Stack spacing="md">
                <Title order={3}>{foundation?.name}</Title>

                <Divider my="xs" />

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={4} size="h6" color="blue">Información de Depósito</Title>

                    <Stack spacing="xs" mt="sm">
                        <Group>
                            <Text weight={500}>Número de Cuenta:</Text>
                            <Text>{foundation?.fundsTransferData?.accountNumber || 'No disponible'}</Text>
                        </Group>

                        <Group>
                            <Text weight={500}>Banco:</Text>
                            <Text>{foundation?.fundsTransferData?.bank || 'No disponible'}</Text>
                        </Group>

                        <Group>
                            <Text weight={500}>Tipo de Cuenta:</Text>
                            <Text>{foundation?.fundsTransferData?.accountType || 'No disponible'}</Text>
                        </Group>

                        <Group>
                            <Text weight={500}>Email:</Text>
                            <Text>{foundation?.fundsTransferData?.email || 'No disponible'}</Text>
                        </Group>

                        <Group>
                            <Text weight={500}>Razón Social:</Text>
                            <Text>{foundation?.fundsTransferData?.holderName || 'No disponible'}</Text>
                        </Group>
                    </Stack>
                </Card>
            </Stack>
        </Modal>
    );
}