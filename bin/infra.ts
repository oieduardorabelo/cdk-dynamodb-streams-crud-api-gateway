#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { RestApiStack } from "../lib/rest-api-stack";
import { DynamodbStack } from "../lib/dynamodb-stack";

const app = new cdk.App();
const dynamodb = new DynamodbStack(app, "DynamodbStack");
new RestApiStack(app, "RestApiStack", {
  tableTodos: dynamodb.tableTodos,
});
