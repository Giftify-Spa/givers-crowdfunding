import RedirectTimer from '../RedirectTimer';
import { createStyles } from '@mantine/core';

const useStyles = createStyles(() => ({
    container: {
        maxWidth: '600px',
        margin: '20px auto',
        backgroundColor: '#fff',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '5px',
    },
    header: {
        textAlign: 'center',
        paddingBottom: '20px',
    },
    headerTitle: {
        margin: 0,
        color: '#e04929',
    },
    orderDetails: {
        margin: '20px 0',
    },
    sectionTitle: {
        fontSize: '18px',
        color: '#e04929',
        borderBottom: '1px solid #ddd',
        paddingBottom: '10px',
    },
    orderSummary: {
        margin: '20px 0',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableHeader: {
        padding: '10px',
        textAlign: 'left',
        backgroundColor: '#f4f4f4',
        borderBottom: '1px solid #ddd',
    },
    tableCell: {
        padding: '10px',
        textAlign: 'left',
        borderBottom: '1px solid #ddd',
    },
    orderTotal: {
        textAlign: 'right',
        marginTop: '20px',
    },
    footer: {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '12px',
        color: '#777',
    },
}));

interface TransbankStatusResponse {
    vci: string;
    amount: number;
    status: string;
    buy_order: string;
    session_id: string;
    card_detail: {
        card_number: string;
    };
    accounting_date: string;
    transaction_date: string;
    authorization_code: string;
    payment_type_code: string;
    response_code: number;
    installments_number: number;
}

interface OrderProps {
    transbankResp: TransbankStatusResponse | null,
}

const OrderFailed = ({ transbankResp }: OrderProps) => {
    const { classes } = useStyles();
    return (
        <>
            <div className={classes.container}>
                <div className={classes.header}>
                    <h1 className={classes.headerTitle}>¡Ha ocurrido un error!</h1>
                    <p>Tu donacion no ha podido ser realizada.</p>
                </div>
                <div className={classes.orderDetails}>
                    <h2 className={classes.sectionTitle}>Detalles de la Donación</h2>
                    <p><strong>Número de Orden:</strong> #{transbankResp.session_id}</p>
                    <p><strong>Fecha:</strong> 3 de Septiembre, 2024</p>
                    <p><strong>Nombre:</strong> Juan Pérez</p>
                    <p><strong>Número de Tarjeta:</strong> XXXXXXXXXXXX{transbankResp.card_detail.card_number} </p>
                </div>
                <div className={classes.orderSummary}>
                    <h2 className={classes.sectionTitle}>Resumen de la Donación</h2>
                    <table className={classes.table}>
                        <thead>
                            <tr>
                                <th className={classes.tableHeader}>Campana</th>
                                <th className={classes.tableHeader}>Fundación</th>
                                <th className={classes.tableHeader}>Monto Donado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className={classes.tableCell}>Campaña example</td>
                                <td className={classes.tableCell}>Fundación 1</td>
                                <td className={classes.tableCell}>1500</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={classes.footer}>
                    <h3>Total: ${transbankResp.amount}</h3>
                </div>
                <div className={classes.footer}>
                    <p>Si tienes alguna pregunta, no dudes en <a href="mailto:soporte@tienda.com">contactarnos</a>.</p>
                </div>

                <RedirectTimer delayInSeconds={10} redirectTo="/" />
            </div>
        </>
    )
}

export default OrderFailed