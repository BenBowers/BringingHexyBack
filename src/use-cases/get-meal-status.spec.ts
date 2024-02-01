import { beforeEach } from 'node:test';
import { describe, expect, it, vi } from 'vitest';
import { MealStatus } from '../../tests/integration/types';
import { getMealStatus as getMealStatusDynamo } from '../adaptors/secondary/meal-status-dynamo';
import MealNotFoundError from '../errors/MealNotFoundError';
import ServerError from '../errors/ServerError';
import { getMealStatus } from './get-meal-status';
describe('get-meal-status', () => {
  vi.mock('../adaptors/secondary/meal-status-dynamo', () => ({
    getMealStatus: vi.fn(),
  }));

  const getMealStatusDynamoSpy = vi.mocked(getMealStatusDynamo);

  beforeEach(() => {
    vi.resetAllMocks();
  });
  const mealIdentifier = '9ca0887f-d4a1-4b5f-9e25-6a80e71c61f1';
  describe('Given a meal identifier', () => {
    it('invokes the meal status dynamo secondary adapter passing the meal identifier', async () => {
      await getMealStatus(mealIdentifier);
      expect(getMealStatusDynamoSpy).toBeCalledWith(mealIdentifier);
    });
    describe('and the meal status dynamo secondary adapter resolves with a meal status', () => {
      it('resolves with the meal status', async () => {
        const mealStatus: MealStatus = 'COMPLETED';
        getMealStatusDynamoSpy.mockResolvedValue(mealStatus);
        await expect(getMealStatus(mealIdentifier)).resolves.toEqual(
          mealStatus
        );
      });
    });
    describe('and the meal status dynamo secondary adapter rejects with a "meal not found" error', () => {
      it('rejects with the "meal not found" error', async () => {
        getMealStatusDynamoSpy.mockRejectedValue(new MealNotFoundError());
        await expect(getMealStatus(mealIdentifier)).rejects.toThrow(
          new MealNotFoundError()
        );
      });
    });
    describe('and the meal status dynamo secondary adapter rejects with a server error', () => {
      it('rejects with the server error', async () => {
        getMealStatusDynamoSpy.mockRejectedValue(new ServerError());
        await expect(getMealStatus(mealIdentifier)).rejects.toThrow(
          new ServerError()
        );
      });
    });
  });
});
