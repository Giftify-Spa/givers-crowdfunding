import {
  Modal,
  Paper,
  Text,
  Button,
  Group,
  createStyles,
  rem,
  Drawer,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Wallet } from "@mercadopago/sdk-react";

interface IProps {
  opened: boolean;
  onClose: () => void;
  preferenceId: string | null;
}

const useStyles = createStyles((theme) => ({
  modalContent: {
    textAlign: "center",
    padding: theme.spacing.md,
  },
  title: {
    margin: 0,
    fontSize: rem(22),
    fontWeight: 700,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: rem(14),
    color: theme.colors.gray[7],
    marginBottom: theme.spacing.md,
  }
}));

const PaymentModal = ({ opened, onClose, preferenceId }: IProps) => {
  const { classes } = useStyles();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const content = (
    <Paper className={classes.modalContent} radius="md" shadow="sm">
      <h2 className={classes.title}>¿Estás seguro de realizar esta donación?</h2>
      <Text className={classes.description}>
        Al continuar, serás redirigido al proceso de pago seguro de Mercado Pago.
      </Text>

      <Group position="center">
        {preferenceId && (
          <Wallet
            initialization={{
              preferenceId,
              redirectMode: 'self'
            }}
          />
        )}
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </Group>
    </Paper>
  );

  if (isMobile) {
    return (
      <Drawer
        opened={opened}
        onClose={onClose}
        position="bottom"
        withCloseButton={false}
        size="100%"
        // Ajustes opcionales para centrar el contenido dentro del Drawer:
        styles={{
          body: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered
      size="sm"
      xOffset="0vw"
      yOffset="0vh"
    >
      {content}
    </Modal>
  );
};

export default PaymentModal;
