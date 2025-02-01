/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { Contribution } from "../interfaces/Contribution";
import { getContribution } from "../firebase/services/contributions/getContribution";
import OrderSuccess from "./order/OrderSuccess";


const MercadoPagoSuccess = () => {
  const [donationResp, setDonationResp] = useState<Contribution | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const status = searchParams.get("status");


  useEffect(() => {

    if (orderId && status === "APPROVED") {
      const fetchData = async () => {
        try {
          const response = await getContribution(orderId);
          setDonationResp(response);
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
  }, []);


  if (isLoading) {
    return <LoadingSpinner  position="center" />;
  }

  // if (!transbankResp) {
  //   return <p>No se encontraron datos de la transacción.</p>;
  // }

  // if (transbankResp.status == "FAILED") {
  //   return <OrderFailed transbankResp={transbankResp} />
  // }

  return (
    <OrderSuccess donationResp={donationResp} />
  );
};


export default MercadoPagoSuccess;
