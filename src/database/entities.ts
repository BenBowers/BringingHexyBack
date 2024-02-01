import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Entity, Table } from 'dynamodb-toolbox';
import { Config } from 'sst/node/config';

const tableName = Config.TABLE_NAME;

const DocumentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const mealTable = new Table({
  name: tableName,
  partitionKey: 'mealId',

  DocumentClient,
});

export const Meal = new Entity({
  name: 'Meal',
  attributes: {
    mealId: { type: 'string', partitionKey: true },
    imageLocation: { type: 'string' },
    status: { type: 'string' },
    mealPrompt: { type: 'string' },
    mealParameters: { type: 'string' },
    mealType: { type: 'string' },
  },
  table: mealTable,
});
