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
      Redirecting to payment page...
    </div>
  );
}

export async function getServerSideProps(context) {
  const invoiceId = context.query.inv || Date.now().toString();
  const NOWPAYMENTS_API_KEY = "HF7WQ8T-DN3MYYY-Q145GEH-84W8NSV";
  const amountAED = 4500;
  const amountUSD = (amountAED / 3.67).toFixed(2);

  try {
    const response = await axios.post(
      "https://api.nowpayments.io/v1/invoice",
      {
        price_amount: amountUSD,
        price_currency: "usd",
        pay_currency: "usdttrc20",
        order_id: invoiceId,
        order_description: "Consulting & Facilitation Fee - Kayuaya FZ LLC",
        success_url: "https://invoices.vercel.app/success",
        cancel_url: "https://invoices.vercel.app/cancel"
      },
      {
        headers: {
          "x-api-key": NOWPAYMENTS_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    return {
      props: {
        paymentUrl: response.data.invoice_url
      }
    };

  } catch (error) {
    console.error(error.response?.data || error.message);
    return {
      props: {
        paymentUrl: null
      }
    };
  }
}
