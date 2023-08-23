import { auth } from "$lib/server/lucia";
import { redirect, type Handle } from "@sveltejs/kit";
export const handle: Handle = async ({ event, resolve }) => {
  // we can pass `event` because we used the SvelteKit middleware

  event.locals.auth = auth.handleRequest(event);
  const session = await event.locals.auth.validate();
  if (event.url.pathname.startsWith("/protected")) {
    if (!session) {
      throw redirect(303, "/");
    }
    event.locals.user = {
      userId: session.user.userId,
      username: session.user.username,
    };
  }

  return await resolve(event);
};
