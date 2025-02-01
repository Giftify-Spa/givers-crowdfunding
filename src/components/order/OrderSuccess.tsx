import { createStyles } from "@mantine/core";
// import RedirectTimer from "../RedirectTimer";
import { Contribution } from "../../interfaces/Contribution";
import { formattingToCLPNumber } from "../../helpers/formatCurrency";


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
        color: '#5cb85c',
    },
    orderDetails: {
        margin: '20px 0',
    },
    sectionTitle: {
        fontSize: '18px',
        color: '#5cb85c',
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

interface OrderProps {
    donationResp: Contribution | null,
}

const OrderSuccess = ({ donationResp }: OrderProps) => {
    const { classes } = useStyles();
    console.log("donationResp", donationResp);
    return (
        <>
            <div className={classes.container}>
                <div className={classes.header}>
                    <h1 className={classes.headerTitle}>¡Gracias por tu donación!</h1>
                    <p>Tu donacion ha sido confirmada.</p>
                </div>
                <div className={classes.orderDetails}>
                    <h2 className={classes.sectionTitle}>Detalles de la Donación</h2>
                    <p><strong>Número de Orden: </strong> #</p>
                    <p><strong>Fecha: </strong> 3 de Septiembre, 2024</p>
                    <p><strong>Nombre: </strong>{donationResp.user.name}</p>
                    <p><strong>Tipo de Pago: </strong> {donationResp.mp_response.payment_type === "account_money" ? "Cartera Mercadopago" : "Tarjeta"} </p>
                    <p><strong>Número de Tarjeta: </strong> {donationResp.mp_response.payment_type === "account_money" ? "No aplica" : "XXXXXX"} </p>
                </div>
                <div className={classes.orderSummary}>
                    <h2 className={classes.sectionTitle}>Resumen de la Donación</h2>
                    <table className={classes.table}>
                        <thead>
                            <tr>
                                <th className={classes.tableHeader}>Campaña</th>
                                <th className={classes.tableHeader}>Fundación</th>
                                <th className={classes.tableHeader}>Monto Donado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className={classes.tableCell}>{donationResp.campaign.name}</td>
                                <td className={classes.tableCell}>{donationResp.foundation.name}</td>
                                <td className={classes.tableCell}>{formattingToCLPNumber(donationResp.amount)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={classes.footer}>
                    <h3>Total: {formattingToCLPNumber(donationResp.amount)}</h3>
                </div>
                <div className={classes.footer}>
                    <p>Si tienes alguna pregunta, no dudes en <a href="mailto:soporte@tienda.com">contactarnos</a>.</p>
                </div>

                {/* <RedirectTimer delayInSeconds={15} redirectTo="/" /> */}
            </div>
        </>
    )
}

export default OrderSuccess