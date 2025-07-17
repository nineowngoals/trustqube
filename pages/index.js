import { useEffect } from 'react';
import axios from 'axios';

export default function Home({ paymentUrl }) {
  useEffect(() => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }, [paymentUrl]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <p>Redirecting to payment page...</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  const invoiceId = context.query.inv || `INV-${Date.now()}`;
  const NOWPAYMENTS_API_KEY = "HF7WQ8T-DN3MYYY-Q145GEH-84W8NSV";
  const amountUSD = 1280;

  try {
    const response = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      {
        price_amount: amountUSD,
        price_currency: "usd",
        pay_currency: "usdttrc20",
        order_id: `${invoiceId} - #OOLU9381872`,
        order_description: `Settlement #OOLU9381872 - ${invoiceId}`,
        // ipn_callback_url: "https://yourdomain.com/api/nowpayments-webhook" // Optional
      },
      {
        headers: {
          "x-api-key": NOWPAYMENTS_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    const paymentUrl = response.data?.invoice_url || null;

    return {
      props: {
        paymentUrl
      }
    };

  } catch (error) {
    console.error("NowPayments error:", error.response?.data || error.message);
    return {
      props: {
        paymentUrl: null
      }
    };
  }
}
