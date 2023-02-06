import * as path from "node:path";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class RestApiStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props: cdk.StackProps & { tableTodos: cdk.aws_dynamodb.Table }
  ) {
    super(scope, id, props);

    // ====================================================
    //
    // AWS Lambda Node.js functions handlers
    //
    // ====================================================
    function sharedLambdaProps(
      entryName: string
    ): cdk.aws_lambda_nodejs.NodejsFunctionProps {
      return {
        runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
        entry: getPathHandlers(entryName),
        environment: {
          AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
          TABLE_TODOS: props.tableTodos.tableName,
        },
      };
    }
    const todoCreate = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "todoCreate",
      sharedLambdaProps("todo-create.ts")
    );
    props.tableTodos.grantWriteData(todoCreate);

    const todoRead = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "todoRead",
      sharedLambdaProps("todo-read.ts")
    );
    props.tableTodos.grantReadData(todoRead);

    const todoUpdate = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "todoUpdate",
      sharedLambdaProps("todo-update.ts")
    );
    props.tableTodos.grantWriteData(todoUpdate);

    const todoDelete = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "todoDelete",
      sharedLambdaProps("todo-delete.ts")
    );
    props.tableTodos.grantWriteData(todoDelete);

    // ====================================================
    //
    // REST API in Amazon API Gateway
    //
    // ====================================================
    const restApi = new cdk.aws_apigateway.RestApi(this, "RestApi", {
      endpointConfiguration: {
        types: [cdk.aws_apigateway.EndpointType.REGIONAL],
      },
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
      },
    });

    const restApiTodo = restApi.root.addResource("todo");

    restApiTodo.addMethod(
      "POST",
      new cdk.aws_apigateway.LambdaIntegration(todoCreate)
    );

    const restApiTodoId = restApiTodo.addResource("{id}");

    restApiTodoId.addMethod(
      "GET",
      new cdk.aws_apigateway.LambdaIntegration(todoRead)
    );
    restApiTodoId.addMethod(
      "PATCH",
      new cdk.aws_apigateway.LambdaIntegration(todoUpdate)
    );
    restApiTodoId.addMethod(
      "DELETE",
      new cdk.aws_apigateway.LambdaIntegration(todoDelete)
    );
  }
}

function getPathHandlers(filename: string) {
  return path.join(__dirname, "..", "handlers", filename);
}
