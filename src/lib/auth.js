
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { mongoClientPromise } from "./mongodb";

const client = await mongoClientPromise;

const db = client.db(
  process.env.NODE_ENV === "production"
    ? "careconnectDB"
    : "careconnectLocalDB"
);

export const auth = betterAuth({
  // Better Auth Base URL
  baseURL: process.env.BETTER_AUTH_URL,

  // Allowed frontend origins
  trustedOrigins: [
    "http://localhost:3000",
    "https://careconnect-client-a79p.vercel.app",
  ],

  // MongoDB Database
  database: mongodbAdapter(db, {
    client,
  }),

  // Email and Password Authentication
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  // OAuth providers
  socialProviders: {
    ...(process.env.GITHUB_CLIENT_ID &&
    process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),

    ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },

  // Better Auth JWT and Next.js Cookies
  plugins: [
    jwt({
      jwt: {
        expirationTime: "1h",
      },
    }),
    nextCookies(),
  ],
});
