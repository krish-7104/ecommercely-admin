import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-08-16",
});

interface VerifySessionBody {
  sessionId: string;
}

export async function POST(req: Request) {
  try {
    const { sessionId } = (await req.json()) as VerifySessionBody;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    return NextResponse.json(
      {
        id: session.id,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total,
        currency: session.currency,
        metadata: session.metadata,
        paymentIntent: session.payment_intent,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying session:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify session" },
      { status: 500 }
    );
  }
}
