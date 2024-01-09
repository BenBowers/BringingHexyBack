import {
  APIGatewayClient,
  APIGatewayServiceException,
  GetAuthorizersCommand,
  NotFoundException,
  TooManyRequestsException,
  UnauthorizedException,
} from '@aws-sdk/client-api-gateway';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import { beforeEach, describe, expect, it } from 'vitest';
import { getApiAuthorizerId } from './get-api-authorizer-id';
describe('get api authorizer', () => {
  const apiGwClientMock = mockClient(APIGatewayClient);
  const restApiId = 'abcdef';
  const authorizerName = 'EndpointAuthorizer';
  beforeEach(() => {
    apiGwClientMock.reset();
  });
  describe('given a rest api id and authorizer name', () => {
    it('sends a getApiAuthorizers command with the rest api id', async () => {
      apiGwClientMock.on(GetAuthorizersCommand).resolves({
        items: [
          {
            id: 'gzm41p',
            name: 'EndpointAuthorizer',
            type: 'TOKEN',
            authType: 'custom',
            authorizerUri:
              'arn:aws:apigateway:ap-southeast-2:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-southeast-2:0123456789:function:test-auth/invocations',
            identitySource: 'method.request.header.authorization',
          },
        ],
        position: '1',
      });
      await getApiAuthorizerId(restApiId, authorizerName);
      expect(apiGwClientMock).toHaveReceivedCommandWith(GetAuthorizersCommand, {
        restApiId,
      });
    });
    describe('given the command resolves with an authorizer list that contains a single authorizer with the provided name', () => {
      describe('given the authorizer has an id', () => {
        it('resolves to the id of the authorizer with the same name', async () => {
          apiGwClientMock.on(GetAuthorizersCommand).resolves({
            items: [
              {
                id: 'gzm41p',
                name: 'EndpointAuthorizer',
                type: 'TOKEN',
                authType: 'custom',
                authorizerUri:
                  'arn:aws:apigateway:ap-southeast-2:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-southeast-2:0123456789:function:test-auth/invocations',
                identitySource: 'method.request.header.authorization',
              },
            ],
            position: '1',
          });
          await expect(
            getApiAuthorizerId(restApiId, authorizerName)
          ).resolves.toEqual('gzm41p');
        });
      });
      describe('given the authorizer does not have an id', () => {
        it('rejects with Authorizer Does Not Contain ID', async () => {
          apiGwClientMock.on(GetAuthorizersCommand).resolves({
            items: [
              {
                name: 'EndpointAuthorizer',
                type: 'TOKEN',
                authType: 'custom',
                authorizerUri:
                  'arn:aws:apigateway:ap-southeast-2:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-southeast-2:0123456789:function:test-auth/invocations',
                identitySource: 'method.request.header.authorization',
              },
            ],
            position: '1',
          });
          await expect(
            getApiAuthorizerId(restApiId, authorizerName)
          ).rejects.toThrow(new Error('Authorizer Does Not Contain ID'));
        });
      });
    });
    describe('given the command resolves with an authorizer list that contains authorizers where one has the provided name', () => {
      it('resolves to the id of the authorizer with the same name', async () => {
        apiGwClientMock.on(GetAuthorizersCommand).resolves({
          items: [
            {
              id: 'gzm41p',
              name: 'EndpointAuthorizer',
              type: 'TOKEN',
              authType: 'custom',
              authorizerUri:
                'arn:aws:apigateway:ap-southeast-2:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-southeast-2:0123456789:function:test-auth/invocations',
              identitySource: 'method.request.header.authorization',
            },
            {
              id: 'abc41c',
              name: 'Some other authorizer',
              type: 'TOKEN',
              authType: 'custom',
              authorizerUri:
                'arn:aws:apigateway:ap-southeast-2:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-southeast-2:0123456789:function:test-auth/invocations',
              identitySource: 'method.request.header.authorization',
            },
          ],
          position: '1',
        });
        await expect(
          getApiAuthorizerId(restApiId, authorizerName)
        ).resolves.toEqual('gzm41p');
      });
    });
    describe('given the command resolves with an authorizer list that does not contain an authorizer with the provided name', () => {
      it('rejects with Authorizer Not Found', async () => {
        apiGwClientMock.on(GetAuthorizersCommand).resolves({
          items: [
            {
              id: 'abc41c',
              name: 'Some other authorizer',
              type: 'TOKEN',
              authType: 'custom',
              authorizerUri:
                'arn:aws:apigateway:ap-southeast-2:lambda:path/2015-03-31/functions/arn:aws:lambda:ap-southeast-2:0123456789:function:test-auth/invocations',
              identitySource: 'method.request.header.authorization',
            },
          ],
          position: '1',
        });
        await expect(
          getApiAuthorizerId(restApiId, authorizerName)
        ).rejects.toThrow(new Error('Authorizer Not Found'));
      });
    });
    describe('given the command resolves with no authorizer list', () => {
      it('rejects with Authorizer Not Found', async () => {
        apiGwClientMock.on(GetAuthorizersCommand).resolves({
          position: '1',
        });
        await expect(
          getApiAuthorizerId(restApiId, authorizerName)
        ).rejects.toThrow(new Error('Authorizer Not Found'));
      });
    });
    describe('given the command rejects with NotFoundException', () => {
      it('rejects with Rest Api Not Found', async () => {
        apiGwClientMock.on(GetAuthorizersCommand).rejects(
          new NotFoundException({
            message: '',
            $metadata: {},
          })
        );
        await expect(
          getApiAuthorizerId(restApiId, authorizerName)
        ).rejects.toThrow(new Error('Rest Api Not Found'));
      });
    });
    describe('given the command rejects with UnauthorizedException', () => {
      it('rejects with Not Authorized', async () => {
        apiGwClientMock.on(GetAuthorizersCommand).rejects(
          new UnauthorizedException({
            message: '',
            $metadata: {},
          })
        );
        await expect(
          getApiAuthorizerId(restApiId, authorizerName)
        ).rejects.toThrow(new Error('Not Authorized'));
      });
    });
    describe('given the command rejects with TooManyRequestsException', () => {
      it('rejects with Rate Limit Try Again', async () => {
        apiGwClientMock.on(GetAuthorizersCommand).rejects(
          new TooManyRequestsException({
            message: '',
            $metadata: {},
          })
        );
        await expect(
          getApiAuthorizerId(restApiId, authorizerName)
        ).rejects.toThrow(new Error('Rate Limit Try Again'));
      });
    });
    describe('given the command rejects with APIGatewayServiceException', () => {
      it('rejects with AWS Service Error Try Again', async () => {
        apiGwClientMock.on(GetAuthorizersCommand).rejects(
          new APIGatewayServiceException({
            $fault: 'server',
            name: '',
            message: '',
            $metadata: {},
          })
        );
        await expect(
          getApiAuthorizerId(restApiId, authorizerName)
        ).rejects.toThrow(new Error('AWS Service Error Try Again'));
      });
    });
  });
});
