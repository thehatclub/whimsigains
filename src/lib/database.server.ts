import type { MealsData } from "$lib";

let meals: MealsData = {
  Breakfast: [
    {
      date: "2023-08-08",
      name: "eggs",
      calories: 200,
    },
    {
      date: "2023-08-08",
      name: "eggs",
      calories: 200,
    },
    {
      date: "2023-08-08",
      name: "eggs",
      calories: 200,
    },
    {
      date: "2023-08-08",
      name: "eggs",
      calories: 200,
    },
    {
      date: "2023-08-08",
      name: "eggs",
      calories: 200,
    },
  ],
  Lunch: [
    {
      date: "2023-08-08",
      name: "sandwich",
      calories: 1000,
    },
  ],
  Dinner: [
    {
      date: "2023-08-08",
      name: "steak",
      calories: 500,
    },
  ],
  Snack: [
    {
      date: "2023-08-08",
      name: "chips",
      calories: 40,
    },
  ],
};
export let date = new Date(Date.now()).toISOString().split("T")[0];

export function getMeals() {
  return meals;
}
