export type JobStatus = 'COMPLETED' | 'FAILED' | 'IN_PROGRESS' | 'PENDING';
export type MealType = 'PIZZA';

export type MealDetails = {
  imageLocation: string;
  jobStatus: JobStatus;
  mealPrompt: string;
  mealParameters: string;
  mealType: MealType;
};

export type Meal = {
  mealId: string;
  jobId: string;
} & MealDetails;
