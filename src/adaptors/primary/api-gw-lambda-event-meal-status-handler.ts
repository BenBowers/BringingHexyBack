import { getMealStatus } from '@use-cases/get-meal-status';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

export const getMealStatusHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context
) => {
  getMealStatus(event?.queryStringParameters?.mealId as string);
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: 'Bad Request',
    }),
  };
};
