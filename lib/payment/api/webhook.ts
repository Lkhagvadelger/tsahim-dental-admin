import { PriceType, SubscriptionStatus } from "@prisma/client";
import Stripe from "stripe";
import { prisma } from "@api/prisma";
import { stripe } from "./stripe";

const timestampToDate = (t?: number | null) => {
  if (!t) return null;
  return new Date(t * 1000);
};

export const buffer = async (readable: any) => {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

export const handleStripeEvent = async (buf: Buffer, sig: string) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.log(`❌ Error message: ${err?.message}`);
    throw new Error(`Webhook Error: ${err?.message}`);
  }

  if (relevantEvents.has(event.type)) {
    switch (event.type) {
      case "product.created":
      case "product.updated":
        // eslint-disable-next-line no-case-declarations
        const data = event.data.object as Stripe.Product;
        await prisma.product.update({
          where: {
            id: data.id,
          },
          data: {
            name: data.name,
            description: data.description,
            active: data.active,
            metadata: data.metadata,
          },
          // create: {
          //   id: data.id,
          //   name: data.name,
          //   description: data.description,
          //   active: data.active,
          //   metadata: data.metadata,
          //   specialist: //specialist must be provided
          // },
        });
        break;
      case "price.created":
      case "price.updated": {
        const data = event.data.object as Stripe.Price;
        await prisma.price.upsert({
          where: {
            id: data.id,
          },
          update: {
            active: data.active,
            currency: data.currency,
            type: data.type as PriceType,
            unitAmount: data.unit_amount,
            interval: data.recurring?.interval,
            intervalCount: data.recurring?.interval_count,
            trialPeriodDays: data.recurring?.trial_period_days,
          },
          create: {
            id: data.id,
            active: data.active,
            currency: data.currency,
            type: data.type as PriceType,
            unitAmount: data.unit_amount,
            interval: data.recurring?.interval,
            intervalCount: data.recurring?.interval_count,
            trialPeriodDays: data.recurring?.trial_period_days,
            product: {
              connect: {
                id: data.product as string,
              },
            },
          },
        });
        break;
      }
      case "customer.subscription.deleted": {
        const data = event.data.object as Stripe.Subscription;
        await prisma.subscription.delete({
          where: {
            id: data.id,
          },
        });

        break;
      }
      case "customer.subscription.updated": {
        const data = event.data.object as Stripe.Subscription;
        await prisma.subscription.update({
          where: {
            id: data.id,
          },
          data: {
            price: {
              connect: {
                id: data.items.data[0].price.id,
              },
            },
            status: data.status,
            metadata: data.metadata,
            cancelAtPeriodEnd: data.cancel_at_period_end,
            canceledAt: timestampToDate(data.canceled_at),
            cancelAt: timestampToDate(data.cancel_at),
            startDate: timestampToDate(data.start_date),
            endedAt: timestampToDate(data.ended_at),
            trialStart: timestampToDate(data.trial_start),
            trialEnd: timestampToDate(data.trial_end),
          },
        });
        break;
      }
      case "checkout.session.completed":
        {
          const data = event.data.object as Stripe.Checkout.Session;
          const subscription = await stripe.subscriptions.retrieve(
            data.subscription as string,
            {
              expand: ["default_payment_method"],
            }
          );

          await prisma.subscription.upsert({
            where: {
              id: subscription.id,
            },
            create: {
              id: subscription.id,
              user: {
                connect: {
                  id: data.client_reference_id || undefined,
                },
              },
              price: {
                connect: {
                  id: subscription.items.data[0].price.id,
                },
              },
              status: subscription.status as SubscriptionStatus,
              metadata: subscription.metadata,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              canceledAt: timestampToDate(subscription.canceled_at),
              cancelAt: timestampToDate(subscription.cancel_at),
              startDate: timestampToDate(subscription.start_date),
              endedAt: timestampToDate(subscription.ended_at),
              trialStart: timestampToDate(subscription.trial_start),
              trialEnd: timestampToDate(subscription.trial_end),
            },
            update: {
              status: subscription.status as SubscriptionStatus,
              metadata: subscription.metadata,
              price: {
                connect: {
                  id: subscription.items.data[0].price.id,
                },
              },
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              canceledAt: timestampToDate(subscription.canceled_at),
              cancelAt: timestampToDate(subscription.cancel_at),
              startDate: timestampToDate(subscription.start_date),
              endedAt: timestampToDate(subscription.ended_at),
              trialStart: timestampToDate(subscription.trial_start),
              trialEnd: timestampToDate(subscription.trial_end),
            },
          });
        }

        break;
      default:
        throw new Error(`Unhandled relevant event! ${event.type}`);
    }
  }

  return true;
};
