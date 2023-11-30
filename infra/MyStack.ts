import { RemovalPolicy } from "aws-cdk-lib";
import { Api, StackContext, Table } from "sst/constructs";

export function API({ stack }: StackContext) {

  const mealTable = new Table(stack, "MealTable", {
    fields: {
      jobId: "string",
      mealId: "string",
      imageLocation: "string",
      jobStatus: "string",
      mealPrompt: "string",
      mealParameters: "string",
      mealType: "string",
    },
    primaryIndex: { partitionKey: "mealId" },
    cdk: {
      table: {
        removalPolicy: RemovalPolicy.DESTROY,
      },
    },
  });

  const api = new Api(stack, "Api", {
    routes: {
      "GET    /mealStatus": "src/adaptors/primary/meal-status.handler",
    },
  });
  stack.addOutputs({
    Api: api.url,
    Table: mealTable.id,
  });
}
