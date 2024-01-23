export type MealStatus = 'COMPLETED' | 'FAILED' | 'IN_PROGRESS' | 'PENDING';
export type MealType = 'PIZZA';

export type MealDetails = {
  imageLocation: string;
  status: MealStatus;
  mealPrompt: string;
  mealParameters: string;
  mealType: MealType;
};

export type Meal = {
  mealId: string;
  jobId: string;
} & MealDetails;
