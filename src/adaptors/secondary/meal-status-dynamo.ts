import MealNotFoundError from '../../errors/MealNotFoundError';
import ServerError from '../../errors/ServerError';

import { MealStatus } from '../../../tests/integration/types';
import { Meal } from '../../database/entities';

export const getMealStatus = async (mealId: string): Promise<MealStatus> => {
  let mealItem;
  try {
    mealItem = (await Meal.get({ mealId })).Item;
  } catch (error) {
    if (error instanceof Error) {
      throw new ServerError(error.name + ': ' + error.message);
    }
    throw new ServerError('UnknownError');
  }
  if (!mealItem) throw new MealNotFoundError();
  if (!mealItem.status) throw new ServerError('meal status not found');
  return mealItem.status as MealStatus;
};
