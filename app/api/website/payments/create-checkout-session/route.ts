import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-08-16",
});

interface CreateCheckoutSessionBody {
  amount: number;
  orderData: {
    userId: string;
    total: number;
    products: Array<{
      productId: string;
      name: string;
      price: number;
      quantity: number;
      category: string;
    }>;
  };
  customerEmail?: string;
}

export async function POST(req: Request) {
  try {
    const { amount, orderData, customerEmail } = (await req.json()) as CreateCheckoutSessionBody;

    const currency = "inr"; // ✅ force INR
    const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000";

    const lineItems = orderData.products.map((product) => ({
      price_data: {
        currency,
        product_data: {
          name: product.name,
          description: `${product.category} (x${product.quantity})`,
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment/cancel`,
      customer_email: customerEmail,
      billing_address_collection: "required",
      currency,
      metadata: {
        userId: orderData.userId,
        orderTotal: orderData.total.toString(),
        orderData: JSON.stringify(orderData),
      },
    });

    return NextResponse.json(
      {
        sessionId: session.id,
        url: session.url,
        testMode: true,
        message: "INR test mode: use card 4242 4242 4242 4242 to simulate a payment.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
