import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

type DynamodbStackProps = cdk.StackProps & {
  kinesisTodos: cdk.aws_kinesis.Stream;
};

export class DynamodbStack extends cdk.Stack {
  tableTodos: cdk.aws_dynamodb.Table;

  constructor(scope: Construct, id: string, props: DynamodbStackProps) {
    super(scope, id, props);

    //
    // Change data capture for DynamoDB Streams
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html
    //
    const tableTodos = new cdk.aws_dynamodb.Table(this, "TableTodos", {
      partitionKey: {
        name: "pk",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      stream: cdk.aws_dynamodb.StreamViewType.NEW_IMAGE,
      kinesisStream: props.kinesisTodos,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.tableTodos = tableTodos;
  }
}
