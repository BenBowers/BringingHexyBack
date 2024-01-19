import MealNotFoundError from '../../errors/MealNotFoundError';
import ServerError from '../../errors/ServerError';

import { Meal } from '../../database/entities';

const getJobStatus = async (mealId: string): Promise<string> => {
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
  if (!mealItem.jobStatus) throw new ServerError('job status not found');
  return mealItem.jobStatus;
};

export default getJobStatus;
