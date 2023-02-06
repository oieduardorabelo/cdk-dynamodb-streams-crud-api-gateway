import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class KinesisStack extends cdk.Stack {
  kinesisTodos: cdk.aws_kinesis.Stream;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const kinesisTodos = new cdk.aws_kinesis.Stream(this, "KinesisTodos");

    this.kinesisTodos = kinesisTodos;
  }
}
