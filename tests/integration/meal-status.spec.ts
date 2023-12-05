import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import axios from 'axios';
import { Config } from 'sst/node/config';
import { describe, expect, it } from 'vitest';

const apiUrl = Config.API_ENDPOINT;
const tableName = Config.TABLE_NAME;
const apiKey = 'abc';

const dynamoClient = new DynamoDBClient({});
describe('meal-status', () => {
  describe('Given the user does not provide a access token', () => {
    it.todo('responds with status 400 bad request', async () => {});
    describe('Given the user does not provide a token', () => {
      it('responds status 401 with body not authorized', async () => {
        const mealId = '123';
        const response = await axios.get(apiUrl, {
          validateStatus: () => true,
          headers: {
            Authorization: undefined,
          },
          params: {
            mealId,
          },
        });
        expect(response.status).toEqual(401);
        expect(response.data).toEqual({
          message: 'Unauthorized',
        });
      });
    });
    describe('Given the user provides an invalid token', () => {
      it('responds status 403 with body TODO', async () => {
        const mealId = '123';
        const response = await axios.get(apiUrl, {
          validateStatus: () => true,
          headers: {
            Authorization: 'invalid',
          },
          params: {
            mealId,
          },
        });
        expect(response.status).toEqual(403);
        expect(response.data).toEqual({
          Message:
            'User is not authorized to access this resource with an explicit deny', // TODO: Change message to something nicer
        });
      });
    });
    describe('Given the user is authorized', () => {
      describe('Given the user provides an invalid parameters', () => {
        it('responds with status 400 bad request', async () => {
          const response = await axios.get(apiUrl, {
            validateStatus: () => true,
            headers: {
              Authorization: apiKey,
            },
            params: {
              Invalid: 'invalid',
            },
          });
          expect(response.status).toEqual(400);
          expect(response.data).toEqual({
            message: 'Bad Request',
          });
        });
      });
    });
    describe('and the user provides a meal id that does not exist', () => {
      it.todo('responds status 404', () => {});
    });
    describe('and the user provides a meal id that exists', () => {
      describe('given the meal id corresponds with a meal with job status COMPLETED', () => {
        it.todo('responds status 200 with body COMPLETED', async () => {
          const mealId = '123';

          await dynamoClient.send(
            new PutItemCommand({
              TableName: tableName,
              Item: marshall({
                jobId: '321',
                mealId,
                imageLocation: 's3://bucket/someimage.png',
                jobStatus: 'COMPLETED',
                mealPrompt: 'Generate image pizzas',
                mealParameters: '{}',
                mealType: 'PIZZA',
              }),
            })
          );
          const response = await axios.get(apiUrl, {
            headers: {
              Authorization: apiKey,
            },
            params: {
              mealId,
            },
          });
          expect(response.status).toEqual(200);
          expect(response.data).toEqual('COMPLETED');
        });
      });
      describe('given the meal id corresponds with a meal with job status IN_PROGRESS', () => {
        it.todo('responds status 200 with body IN_PROGRESS', () => {});
      });
      describe('given the meal id corresponds with a meal with job status FAILED', () => {
        it.todo('responds status 200 with body FAILED', () => {});
      });
    });
  });
});
