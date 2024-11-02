import { Modal } from '@mantine/core';
import { Foundation } from '../interfaces/Foundation';

interface CustomModalProps {
    opened: boolean;
    closeModal: () => void;
    foundation: Foundation;
}

export const DetailModal = ({ opened, closeModal, foundation }: CustomModalProps) => {

    console.log(foundation);
    return (
        <>
            <Modal opened={opened} onClose={closeModal} title="Información Fundación" centered>
                {/* Contenido del Modal */}
                Nombre Fundación:
                {foundation?.name}
                Información Bancaria:
            </Modal>
        </>
    );
}