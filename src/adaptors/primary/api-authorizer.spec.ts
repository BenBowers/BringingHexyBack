import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import context from 'aws-lambda-mock-context';
import { describe, expect, it, vi } from 'vitest';
import { handler } from './api-authorizer';

vi.mock('sst/node/config', () => ({
  Config: {
    API_KEY: 'abc',
  },
}));

describe('api-authorizer', () => {
  describe('Given the request contains the authorization token of abc', () => {
    it('will resolve to a policy that allows invokation of the desired endpoint', async () => {
      await expect(
        handler(
          {
            type: 'TOKEN',
            authorizationToken: 'abc',
            methodArn:
              'arn:aws:execute-api:us-west-2:123456789012:ymy8tbxw7b/dev/GET/',
          } as unknown as APIGatewayRequestAuthorizerEvent,
          context(),
          () => {}
        )
      ).resolves.toEqual({
        policyDocument: {
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource:
                'arn:aws:execute-api:us-west-2:123456789012:ymy8tbxw7b/dev/GET/',
            },
          ],
          Version: '2012-10-17',
        },
        principalId: 'user',
      });
    });
  });
  describe('Given the request contains the authorization token of an invalid token', () => {
    it('will resolve to a policy that denies invokation of the desired endpoint', async () => {
      await expect(
        handler(
          {
            type: 'TOKEN',
            authorizationToken: 'token',
            methodArn:
              'arn:aws:execute-api:us-west-2:123456789012:ymy8tbxw7b/dev/GET/',
          } as unknown as APIGatewayRequestAuthorizerEvent,
          context(),
          () => {}
        )
      ).resolves.toEqual({
        policyDocument: {
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Deny',
              Resource:
                'arn:aws:execute-api:us-west-2:123456789012:ymy8tbxw7b/dev/GET/',
            },
          ],
          Version: '2012-10-17',
        },
        principalId: 'user',
      });
    });
  });
  describe('Given the request contains no authorization token', () => {
    it('rejects with unauthorized', async () => {
      await expect(
        handler(
          {
            type: 'TOKEN',
            methodArn:
              'arn:aws:execute-api:us-west-2:123456789012:ymy8tbxw7b/dev/GET/',
          } as unknown as APIGatewayRequestAuthorizerEvent,
          context(),
          () => {}
        )
      ).rejects.toEqual('Unauthorized');
    });
  });
});
