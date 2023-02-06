import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class DynamodbStack extends cdk.Stack {
  tableTodos: cdk.aws_dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const tableTodos = new cdk.aws_dynamodb.Table(this, "TableTodos", {
      partitionKey: {
        name: "pk",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
    });

    this.tableTodos = tableTodos;
  }
}
