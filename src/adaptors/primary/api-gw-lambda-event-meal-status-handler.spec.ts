import MealNotFoundError from '@errors/MealNotFoundError';
import ServerError from '@errors/ServerError';
import { getMealStatus } from '@use-cases/get-meal-status';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MealStatus } from '../../../tests/integration/types';
import { getMealStatusHandler } from './api-gw-lambda-event-meal-status-handler';
const mealId = 'e8d94127-ec3d-4cbb-93e4-357d53f7daa4';

describe('meal-status', () => {
  vi.mock('@use-cases/get-meal-status.ts', () => ({
    getMealStatus: vi.fn(),
  }));

  const getMealStatusSpy = vi.mocked(getMealStatus);

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('Given an API request containing a meal identifier', () => {
    it('invokes the use case passing the meal identifier', async () => {
      const event = {
        queryStringParameters: {
          mealId,
        },
      } as unknown as APIGatewayProxyEvent;

      const mealStatus: MealStatus = 'COMPLETED';
      getMealStatusSpy.mockResolvedValue(mealStatus);

      await getMealStatusHandler(event, {} as Context, () => {});
      expect(getMealStatusSpy).toBeCalledWith(mealId);
    });

    describe('and the use case resolves with a meal status', () => {
      it('returns an API GW response with a response code of 200, and a body containing the meal status', async () => {
        const event = {
          queryStringParameters: {
            mealId,
          },
        } as unknown as APIGatewayProxyEvent;

        const mealStatus: MealStatus = 'COMPLETED';
        getMealStatusSpy.mockResolvedValue(mealStatus);

        expect(
          getMealStatusHandler(event, {} as Context, () => {})
        ).resolves.toEqual({
          statusCode: 200,
          body: mealStatus,
        });
      });
    });

    describe('and the use case rejects with "meal not found"', () => {
      it('returns an API GW response with a response code of 404', async () => {
        const event = {
          queryStringParameters: {
            mealId,
          },
        } as unknown as APIGatewayProxyEvent;

        getMealStatusSpy.mockRejectedValue(new MealNotFoundError());

        expect(
          getMealStatusHandler(event, {} as Context, () => {})
        ).resolves.toEqual({
          statusCode: 404,
          body: 'Meal not found',
        });
      });
    });

    describe('and the use case rejects with "server error"', () => {
      it('returns an API GW response with a response code of 500', async () => {
        const event = {
          queryStringParameters: {
            mealId,
          },
        } as unknown as APIGatewayProxyEvent;

        getMealStatusSpy.mockRejectedValue(new ServerError());

        expect(
          getMealStatusHandler(event, {} as Context, () => {})
        ).resolves.toEqual({
          statusCode: 500,
          body: 'Server error',
        });
      });
    });
  });
});
