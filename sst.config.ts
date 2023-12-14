import { aws_lambda as lambda } from 'aws-cdk-lib';
import { SSTConfig } from 'sst';
import { API } from './infra/MyStack';

const LAMBDA_INSIGHTS_ARN =
  'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension-Arm64:5';

export default {
  config(_input) {
    return {
      name: 'BringingHexyBack',
      region: 'ap-southeast-2',
    };
  },

  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: 'nodejs18.x',
      insightsVersion:
        lambda.LambdaInsightsVersion.fromInsightVersionArn(LAMBDA_INSIGHTS_ARN),
      logRetention: 'one_month',
      tracing: 'active',
      architecture: 'arm_64',
      nodejs: {
        esbuild: {
          keepNames: false,
          minify: true,
        },
      },
    });

    app.stack(API);
  },
} satisfies SSTConfig;
