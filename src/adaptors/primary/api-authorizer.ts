import { APIGatewayAuthorizerHandler } from 'aws-lambda';
import { Config } from 'sst/node/config';

export const handler: APIGatewayAuthorizerHandler = async (event) => {
  if (event.type === 'TOKEN' && event.authorizationToken) {
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect:
              event.authorizationToken === Config.API_KEY ? 'Allow' : 'Deny',
            Resource: event.methodArn,
          },
        ],
      },
    };
  }
  throw 'Unauthorized';
};
