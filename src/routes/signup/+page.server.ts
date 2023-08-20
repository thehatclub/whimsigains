import { auth } from "$lib/server/lucia";
import { fail, redirect } from "@sveltejs/kit";
import { Prisma } from "@prisma/client";
import { ZodError, z } from "zod";

import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (session) throw redirect(302, "/");
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const formDataObj = Object.fromEntries(formData.entries());
    const loginSchema = z
      .object({
        username: z.string().min(4).max(31).trim(),
        password: z.string().min(6).max(255).trim(),
        passwordConfirm: z.string().min(6).max(255).trim(),
      })
      .superRefine(({ passwordConfirm, password }, ctx) => {
        if (passwordConfirm !== password) {
          ctx.addIssue({
            code: "custom",
            message: "The passwords did not match",
            path: ["passwordConfirm"],
          });
        }
      });
    const username: string = formDataObj.username as string;
    const password: string = formDataObj.password as string;

    try {
      const result = loginSchema.parse(formDataObj);
      const user = await auth.createUser({
        key: {
          providerId: "username", // auth method
          providerUserId: username.toLowerCase(), // unique id when using "username" auth method
          password, // hashed by Lucia
        },
        attributes: {
          username,
        },
      });
      const session = await auth.createSession({
        userId: user.userId,
        attributes: {},
      });
      locals.auth.setSession(session); // set session cookie
    } catch (e: any) {
      if (e instanceof ZodError) {
        const { fieldErrors: error } = e.flatten();
        const { password, ...rest } = formDataObj;

        return fail(400, {
          data: rest,
          error,
        });
      }
      // check for unique constraint error in user table
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        return fail(400, {
          message: "Username already taken",
        });
      }
      return fail(500, {
        message: "An unknown error occurred",
      });
    }
    // redirect to
    // make sure you don't throw inside a try/catch block!
    throw redirect(302, "/");
  },
};
