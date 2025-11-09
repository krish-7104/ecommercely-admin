import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-08-16",
});

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const IS_TEST_MODE = STRIPE_SECRET_KEY.startsWith("sk_test_");
const ALLOW_INTERNATIONAL_PAYMENTS = process.env.ALLOW_INTERNATIONAL_PAYMENTS === "true";

interface CreatePaymentBody {
  paymentMethodId: string;
  amount: number;
  currency?: string;
}

export async function POST(req: Request) {
  try {
    const { paymentMethodId, amount, currency = "inr" } =
      (await req.json()) as CreatePaymentBody;

    const normalizedCurrency = currency.toLowerCase();

    if (!IS_TEST_MODE && !ALLOW_INTERNATIONAL_PAYMENTS && normalizedCurrency !== "inr") {
      return NextResponse.json(
        {
          error: "International payments are not enabled.",
          message:
            "Only INR currency is supported in live mode unless explicitly enabled.",
        },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: normalizedCurrency,
      payment_method: paymentMethodId,
      confirmation_method: "automatic",
      confirm: true,
    });

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
