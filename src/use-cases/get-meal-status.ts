import { MealStatus } from '../../tests/integration/types';
import { getMealStatus as getMealStatusDynamo } from '../adaptors/secondary/meal-status-dynamo';
export const getMealStatus = (mealId: string): Promise<MealStatus> => {
  return getMealStatusDynamo(mealId);
};
