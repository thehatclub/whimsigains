type Meal = {
    date: number,
    name: string,
    calories: number,
    meal_time: string,
}
const meals: Meal[] = [
    {
        date: Date.now(),
        name: "steak",
        calories: 500,
        meal_time: 'breakfast',
    }
]

export function getMeals() {
    return meals;
}