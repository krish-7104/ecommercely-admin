import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-08-16",
});

interface CreatePaymentBody {
  paymentMethodId: string;
  amount: number;
}

export async function POST(req: Request) {
  try {
    const { paymentMethodId, amount } = await req.json() as CreatePaymentBody;

    const paymentIntent = await stripe.paymentIntents.create({
      payment_method: paymentMethodId,
      amount: amount,
      currency: "inr",
      confirmation_method: "automatic",
    });

    return new NextResponse(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse("Failed to create session", {
      status: 500,
    });
  }
}
