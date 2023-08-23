import { auth } from "$lib/server/lucia";
import { LuciaError } from "lucia";
import { fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { message, setError, superValidate } from "sveltekit-superforms/server";

import type { PageServerLoad, Actions } from "./$types";

const loginSchema = z.object({
  username: z.string().min(1).max(31).trim(),
  password: z.string().min(1).max(255).trim(),
});

export const load: PageServerLoad = async ({ locals, request }) => {
  if (await locals.auth.validate()) {
    throw redirect(302, "/protected");
  }
  const form = await superValidate(request, loginSchema);
  return {
    form,
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await superValidate(request, loginSchema);
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    const username = form.data.username;
    const password = form.data.password;
    try {
      // find user by key
      // and validate password
      const key = await auth.useKey("username", username, password);
      const session = await auth.createSession({
        userId: key.userId.toLowerCase(),
        attributes: {},
      });
      locals.auth.setSession(session); // set session cookie
    } catch (e) {
      if (
        e instanceof LuciaError &&
        (e.message === "AUTH_INVALID_KEY_ID" ||
          e.message === "AUTH_INVALID_PASSWORD")
      ) {
        // user does not exist
        // or invalid password
        return setError(form, "password", "Incorrect username or password");
      }
      return message(form, "Unknown server error", { status: 500 });
    }
    // redirect to
    // make sure you don't throw inside a try/catch block!
    throw redirect(302, "/protected");
  },
};
