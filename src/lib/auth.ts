import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { getMongoDb } from "./db";

const { client, db } = await getMongoDb();
const appUrl = process.env.BETTER_AUTH_URL;

if (!appUrl) {
  throw new Error("BETTER_AUTH_URL is missing in .env.local");
}

export const auth = betterAuth({
  baseURL: appUrl,
  trustedOrigins: ["http://localhost:3000", appUrl],
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  plugins: [jwt()],
});



