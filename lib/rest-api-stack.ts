import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

type RestApiStackProps = cdk.StackProps & {
  tableTodos: cdk.aws_dynamodb.Table;
  todoCreate: cdk.aws_lambda_nodejs.NodejsFunction;
  todoRead: cdk.aws_lambda_nodejs.NodejsFunction;
  todoUpdate: cdk.aws_lambda_nodejs.NodejsFunction;
  todoDelete: cdk.aws_lambda_nodejs.NodejsFunction;
};

export class RestApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: RestApiStackProps) {
    super(scope, id, props);

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
      new cdk.aws_apigateway.LambdaIntegration(props.todoCreate)
    );

    const restApiTodoId = restApiTodo.addResource("{id}");

    restApiTodoId.addMethod(
      "GET",
      new cdk.aws_apigateway.LambdaIntegration(props.todoRead)
    );
    restApiTodoId.addMethod(
      "PATCH",
      new cdk.aws_apigateway.LambdaIntegration(props.todoUpdate)
    );
    restApiTodoId.addMethod(
      "DELETE",
      new cdk.aws_apigateway.LambdaIntegration(props.todoDelete)
    );
  }
}
