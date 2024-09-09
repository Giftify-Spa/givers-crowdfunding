import axios from "axios";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useLocation } from "react-router-dom";
import OrderFailed from "./order/OrderFailed";
import OrderSuccess from "./order/OrderSuccess";

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
            import.meta.env.VITE_API_URL_TRANSBANK_STATUS_PROD as string, {
            params: {
              token_ws: token_ws,
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

  if (transbankResp.status == "FAILED") {
    return <OrderFailed transbankResp={transbankResp} />
  }

  return (
    <OrderSuccess transbankResp={transbankResp} />
  );
};


export default TransactionStatus;
