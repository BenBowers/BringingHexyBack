import {
  APIGatewayClient,
  APIGatewayServiceException,
  GetAuthorizersCommand,
  NotFoundException,
  TooManyRequestsException,
  UnauthorizedException,
} from '@aws-sdk/client-api-gateway';

const apiGwClient = new APIGatewayClient({});
const authorizerNotFoundMessage = 'Authorizer Not Found';
export const getApiAuthorizerId = async (
  restApiId: string,
  authorizerName: string
): Promise<string> => {
  try {
    const response = await apiGwClient.send(
      new GetAuthorizersCommand({
        restApiId,
      })
    );
    if (response.items) {
      const authorizer = response.items.find(
        ({ name }) => name === authorizerName
      );
      if (authorizer === undefined) throw new Error(authorizerNotFoundMessage);
      if (authorizer.id === undefined)
        throw new Error('Authorizer Does Not Contain ID');
      return authorizer.id;
    }
    throw new Error(authorizerNotFoundMessage);
  } catch (error) {
    if (error instanceof NotFoundException)
      throw new Error('Rest Api Not Found');
    if (error instanceof UnauthorizedException)
      throw new Error('Not Authorized');
    if (error instanceof TooManyRequestsException)
      throw new Error('Rate Limit Try Again');
    if (error instanceof APIGatewayServiceException)
      throw new Error('AWS Service Error Try Again');
    throw error;
  }
};
