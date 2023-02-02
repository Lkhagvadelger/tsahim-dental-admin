import { prisma } from "@api/prisma";
import { appRoot } from "@util/config";
import { stripe } from "./stripe";

export const getCustomerId = async (userId: string) => {
  const customer = await prisma.payer.findFirst({
    where: {
      // userId: userId, // TODO: [MT]?
    },
  });

  if (customer) {
    return customer.id;
  }

  const newCustomer = await stripe.customers.create({
    metadata: {
      userId: userId,
    },
  });

  // await prisma.payer.create({ // TODO: [MT]?
  //   data: {
  //     id: newCustomer.id,
  //     user: {
  //       connect: {
  //         id: userId,
  //       },
  //     },
  //   },
  // });

  return newCustomer.id;
};

export const createCheckoutSession = async (userId: string, price: string) => {
  const customerId = await getCustomerId(userId);
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    billing_address_collection: "required",
    customer: customerId,
    client_reference_id: userId,
    line_items: [
      {
        price: price,
        quantity: 1,
      },
    ],
    mode: "payment",
    allow_promotion_codes: true,
    success_url: appRoot,
    cancel_url: appRoot,
  });

  return checkoutSession;
};
export const getSubscriptionStatus = async (subId: string) => {
  const subscriptions = await stripe.subscriptions.retrieve(subId);
  console.log(subscriptions)
};

export const createPortalSession = async (userId: string) => {
  const customerId = await getCustomerId(userId);

  const billingPortal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appRoot}/account`,
  });

  return billingPortal;
};
