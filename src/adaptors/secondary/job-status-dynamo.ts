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

const meal = new Entity({
  name: 'Meal',
  attributes: {
    mealId: { type: 'string', partitionKey: true },
    jobId: { type: 'string' },
    imageLocation: { type: 'string' },
    jobStatus: { type: 'string' },
    mealPrompt: { type: 'string' },
    mealParameters: { type: 'string' },
    mealType: { type: 'string' },
  },
  table: mealTable,
});

const getJobStatus = async (mealId: string): Promise<string> => {
  return (await meal.get({ mealId })).Item?.jobStatus || '';
};

export default getJobStatus;
