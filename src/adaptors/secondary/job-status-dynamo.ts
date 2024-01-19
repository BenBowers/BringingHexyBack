import MealNotFoundError from '../../errors/MealNotFoundError';
import ServerError from '../../errors/ServerError';

import { Meal } from '../../database/entities';

const getJobStatus = async (mealId: string): Promise<string> => {
  const mealItem = (await Meal.get({ mealId })).Item;
  if (!mealItem) throw new MealNotFoundError();
  if (!mealItem.jobStatus) throw new ServerError('job status not found');
  return mealItem.jobStatus;
};

export default getJobStatus;
