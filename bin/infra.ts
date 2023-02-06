#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { RestApiStack } from "../lib/rest-api-stack";
import { KinesisStack } from "../lib/kinesis-stack";
import { DynamodbStack } from "../lib/dynamodb-stack";
import { LambdasStack } from "../lib/lambdas-stack";

const app = new cdk.App();

const kinesisStack = new KinesisStack(app, "KinesisStack");

const dynamodbStack = new DynamodbStack(app, "DynamodbStack", {
  kinesisTodos: kinesisStack.kinesisTodos,
});

const lambdasStack = new LambdasStack(app, "LambdasStack", {
  tableTodos: dynamodbStack.tableTodos,
  kinesisTodos: kinesisStack.kinesisTodos,
});

const restApiStack = new RestApiStack(app, "RestApiStack", {
  tableTodos: dynamodbStack.tableTodos,
  todoCreate: lambdasStack.todoCreate,
  todoRead: lambdasStack.todoRead,
  todoUpdate: lambdasStack.todoUpdate,
  todoDelete: lambdasStack.todoDelete,
});
