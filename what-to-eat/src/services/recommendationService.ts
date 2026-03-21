import { ScoredMeal, MealIngredient } from '../types';
import { fetchAllMealsWithIngredients } from './mealService';
import { fetchInventory } from './inventoryService';

export async function getRecommendations(): Promise<ScoredMeal[]> {
  const [inventory, meals] = await Promise.all([
    fetchInventory(),
    fetchAllMealsWithIngredients(),
  ]);

  // Exclude out-of-stock items (quantity <= 0)
  const inventoryNames = inventory
    .filter((item) => {
      const n = parseInt(item.quantity ?? '', 10);
      return isNaN(n) ? true : n > 0;
    })
    .map((item) => item.name.toLowerCase());

  const scored: ScoredMeal[] = meals.map((meal) => {
    const ingredients: MealIngredient[] = meal.meal_ingredients ?? [];
    const ingredientNames = ingredients.map((i) => i.ingredient_name.toLowerCase());

    const matchedIngredients: string[] = [];
    const missingIngredients: string[] = [];

    for (const ing of ingredientNames) {
      const matched = inventoryNames.some(
        (inv) => inv.includes(ing) || ing.includes(inv)
      );
      if (matched) {
        matchedIngredients.push(ing);
      } else {
        missingIngredients.push(ing);
      }
    }

    const matchPercent =
      ingredients.length > 0 ? matchedIngredients.length / ingredients.length : 0;

    const daysSinceLastMade = meal.last_made_at
      ? (Date.now() - new Date(meal.last_made_at).getTime()) / (1000 * 60 * 60 * 24)
      : 999;

    const score = matchPercent * 100 + daysSinceLastMade * 2;

    return {
      ...meal,
      ingredients,
      matchedIngredients,
      missingIngredients,
      score,
      daysSinceLastMade,
    };
  });

  return scored
    .filter((m) => m.score > 50)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
