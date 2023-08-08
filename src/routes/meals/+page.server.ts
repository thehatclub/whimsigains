import { getMeals, date } from "$lib/database.server";
import type { MealsData } from "$lib";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const meals: MealsData = getMeals();

  return { meals, date };
};
