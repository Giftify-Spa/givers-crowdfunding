import TransactionStatus from "../../components/TransactionStatus";
import TransbankRequest from "../../components/TransbankRequest";


export const transbankRoutes = [
    {
        path: "request",
        element: <TransbankRequest />
    },
    {
        path: "transaction-result",
        element: <TransactionStatus />
    }
];