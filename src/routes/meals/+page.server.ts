import { getMeals } from '$lib/database.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const meals = getMeals();

    return { meals }
} ;