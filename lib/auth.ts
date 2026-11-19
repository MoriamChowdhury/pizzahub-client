import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { APIError } from "better-auth/api";
import { client, db } from "./db";

const PROTECTED_FIELDS = [
  "role",
  "isBlocked",
  "subscriptionPlan",
  "subscriptionExpiresAt",
];

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
      businessName: { type: "string", required: false, input: true },
      subscriptionPlan: { type: "string", required: false, defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Admin kokhono public signup e toiri hobe na
          const role = (user as any).role === "vendor" ? "vendor" : "customer";
          return {
            data: { ...user, role, isBlocked: false, subscriptionPlan: "free" },
          };
        },
      },
      update: {
        before: async (data) => {
          // User nijer role/subscription change korte parbe na
          for (const key of PROTECTED_FIELDS) {
            if (key in data) {
              throw new APIError("FORBIDDEN", {
                message: "You cannot change this field",
              });
            }
          }
          return { data };
        },
      },
    },
  },

  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          role: (user as any).role,
        }),
      },
    }),
    nextCookies(), // shobar sheshe thakte hobe
  ],
});