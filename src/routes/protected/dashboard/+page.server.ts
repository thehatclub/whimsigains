import { auth, client } from "$lib/server/lucia";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
export const actions: Actions = {
  logout: async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) return fail(401);
    await auth.invalidateSession(session.sessionId); // invalidate session
    locals.auth.setSession(null); // remove cookie
    throw redirect(302, "/"); // redirect to login page
  },
};

export const load: PageServerLoad = async ({ locals }) => {
  try {
    const meals = await grabMeals(locals.user.userId);
    const workouts = await grabWorkouts(locals.user.userId);
    return {
      userId: locals.user.userId,
      username: locals.user.username,
      meals: meals,
      workouts: workouts,
    };
  } catch (e) {
    return fail(500);
  }
};

type Meal = {
  id: string;
  name: string;
  calories: number;
  date: Date;
  time: string;
  userId: string | null;
};
type Workout = {
  id: string;
  name: string;
  calories: number;
  weight: number;
  date: Date;
  userId: string | null;
};
async function grabMeals(userId: string): Promise<Meal[] | any> {
  try {
    const seeMeals = await client.meal.findMany({
      where: {
        userId: userId,
      },
    });
    return seeMeals;
  } catch (e) {
    return e;
  } finally {
    await client.$disconnect();
  }
}
async function grabWorkouts(userId: string): Promise<Workout[] | any> {
  try {
    const seeWorkouts = await client.workout.findMany({
      where: {
        userId: userId,
      },
    });
    return seeWorkouts;
  } catch (e) {
    return e;
  } finally {
    await client.$disconnect();
  }
}
