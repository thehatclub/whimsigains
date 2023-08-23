import { client } from "$lib/server/lucia";

export async function grabItem(userId: string): Promise<any> {
  try {
    const seeMeals = await client.meal.findMany({
      where: {
        userId: userId,
      },
    });
    const seeWorkouts = await client.workout.findMany({
      where: {
        userId: userId,
      },
    });
    return { seeMeals, seeWorkouts };
  } catch (e) {
    return e;
  } finally {
    await client.$disconnect();
  }
}
export async function deleteItem(userId: any, inputId: any, table: any) {
  try {
    if (table === "meal") {
      const removeMeal = await client.meal.delete({
        where: {
          userId: userId.userId,
          id: inputId,
        },
      });
    } else if (table === "workout") {
      const removeWorkout = await client.workout.delete({
        where: {
          userId: userId.userId,
          id: inputId,
        },
      });
    }
  } catch (e) {
    return e;
  } finally {
    await client.$disconnect();
  }
}
export async function calories(userId: any): Promise<any> {
  try {
    const user = await client.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        meals: true,
        workouts: true,
      },
    });
    let workoutCal: number = 0;
    let mealCal: number = 0;
    if (user?.workouts && user?.meals) {
      for (let i = 0; i < user?.workouts.length; i++) {
        workoutCal += user?.workouts[i].calories;
      }
      for (let i = 0; i < user?.meals.length; i++) {
        mealCal += user?.meals[i].calories;
      }
    }
    return { user, workoutCal, mealCal };
  } catch (e) {
    return e;
  } finally {
    await client.$disconnect();
  }
}
