import {
    Button,
    CopyButton,
    Drawer,
    Flex,
    Modal,
    Paper,
    Stack,
    Text,
    TextInput,
    Tooltip
} from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { Campaign } from "../interfaces/Campaign";

interface IProps {
    campaign?: Campaign;
    iconSize: number;
    opened: boolean;
    onClose: () => void;
}

const ShareModal = ({ campaign, ...others }: IProps) => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    return isMobile ? (
        <Drawer
            title="Ayuda compartiendo"
            position="bottom"
            {...others}
            sx={{
                // Estos estilos centran el contenido interno del Drawer
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Stack sx={{ width: "100%", alignItems: "center" }}>
                <Text align="center">
                    Las campañas compartidas en redes sociales recaudan hasta 5 veces más.
                </Text>
                <Paper sx={{ width: "100%", maxWidth: 400 }}>
                    <Flex align="flex-end" gap="sm">
                        <TextInput
                            label="Copiar Enlace"
                            value={`https://givers.cl/campaign/${campaign?.id}`}
                            disabled
                            sx={{ flex: "1 1 auto" }}
                        />
                        <CopyButton
                            value={`https://givers.cl/campaign/${campaign?.id}`}
                            timeout={2000}
                        >
                            {({ copied, copy }) => (
                                <Tooltip
                                    label={copied ? "Copiado" : "Copiar"}
                                    withArrow
                                    position="right"
                                >
                                    <Button
                                        color={copied ? "green" : "gray"}
                                        leftIcon={
                                            copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />
                                        }
                                        onClick={copy}
                                    >
                                        {copied ? "Copiado" : "Copiar"}
                                    </Button>
                                </Tooltip>
                            )}
                        </CopyButton>
                    </Flex>
                </Paper>
            </Stack>
        </Drawer>
    ) : (
        <Modal title="Ayuda compartiendo" withinPortal={true} centered size="md" {...others}
            xOffset="0vw" yOffset="0vh"
        >
            <Stack align="center">
                <Text align="center">
                    Las campañas compartidas en redes sociales recaudan hasta 5 veces más.
                </Text>
                <Paper sx={{ width: "100%", maxWidth: 400 }}>
                    <Flex align="flex-end" gap="sm">
                        <TextInput
                            label="Copiar Enlace"
                            value={`https://givers.cl/campaign/${campaign?.id}`}
                            disabled
                            sx={{ flex: "1 1 auto" }}
                        />
                        <CopyButton
                            value={`https://givers.cl/campaign/${campaign?.id}`}
                            timeout={2000}
                        >
                            {({ copied, copy }) => (
                                <Tooltip
                                    label={copied ? "Copiado" : "Copiar"}
                                    withArrow
                                    position="right"
                                >
                                    <Button
                                        color={copied ? "green" : "gray"}
                                        leftIcon={
                                            copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />
                                        }
                                        onClick={copy}
                                    >
                                        {copied ? "Copiado" : "Copiar"}
                                    </Button>
                                </Tooltip>
                            )}
                        </CopyButton>
                    </Flex>
                </Paper>
            </Stack>
        </Modal>
    );
};

export default ShareModal;  