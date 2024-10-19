/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useLocation } from "react-router-dom";

interface TransbankResponse {
  url_pago: string;
  token_ws: string;
}

const TransbankRequest = () => {
  const [transbankResp, setTransbankResp] = useState<TransbankResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  const location = useLocation();

  const { order, campaignId, userId } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderId = order.id;
        const amount = order.contributionAmount;

        const { data } = await axios.get<TransbankResponse>(import.meta.env.VITE_API_URL_TRANSBANK_CREATE_DEV_LOCAL as string, {
          params: {
            orderId,
            userId,
            amount,
            status: order.status,
            os: order.os,
            campaignId,

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
  }, [order]);

  useEffect(() => {
    if (transbankResp && formRef.current) {
      formRef.current.submit();
    }
  }, [transbankResp]);

  return (
    <>
      {isLoading && (
        <LoadingSpinner position="center"/>
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
