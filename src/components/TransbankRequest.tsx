import axios from "axios";
import { useEffect, useState, useRef } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface TransbankResponse {
  url_pago: string;
  token_ws: string;
}

const TransbankRequest = () => {
  const [transbankResp, setTransbankResp] = useState<TransbankResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderId = "1lD4aUlaDOu1z6ilbMOr";
        const amount = 4500;

        const { data } = await axios.get<TransbankResponse>(import.meta.env.VITE_API_URL_TRANSBANK_CREATE_DEV_LOCAL as string, {
          params: {
            orderId,
            amount,
            status: "INITIALIZED",
            os: "WEB"
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
  }, []);

  useEffect(() => {
    if (transbankResp && formRef.current) {
      formRef.current.submit();
    }
  }, [transbankResp]);

  return (
    <>
      {isLoading && (
        <LoadingSpinner />
      )}
      <form
        ref={formRef}
        action={transbankResp?.url_pago}
        method="post"
        name="form"
        style={{ display: isLoading ? "none" : "block" }}
      >
        <input type="hidden" name="token_ws" value={transbankResp?.token_ws} />
      </form>
    </>
  );
};

export default TransbankRequest;
