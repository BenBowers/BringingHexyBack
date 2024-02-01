import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Config } from 'sst/node/config';
import { v4 as uuidv4 } from 'uuid';
import { describe, expect, it } from 'vitest';
import { getMealStatus } from '../../src/adaptors/secondary/meal-status-dynamo';
import MealNotFoundError from '../../src/errors/MealNotFoundError';
import ServerError from '../../src/errors/ServerError';
import type { Meal, MealDetails } from './types';

const tableName = Config.TABLE_NAME;

type WithMealCallback = (meal: Meal) => Promise<void>;

const dynamoClient = new DynamoDBClient({});

const withMeal = async (
  mealDetails: MealDetails,
  callback: WithMealCallback
) => {
  const mealId = uuidv4();
  const jobId = uuidv4();

  const meal = {
    jobId,
    mealId,
    ...mealDetails,
  };

  await dynamoClient.send(
    new PutItemCommand({
      TableName: tableName,
      Item: marshall(meal),
    })
  );

  try {
    await callback(meal);
  } finally {
    await dynamoClient.send(
      new DeleteItemCommand({
        TableName: tableName,
        Key: marshall({ mealId }),
      })
    );
  }
};

describe('job-status-dynamo', () => {
  describe('Given a meal without a job status', () => {
    it('rejects with a server error with message', async () => {
      const mealDetails: MealDetails = {
        imageLocation: 's3://bucket/someimage.png',
        mealPrompt: 'Generate image pizzas',
        mealParameters: '{}',
        mealType: 'PIZZA',
      } as unknown as MealDetails;
      await withMeal(mealDetails, async (meal) => {
        await expect(getMealStatus(meal.mealId)).rejects.toThrow(
          new ServerError('meal status not found')
        );
      });
    });
  });
  describe('Given a meal that does not exist', () => {
    it('rejects with a meal not found response', async () => {
      await expect(getMealStatus('123')).rejects.toThrow(
        new MealNotFoundError()
      );
    });
  });
  describe('Given a meal exists in dynamo', () => {
    it('resolves the meal status when we request it', async () => {
      const mealDetails: MealDetails = {
        imageLocation: 's3://bucket/someimage.png',
        status: 'COMPLETED',
        mealPrompt: 'Generate image pizzas',
        mealParameters: '{}',
        mealType: 'PIZZA',
      };

      await withMeal(mealDetails, async (meal) => {
        await expect(getMealStatus(meal.mealId)).resolves.toEqual('COMPLETED');
      });
    });
  });
});
