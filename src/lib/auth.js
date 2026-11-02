import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { mongoClientPromise } from "./mongodb";

const client = await mongoClientPromise;
const db = client.db("careconnectDB");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  // OAuth providers are enabled only when their credentials exist in env.
  socialProviders: {
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },

  // JWTs issued for protected Express APIs. Issuer/audience default to the
  // Better Auth baseURL (BETTER_AUTH_URL) — Render must use the same origin
  // as CLIENT_URL when verifying.
  plugins: [
    jwt({
      jwt: {
        expirationTime: "1h",
      },
    }),
    nextCookies(),
  ],
});
