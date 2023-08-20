import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";
import { dev } from "$app/environment";
import { prisma } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";

export const client = new PrismaClient();

export const auth = lucia({
  adapter: prisma(client, {
    user: "user",
    session: "session",
    key: "key",
  }),
  middleware: sveltekit(),
  env: dev ? "DEV" : "PROD",
  getUserAttributes: (data) => {
    return {
      username: data.username,
    };
  },
});

export type Auth = typeof auth;
