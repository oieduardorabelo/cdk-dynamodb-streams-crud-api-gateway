import * as path from "node:path";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

type LambdasStackProps = cdk.StackProps & {
  tableTodos: cdk.aws_dynamodb.Table;
  kinesisTodos: cdk.aws_kinesis.Stream;
};

export class LambdasStack extends cdk.Stack {
  todoCreate: cdk.aws_lambda_nodejs.NodejsFunction;
  todoRead: cdk.aws_lambda_nodejs.NodejsFunction;
  todoUpdate: cdk.aws_lambda_nodejs.NodejsFunction;
  todoDelete: cdk.aws_lambda_nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdasStackProps) {
    super(scope, id, props);

    // ====================================================
    //
    // AWS Lambda Node.js functions handlers
    //
    // ====================================================
    const todoStreamProcess = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "todoStreamProcess",
      sharedLambdaProps("todo-stream-process.ts", {
        TABLE_TODOS: props.tableTodos.tableName,
      })
    );
    props.tableTodos.grantWriteData(todoStreamProcess);
    todoStreamProcess.addEventSource(
      new cdk.aws_lambda_event_sources.DynamoEventSource(props.tableTodos, {
        startingPosition: cdk.aws_lambda.StartingPosition.LATEST,
        batchSize: 5,
        retryAttempts: 5,
      })
    );

    const todoCreate = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "todoCreate",
      sharedLambdaProps("todo-create.ts", {
        TABLE_TODOS: props.tableTodos.tableName,
      })
    );
    props.tableTodos.grantWriteData(todoCreate);

    const todoRead = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "todoRead",
      sharedLambdaProps("todo-read.ts", {
        TABLE_TODOS: props.tableTodos.tableName,
      })
    );
    props.tableTodos.grantReadData(todoRead);

    const todoUpdate = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "todoUpdate",
      sharedLambdaProps("todo-update.ts", {
        TABLE_TODOS: props.tableTodos.tableName,
      })
    );
    props.tableTodos.grantWriteData(todoUpdate);

    const todoDelete = new cdk.aws_lambda_nodejs.NodejsFunction(
      this,
      "todoDelete",
      sharedLambdaProps("todo-delete.ts", {
        TABLE_TODOS: props.tableTodos.tableName,
      })
    );
    props.tableTodos.grantWriteData(todoDelete);

    this.todoCreate = todoCreate;
    this.todoRead = todoRead;
    this.todoUpdate = todoUpdate;
    this.todoDelete = todoDelete;
  }
}

function getPathHandlers(filename: string) {
  return path.join(__dirname, "..", "handlers", filename);
}

function sharedLambdaProps(
  entryName: string,
  environment: cdk.aws_lambda_nodejs.NodejsFunctionProps["environment"]
): cdk.aws_lambda_nodejs.NodejsFunctionProps {
  return {
    runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
    entry: getPathHandlers(entryName),
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      ...environment,
    },
  };
}
