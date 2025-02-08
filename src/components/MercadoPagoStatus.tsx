/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { Contribution } from "../interfaces/Contribution";
import { getContribution } from "../firebase/services/contributions/getContribution";
import OrderSuccess from "./order/OrderSuccess";
import { showNotification } from "@mantine/notifications";
import { IconSquareRoundedX } from "@tabler/icons-react";
import { callSendEmail } from "../firebase/service";


const MercadoPagoStatus = () => {
  const [donationResp, setDonationResp] = useState<Contribution | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const status = searchParams.get("status");
  const campaignId = searchParams.get("campaignId") || "";


  useEffect(() => {

    if (orderId) {
      const fetchData = async () => {
        try {
          const response = await getContribution(orderId);
          setDonationResp(response);

          const payload = {
            body: JSON.stringify({
              toAddresses: "daguilera@kairapp.com",
              subject: "Givers - Donacion Realizada",
              body: "Hola",
              donation: {
                orderNumber: response.id,
                paymentMethod: response.payment,
                campaign: response.campaign.name,
                foundation: response.foundation.name,
                amount: response.amount,
                date: "2025-09-01",
                username: response.user.name
              }
            })
          };

          // Call to send email to the donor
          await callSendEmail(payload);

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
    return <LoadingSpinner position="center" />;
  }

  if (status === "FAILURE") {
    showNotification({
      title: "Donación fallida",
      message: "La donación no se ha realizado correctamente.",
      color: "red",
      icon: <IconSquareRoundedX size={18} />,
    });

    // If donationResp exists, we use its campaignId, otherwise we redirect to the home page or another default route
    return <Navigate to={campaignId ? `/campaign/${campaignId}` : "/"} />;
  }

  // If the status is approved and we have the contribution information, we show OrderSuccess
  if (status === "APPROVED" && donationResp) {
    return <OrderSuccess donationResp={donationResp} />;
  }

  return (
    <div>
      <p>Error: No se encontraron datos de la donación o el status es incorrecto.</p>
    </div>
  );
};


export default MercadoPagoStatus;
