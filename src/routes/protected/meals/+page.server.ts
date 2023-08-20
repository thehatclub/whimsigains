import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
  },
};
