import {
  CustomResource,
  RemovalPolicy,
  aws_apigateway as apigateway,
  custom_resources as cr,
  aws_iam as iam,
} from 'aws-cdk-lib';
import { Config, Function, StackContext, Table } from 'sst/constructs';

export function API({ stack, app }: StackContext) {
  const apiKey = new Config.Secret(stack, 'API_KEY');

  const mealTable = new Table(stack, 'MealTable', {
    fields: {
      jobId: 'string',
      mealId: 'string',
      imageLocation: 'string',
      jobStatus: 'string',
      mealPrompt: 'string',
      mealParameters: 'string',
      mealType: 'string',
    },
    primaryIndex: { partitionKey: 'mealId' },
    cdk: {
      table: {
        removalPolicy: RemovalPolicy.DESTROY,
      },
    },
  });

  const auth = new Function(stack, 'lambdaAuth', {
    functionName: app.logicalPrefixedName('apiAuthorizer'),
    handler: 'src/adaptors/primary/api-authorizer.handler',
    bind: [apiKey],
  });
  const mealStatusHandler = new Function(stack, 'mealStatusHandler', {
    functionName: app.logicalPrefixedName('mealStatusHandler'),
    handler: 'src/adaptors/primary/meal-status.handler',
  });

  const authorizerName = 'EndpointAuthorizer';
  const api = new apigateway.SpecRestApi(stack, 'meal-api', {
    endpointTypes: [apigateway.EndpointType.REGIONAL],
    apiDefinition: apigateway.ApiDefinition.fromInline({
      openapi: '3.0.1',
      info: {
        title: 'tasks-api',
        version: 'v1.0',
      },
      components: {
        securitySchemes: {
          EndpointAuthorizer: {
            type: 'apiKey',
            name: 'authorization',
            in: 'header',
            'x-amazon-apigateway-authtype': 'custom',
            'x-amazon-apigateway-authorizer': {
              type: 'token',
              identitySource: 'method.request.header.authorization',
              authorizerUri: `arn:\${AWS::Partition}:apigateway:\${AWS::Region}:lambda:path/2015-03-31/functions/${auth.functionArn}/invocations`,
            },
          },
        },
      },
      paths: {
        '/mealStatus': {
          get: {
            summary: 'Get meal job status',
            security: [
              {
                EndpointAuthorizer: [],
              },
            ],
            parameters: [
              {
                name: 'mealId',
                description: 'A unique identifier for a meal',
                in: 'query',
                required: true,
                schema: {
                  type: 'string',
                },
              },
            ],
            description: 'Returns the status of a meal job',
            responses: {
              '200': {
                description: 'OK',
                content: {
                  'application/json': {
                    schema: {
                      type: 'string',
                    },
                  },
                },
              },
              '500': {
                description: 'Internal Server Error',
                content: {},
              },
            },
            'x-amazon-apigateway-integration': {
              uri: `arn:\${AWS::Partition}:apigateway:\${AWS::Region}:lambda:path/2015-03-31/functions/${mealStatusHandler.functionArn}/invocations`,
              responses: {
                default: {
                  statusCode: '200',
                },
              },
              passthroughBehavior: 'when_no_match',
              httpMethod: 'POST',
              contentHandling: 'CONVERT_TO_TEXT',
              type: 'aws_proxy',
            },
          },
        },
      },
    }),
  });

  const getAuthorizerIdProvider = new cr.Provider(
    stack,
    'getAuthorizerProvider',
    {
      onEventHandler: new Function(stack, 'getAuthorizerIdHandler', {
        handler: 'infra/custom-resources/get-api-authorizer-id/handler.handler',
        permissions: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['apigateway:GET'],
            resources: [
              `arn:aws:apigateway:${stack.region}::/restapis/${api.restApiId}/authorizers`,
            ],
          }),
        ],
      }),
    }
  );

  const getAuthorizerId = new CustomResource(stack, 'getAuthorizerId', {
    serviceToken: getAuthorizerIdProvider.serviceToken,
    properties: {
      restApiId: api.restApiId,
      authorizerName: authorizerName,
    },
  });

  mealStatusHandler.grantInvoke(
    new iam.ServicePrincipal('apigateway.amazonaws.com', {
      conditions: {
        ArnLike: {
          'aws:SourceArn': api.arnForExecuteApi(
            'GET',
            '/mealStatus',
            api.deploymentStage.stageName
          ),
        },
      },
    })
  );
  auth.grantInvoke(
    new iam.ServicePrincipal('apigateway.amazonaws.com', {
      conditions: {
        ArnLike: {
          'aws:SourceArn': `arn:aws:execute-api:${app.region}:${app.account}:${
            api.restApiId
          }/authorizers/${getAuthorizerId.getAtt('id')}`,
        },
      },
    })
  );

  const API_ENDPOINT = new Config.Parameter(stack, 'API_ENDPOINT', {
    value: api.urlForPath('/mealStatus'),
  });
  const TABLE_NAME = new Config.Parameter(stack, 'TABLE_NAME', {
    value: mealTable.tableName,
  });

  stack.addOutputs({
    Api: api.urlForPath('/mealStatus'),
    Table: mealTable.id,
    rest: api.restApiId,
  });
}
