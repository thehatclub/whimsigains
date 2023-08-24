import { message, superValidate } from "sveltekit-superforms/server";
import { z } from "zod";
import { fail } from "@sveltejs/kit";
import { client } from "$lib/server/lucia";

const mealSchema = z.object({
  date: z.string().transform((str) => new Date(str)),
  name: z.string().min(1).max(255),
  calories: z.number().min(1).max(5000),
  meal_time: z.enum(["breakfast", "lunch", "dinner", "snack"]),
});
export type Meal = z.infer<typeof mealSchema>;

export async function load({ locals, request }) {
  const form = await superValidate(request, mealSchema);
  return {
    form,
  };
}

export const actions = {
  default: async ({ request, locals }) => {
    const form = await superValidate(request, mealSchema);
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    try {
      await addMeal(form.data, locals.user, form);
      return message(form, "Meal successfully added!");
    } catch (e) {
      return message(form, "Unknown server error: " + e, { status: 500 });
    }
  },
};

async function addMeal(formData: Meal, userId: any, form: any) {
  try {
    const newMeal = await client.meal.create({
      data: {
        date: formData.date,
        calories: formData.calories,
        name: formData.name,
        time: formData.meal_time,
        userId: userId.userId,
      },
    });
  } catch (e) {
    return message(form, e, { status: 500 });
  } finally {
    await client.$disconnect();
  }
}
