import { auth } from "$lib/server/lucia";
import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  // we can pass `event` because we used the SvelteKit middleware
  event.locals.auth = auth.handleRequest(event);

  if (event.url.pathname.startsWith("/protected")) {
    if (!(await event.locals.auth.validate())) {
      throw redirect(303, "/");
    }
  }

  return await resolve(event);
};
