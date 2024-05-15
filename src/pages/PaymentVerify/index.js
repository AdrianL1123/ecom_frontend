import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { verifyPayment } from "../../utils/api_payment";
import { useEffect } from "react";

export default function PaymentVerify() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();
  //* extract query string from the url
  const billplz_id = searchParams.get("billplz[id]");
  const billplz_paid = searchParams.get("billplz[paid]");
  const billplz_paid_at = searchParams.get("billplz[paid_at]");
  const billplz_x_signature = searchParams.get("billplz[x_signature]");

  useEffect(() => {
    //* trigger the payment verification mutation when page load
    verifyPaymentMutation.mutate({
      billplz_id: billplz_id,
      billplz_paid: billplz_paid,
      billplz_paid_at: billplz_paid_at,
      billplz_x_signature: billplz_x_signature,
    });
  }, []);

  const verifyPaymentMutation = useMutation({
    mutationFn: verifyPayment,
    onSuccess: (order) => {
      //* check if the order is paid or not
      //* if its paid show the payment success message
      if (order.status === "paid") {
        enqueueSnackbar("Payment is successfull", {
          variant: "success",
        });
      }
      //* if its failed, show the payment failure message
      //* redirect use to orders page
      if (order.status === "failed") {
        enqueueSnackbar("Payment is unsuccessfull", {
          variant: "error",
        });
      }
      // redirect the user to /orders page
      navigate("/orders");
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  return <>Verying your payment...</>;
}
