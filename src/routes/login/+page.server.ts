import { auth } from "$lib/server/lucia";
import { LuciaError } from "lucia";
import { fail, redirect } from "@sveltejs/kit";
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
    const loginSchema = z.object({
      username: z.string().min(1).max(31).trim(),
      password: z.string().min(1).max(255).trim(),
    });
    const username = formDataObj.username;
    const password = formDataObj.password;

    try {
      loginSchema.parse(formDataObj);
      // find user by key
      // and validate password
      const key = await auth.useKey(
        "username",
        username as string,
        password as string
      );
      const session = await auth.createSession({
        userId: key.userId,
        attributes: {},
      });
      locals.auth.setSession(session); // set session cookie
    } catch (e) {
      if (e instanceof ZodError) {
        const { fieldErrors: error } = e.flatten();
        const { password, ...rest } = formDataObj;

        return fail(400, {
          data: rest,
          error,
        });
      }
      if (
        e instanceof LuciaError &&
        (e.message === "AUTH_INVALID_KEY_ID" ||
          e.message === "AUTH_INVALID_PASSWORD")
      ) {
        // user does not exist
        // or invalid password
        return fail(400, {
          message: "Incorrect username or password",
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
