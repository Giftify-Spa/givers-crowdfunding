/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Badge, Card, Grid, Group, Image, Modal, Stack, Text, Title } from '@mantine/core';
import { Foundation } from '../../interfaces/Foundation';

interface CustomModalProps {
    opened: boolean;
    closeModal: () => void;
    foundation: Foundation;
}

export const FoundationDetailModal = ({ opened, closeModal, foundation }: CustomModalProps) => {

    const getConfidenceLevel = (level: number): string => {
        switch (level) {
            case 1:
                return 'Bajo';
            case 2:
                return 'Medio';
            case 3:
                return 'Alto';
            default:
                return 'Desconocido';
        }
    };

    // Variables para manejar el responsable
    let responsibleName = 'No disponible';
    let responsibleEmail = 'No disponible';

    // Manejo seguro del campo 'responsible'
    if (foundation?.responsible) {
        if (typeof foundation.responsible === 'object' && 'name' in foundation.responsible) {
            responsibleName = (foundation.responsible as any).name || 'No disponible';
            responsibleEmail = (foundation.responsible as any).email || 'No disponible';
        } else if (typeof foundation.responsible === 'string') {
            responsibleName = foundation.responsible;
            // Si la string representa una URL de imagen, podrías asignarla aquí
            // Por ahora, asumimos que es solo el nombre
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={closeModal}
            centered
            size="lg"
            withCloseButton
            title={<Title order={1}>{foundation?.name}</Title>}
        >
            <Stack spacing="md">
                {/* Image and Description Section */}
                {foundation?.multimedia && (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Title order={4} mb="sm">Descripción</Title>
                        <Text mt="sm">{foundation?.description}</Text>
                    </Card>
                )}

                {/* General Information Section*/}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={4} mb="sm">Información General</Title>
                    <Grid>
                        <Grid.Col span={6}>
                            <Group>
                                <Text weight={500}>Nivel de Confianza:</Text>
                                <Badge color={foundation?.confidenceLevel === 3 ? 'green' : foundation?.confidenceLevel === 2 ? 'yellow' : 'red'} variant="filled">
                                    {getConfidenceLevel(foundation?.confidenceLevel)}
                                </Badge>
                            </Group>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Group>
                                <Text weight={500}>Estado:</Text>
                                <Badge color={foundation?.status ? 'green' : 'red'} variant="dot">
                                    {foundation?.status ? 'Habilitado' : 'Deshabilitado'}
                                </Badge>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Card>

                {/* Geopoint Section */}
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Title order={4} mb="sm">Localización</Title>
                    <Stack spacing="xs">
                        <Group>
                            <Text weight={500}>País:</Text>
                            <Text>{foundation?.country}</Text>
                        </Group>
                        <Group>
                            <Text weight={500}>Ciudad:</Text>
                            <Text>{foundation?.city}</Text>
                        </Group>
                        <Group>
                            <Text weight={500}>Dirección:</Text>
                            <Text>{foundation?.address}</Text>
                        </Group>
                    </Stack>
                </Card>

                {/* Funds Transfer Data Section */}
                {foundation?.fundsTransferData && (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Title order={4} mb="sm">Información de Depósito</Title>
                        <Stack spacing="xs">
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
                )}

                {/* Responsible Section */}
                {foundation?.responsible && (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Title order={4} mb="sm">Responsable</Title>
                        <Group>
                            <Avatar size="lg" radius="xl" src={typeof foundation?.responsible === 'string' ? foundation?.responsible : undefined} />
                            <Text>{typeof foundation?.responsible === 'object' ? `${responsibleName} - ${responsibleEmail}`  : 'No disponible'}</Text>
                        </Group>
                    </Card>
                )}

                {/* Multimedia Section */}
                {foundation?.multimedia && foundation?.multimedia?.length > 0 && (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Title order={4} mb="sm">Multimedia</Title>
                        <Grid>
                            {foundation?.multimedia?.map((media, index) => (
                                <Grid.Col span={4} key={index}>
                                    <Image src={media} alt={`Multimedia ${index + 1}`} radius="md" />
                                </Grid.Col>
                            ))}
                        </Grid>
                    </Card>
                )}

                {/* Campaigns Section */}
                {/* {foundation?.campaigns && foundation?.campaigns?.length > 0 && (
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Title order={4} mb="sm">Campañas Asociadas</Title>
                        <Stack spacing="xs">
                            {foundation?.campaigns?.map((campaign, index) => (
                                <Group key={index}>
                                    <Avatar size="xs" radius="xl" color="blue">
                                        {campaign?.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Text>{campaign}</Text>
                                </Group>
                            ))}
                        </Stack>
                    </Card>
                )} */}
            </Stack>
        </Modal>
    );
}