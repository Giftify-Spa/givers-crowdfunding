import axios from "axios";
import { useEffect, useState, useRef } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useLocation } from "react-router-dom";

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

const TransactionStatus = () => {
  const [transbankResp, setTransbankResp] = useState<TransbankStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token_ws = queryParams.get("token");

    if (token_ws) {
      const fetchData = async () => {
        try {
          const { data } = await axios.get<TransbankStatusResponse>(
            import.meta.env.VITE_API_URL_TRANSBANK_STATUS_DEV_LOCAL as string, {
            params: {
              token_ws: token_ws
            }
          });
          console.log(data);
          setTransbankResp(data);
        } catch (error) {
          console.error("Error fetching data from Transbank API", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [location.search]);


  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!transbankResp) {
    return <p>No se encontraron datos de la transacción.</p>;
  }

  return (
    <div>
      <h1>Transaction Status</h1>
      <p><strong>Amount:</strong> {transbankResp.amount}</p>
      <p><strong>Status:</strong> {transbankResp.status}</p>
      <p><strong>Order:</strong> {transbankResp.buy_order}</p>
      <p><strong>Session ID:</strong> {transbankResp.session_id}</p>
      <p><strong>Card Last Digits:</strong> {transbankResp.card_detail.card_number.slice(-4)}</p>
      <p><strong>Accounting Date:</strong> {transbankResp.accounting_date}</p>
      <p><strong>Transaction Date:</strong> {transbankResp.transaction_date}</p>
      <p><strong>Authorization Code:</strong> {transbankResp.authorization_code}</p>
      <p><strong>Payment Type Code:</strong> {transbankResp.payment_type_code}</p>
      <p><strong>Response Code:</strong> {transbankResp.response_code}</p>
      <p><strong>Installments Number:</strong> {transbankResp.installments_number}</p>
    </div>
  );
};

export default TransactionStatus;
