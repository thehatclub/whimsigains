import { auth } from "$lib/server/lucia";
import { fail, redirect } from "@sveltejs/kit";
import { grabItem, deleteItem, calories } from "$lib/server/prisma";

export const actions = {
  delete: async ({ locals, request }) => {
    const data = Object.fromEntries(await request.formData());

    await deleteItem(locals.user.userId, data.inputId, data.table);
  },
  logout: async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) return fail(401);
    await auth.invalidateSession(session.sessionId); // invalidate session
    locals.auth.setSession(null); // remove cookie
    throw redirect(302, "/"); // redirect to login page
  },
};

export async function load({ locals }) {
  try {
    const items = await grabItem(locals.user.userId);
    const calorieData = await calories(locals.user.userId);
    return {
      userId: locals.user.userId,
      username: locals.user.username,
      meals: items.seeMeals,
      workouts: items.seeWorkouts,
      calorieGoal: calorieData.user.calorieGoal,
      calorieWorkout: calorieData.workoutCal,
      calorieMeal: calorieData.mealCal,
    };
  } catch (e) {
    return fail(500);
  }
}
