import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2<Record<string, string>> = async (
  event,
  context
) => {
  console.log('hello');
  return {
    message: 'hello',
  };
};
