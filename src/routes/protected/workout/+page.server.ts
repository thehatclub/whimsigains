import { message, superValidate } from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types";
import { z } from "zod";
import { fail } from "@sveltejs/kit";
import { client } from "$lib/server/lucia";

const workoutSchema = z.object({
  date: z.string().transform((str) => new Date(str)),
  name: z.string().min(1).max(255),
  calories: z.number().min(1).max(5000),
  weight: z.number().min(1).max(5000),
});
export type Workout = z.infer<typeof workoutSchema>;

export const load: PageServerLoad = async ({ locals, request }) => {
  const form = await superValidate(request, workoutSchema);
  return {
    form,
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const form = await superValidate(request, workoutSchema);
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    try {
      await addWorkout(form.data, locals.user, form);
      return message(form, "Workout successfully added!");
    } catch (e) {
      return message(form, "Unknown server error: " + e, { status: 500 });
    }
  },
};

async function addWorkout(formData: Workout, userId: any, form: any) {
  try {
    const newWorkout = await client.workout.create({
      data: {
        date: formData.date,
        calories: formData.calories,
        name: formData.name,
        weight: formData.weight,
        userId: userId.userId,
      },
    });
  } catch (e) {
    return message(form, e, { status: 500 });
  } finally {
    await client.$disconnect();
  }
}
