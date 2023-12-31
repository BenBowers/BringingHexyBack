import {
  CdkCustomResourceHandler,
  CdkCustomResourceResponse,
} from 'aws-lambda';
import { getApiAuthorizerId } from './get-api-authorizer-id';

const handleCreateOrUpdate = async (
  restApiId?: string,
  authorizerName?: string
): Promise<CdkCustomResourceResponse> => {
  if (!restApiId || !authorizerName)
    throw new Error('Missing Required Parameters');
  const id = await getApiAuthorizerId(restApiId, authorizerName);
  return {
    PhysicalResourceId: id,
    Data: {
      id,
    },
  };
};
export const handler: CdkCustomResourceHandler = async (event) => {
  const { RequestType: requestType } = event;
  const { restApiId, authorizerName } = event.ResourceProperties;

  switch (requestType) {
    case 'Create':
    case 'Update':
      return handleCreateOrUpdate(restApiId, authorizerName);
    case 'Delete':
      return {};
    default:
      throw new Error('Invalid Request Type');
  }
};
