export type Meal = {
  date: string;
  name: string;
  calories: number;
};

export type MealsData = {
  Breakfast: Meal[];
  Lunch: Meal[];
  Dinner: Meal[];
  Snack: Meal[];
};
