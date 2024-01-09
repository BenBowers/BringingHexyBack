import { CdkCustomResourceEvent, Context } from 'aws-lambda';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as getApiAuthorizerPropertiesModule from './get-api-authorizer-id';
import { handler } from './handler';
describe('get api authorizer handler', () => {
  const getApiAuthorizerIdMock = vi.spyOn(
    getApiAuthorizerPropertiesModule,
    'getApiAuthorizerId'
  );
  beforeEach(() => {
    vi.resetAllMocks();
  });
  const authorizerName = 'EndpointAuthorizer';
  const restApiId = 'a1b2c3';
  const authorizerId = 'd4e5f6';
  describe('given the request type is Create', () => {
    describe('and the ResourceProperties contains restApiId and authorizerName', () => {
      it('calls getApiAuthorizer with restApiId and authorizerName', async () => {
        getApiAuthorizerIdMock.mockResolvedValue(authorizerId);
        await handler(
          {
            RequestType: 'Create',
            ResourceProperties: {
              restApiId,
              authorizerName,
            },
          } as unknown as CdkCustomResourceEvent,
          {} as Context,
          () => {}
        );
        expect(getApiAuthorizerIdMock).toHaveBeenCalledOnce();
        expect(getApiAuthorizerIdMock).toHaveBeenCalledWith(
          restApiId,
          authorizerName
        );
      });
      describe('and getApiAuthorizer resolves', () => {
        it('resolves to a cdk custom resource response with the physical resource id set to the result of getApiAuthorizer and data containing the id', async () => {
          getApiAuthorizerIdMock.mockResolvedValue(authorizerId);
          await expect(
            handler(
              {
                RequestType: 'Create',
                ResourceProperties: {
                  restApiId,
                  authorizerName,
                },
              } as unknown as CdkCustomResourceEvent,
              {} as Context,
              () => {}
            )
          ).resolves.toEqual({
            PhysicalResourceId: authorizerId,
            Data: {
              id: authorizerId,
            },
          });
        });
      });
    });
    describe('and getApiAuthorizer rejects', () => {
      it('rejects with the value getApiAuthorizer rejects with', async () => {
        const error = new Error('Item not found');
        getApiAuthorizerIdMock.mockRejectedValue(error);
        await expect(
          handler(
            {
              RequestType: 'Create',
              ResourceProperties: {
                restApiId,
                authorizerName,
              },
            } as unknown as CdkCustomResourceEvent,
            {} as Context,
            () => {}
          )
        ).rejects.toThrow(Error);
      });
    });
    describe('and the ResourceProperties does not contain restApiId or authorizerName', () => {
      it('Rejects with missing required parameters', async () => {
        getApiAuthorizerIdMock.mockResolvedValue(authorizerId);
        await expect(
          handler(
            {
              RequestType: 'Create',
              ResourceProperties: {},
            } as unknown as CdkCustomResourceEvent,
            {} as Context,
            () => {}
          )
        ).rejects.toEqual(new Error('Missing Required Parameters'));
      });
    });
  });
  describe('given the request type is Update', () => {
    describe('and the ResourceProperties contains restApiId and authorizerName', () => {
      it('calls getApiAuthorizer with restApiId and authorizerName', async () => {
        getApiAuthorizerIdMock.mockResolvedValue(authorizerId);
        await handler(
          {
            RequestType: 'Update',
            ResourceProperties: {
              restApiId,
              authorizerName,
            },
          } as unknown as CdkCustomResourceEvent,
          {} as Context,
          () => {}
        );
        expect(getApiAuthorizerIdMock).toHaveBeenCalledOnce();
        expect(getApiAuthorizerIdMock).toHaveBeenCalledWith(
          restApiId,
          authorizerName
        );
      });
      describe('and getApiAuthorizer resolves', () => {
        it('resolves to a cdk custom resource response with the physical resource id set to the result of getApiAuthorizer and data containing the id', async () => {
          getApiAuthorizerIdMock.mockResolvedValue(authorizerId);
          await expect(
            handler(
              {
                RequestType: 'Update',
                ResourceProperties: {
                  restApiId,
                  authorizerName,
                },
              } as unknown as CdkCustomResourceEvent,
              {} as Context,
              () => {}
            )
          ).resolves.toEqual({
            PhysicalResourceId: authorizerId,
            Data: {
              id: authorizerId,
            },
          });
        });
      });
    });
    describe('and getApiAuthorizer rejects', () => {
      it('rejects with the value getApiAuthorizer rejects with', async () => {
        const error = new Error('Item not found');
        getApiAuthorizerIdMock.mockRejectedValue(error);
        await expect(
          handler(
            {
              RequestType: 'Update',
              ResourceProperties: {
                restApiId,
                authorizerName,
              },
            } as unknown as CdkCustomResourceEvent,
            {} as Context,
            () => {}
          )
        ).rejects.toThrow(Error);
      });
    });
    describe('and the ResourceProperties does not contain restApiId or authorizerName', () => {
      it('Rejects with missing required parameters', async () => {
        getApiAuthorizerIdMock.mockResolvedValue(authorizerId);
        await expect(
          handler(
            {
              RequestType: 'Update',
              ResourceProperties: {},
            } as unknown as CdkCustomResourceEvent,
            {} as Context,
            () => {}
          )
        ).rejects.toEqual(new Error('Missing Required Parameters'));
      });
    });
  });
  describe('given the request type is Delete', () => {
    describe('given the event contains restApiId and authorizerName', () => {
      it('does not call getApiAuthorizerId', async () => {
        await handler(
          {
            RequestType: 'Delete',
            ResourceProperties: {
              restApiId,
              authorizerName,
            },
          } as unknown as CdkCustomResourceEvent,
          {} as Context,
          () => {}
        );
        expect(getApiAuthorizerIdMock).not.toHaveBeenCalled();
      });
      it('resolves to and empty object', async () => {
        await expect(
          handler(
            {
              RequestType: 'Delete',
              ResourceProperties: {
                restApiId,
                authorizerName,
              },
            } as unknown as CdkCustomResourceEvent,
            {} as Context,
            () => {}
          )
        ).resolves.toEqual({});
      });
    });
    describe('given the event does not contain restApiId or authorizerName', () => {
      it('does not call getApiAuthorizerId', async () => {
        await handler(
          {
            RequestType: 'Delete',
            ResourceProperties: {},
          } as unknown as CdkCustomResourceEvent,
          {} as Context,
          () => {}
        );
        expect(getApiAuthorizerIdMock).not.toHaveBeenCalled();
      });
      it('resolves to and empty object', async () => {
        await expect(
          handler(
            {
              RequestType: 'Delete',
              ResourceProperties: {},
            } as unknown as CdkCustomResourceEvent,
            {} as Context,
            () => {}
          )
        ).resolves.toEqual({});
      });
    });
  });
  describe('given the request type is a not a custom resource event type', () => {
    it('rejects with Invalid Request Type', async () => {
      await expect(
        handler(
          {
            RequestType: 'invalid',
            ResourceProperties: {
              restApiId,
              authorizerName,
            },
          } as unknown as CdkCustomResourceEvent,
          {} as Context,
          () => {}
        )
      ).rejects.toThrow(new Error('Invalid Request Type'));
    });
  });
});
