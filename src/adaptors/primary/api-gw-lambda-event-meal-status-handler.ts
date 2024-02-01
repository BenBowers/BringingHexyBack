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
    return {
      statusCode: 404,
      body: 'Meal not found',
    };
  }
};
