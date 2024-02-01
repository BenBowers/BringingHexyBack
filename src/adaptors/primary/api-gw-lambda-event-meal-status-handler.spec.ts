import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { describe, it } from 'vitest';
import { handler } from './api-gw-lambda-event-meal-status-handler';
const mealId = 'e8d94127-ec3d-4cbb-93e4-357d53f7daa4';

describe('meal-status', () => {
  describe('Given an API request containing a meal identifier', () => {
    it('invokes the use case passing the meal identifier', async () => {
      const event = {
        queryStringParameters: {
          mealId,
        },
      } as unknown as APIGatewayProxyEvent;

      await handler(event, {} as Context, () => {});
    });
    describe('and the use case resolves with a meal status', () => {
      it.todo(
        'returns an API GW response with a response code of 200, and a body containing the meal status',
        () => {}
      );
    });
    describe('and the use case rejects with "meal not found"', () => {
      it.todo(
        'returns an API GW response with a response code of 404',
        () => {}
      );
    });
    describe('and the use case rejects with "server error"', () => {
      it.todo(
        'returns an API GW response with a response code of 500',
        () => {}
      );
    });
  });
});
