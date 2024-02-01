import MealNotFoundError from '@errors/MealNotFoundError';
import { getMealStatus } from '@use-cases/get-meal-status';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

export const getMealStatusHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context
) => {
  try {
    const mealStatus = await getMealStatus(
      event?.queryStringParameters?.mealId as string
    );

    return {
      statusCode: 200,
      body: mealStatus,
    };
  } catch (error) {
    if (error instanceof MealNotFoundError) {
      return {
        statusCode: 404,
        body: 'Meal not found',
      };
    }
    return {
      statusCode: 500,
      body: 'Server error',
    };
  }
};
