import { useEffect, useState } from 'react';
import { getPendingCampaigns, approveCampaign } from '../../firebase/services/CampaignServices';
import { Table, Button, Text, Container, Title, Center, Paper, Stack } from '@mantine/core';
import { Campaign } from '../../interfaces/Campaign';
import GiversLayout from '../../layout/GiversLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { IconArrowLeft, IconInbox } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const PendingCampaignPage = () => {
    const navigate = useNavigate();
    const [pendingCampaigns, setPendingCampaigns] = useState<Campaign[]>([]);
    const [approving, setApproving] = useState<string | null>(null);  // ID de la campaña que se está aprobando
    const [loading, setLoading] = useState<boolean>(false);

    const fetchPendingCampaigns = async () => {
        try {
            setLoading(true);
            const campaigns = await getPendingCampaigns();
            setPendingCampaigns(campaigns);
        } catch (error) {
            console.error("Error fetching campaigns:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (campaignId: string) => {
        setApproving(campaignId);  // Indica que estamos aprobando esta campaña
        try {
            await approveCampaign(campaignId);
            setPendingCampaigns(prevCampaigns => prevCampaigns.filter(campaign => campaign.id !== campaignId));
        } catch (error) {
            console.error("Error approving campaign:", error);
        } finally {
            setApproving(null);  // Restablece el estado de aprobación
        }
    };

    useEffect(() => {
        fetchPendingCampaigns();
    }, []);

    return (
        <GiversLayout>
            <Button
                onClick={() => navigate(-1)}
                leftIcon={<IconArrowLeft size={16} />}
                mb="lg"
                variant="outline"
            >
                Volver
            </Button>
            <Container>
                <Title order={1} mb="lg">Campañas Pendientes</Title>
                {
                    loading ? <LoadingSpinner position='top' />
                        :
                        (pendingCampaigns.length > 0 ? (
                            <Table striped highlightOnHover withBorder withColumnBorders>
                                <thead>
                                    <tr>
                                        <th>Creado por</th>
                                        <th>Nombre</th>
                                        <th>Fundación</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingCampaigns.map((campaign) => (
                                        <tr key={campaign.id}>
                                            <td>{campaign.createdBy?.email}</td>
                                            <td>{campaign.name}</td>
                                            <td>{campaign.foundation?.name}</td>
                                            {/* <td>{campaign.foundation}</td> */}
                                            <td>
                                                <Button
                                                    onClick={() => handleApprove(campaign.id)}
                                                    disabled={approving === campaign.id}
                                                    loading={approving === campaign.id}
                                                    variant="outline"
                                                >
                                                    Aprobar
                                                </Button>

                                                <Button
                                                    onClick={() => handleApprove(campaign.id)}
                                                    disabled={approving === campaign.id}
                                                    loading={approving === campaign.id}
                                                    variant="outline"
                                                    color="red"
                                                >
                                                    Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <Center style={{ height: 200 }}>
                                <Paper p="lg" shadow="sm" radius="md" withBorder>
                                    <Stack align="center" spacing="xs">
                                        <IconInbox size={48} color="gray" />
                                        <Text size="lg" weight={500} color="dimmed">
                                            No hay campañas pendientes
                                        </Text>
                                        <Text size="sm" color="dimmed">
                                            ¡Estás al día! No hay campañas que requieran aprobación en este momento.
                                        </Text>
                                    </Stack>
                                </Paper>
                            </Center>
                        ))}
            </Container>
        </GiversLayout>
    );
};

export default PendingCampaignPage;
