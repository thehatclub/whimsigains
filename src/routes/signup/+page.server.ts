import { auth } from "$lib/server/lucia";
import { fail, redirect } from "@sveltejs/kit";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { message, setError, superValidate } from "sveltekit-superforms/server";

const signupSchema = z
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

export async function load(event) {
  const form = await superValidate(event, signupSchema);
  return {
    form,
  };
}

export const actions = {
  default: async ({ request, locals }) => {
    const form = await superValidate(request, signupSchema);
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    const username = form.data.username;
    const password = form.data.password;
    try {
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
      // check for unique constraint error in user table
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        return setError(form, "username", "E-mail already exists.");
      }
      return message(form, "Unknown server error", { status: 500 });
    }
    // redirect to
    // make sure you don't throw inside a try/catch block!
    throw redirect(302, "/protected");
  },
};
