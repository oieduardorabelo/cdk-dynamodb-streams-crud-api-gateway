import { DynamoDBStreamEvent } from "aws-lambda";

import { DocumentClient } from "aws-sdk/clients/dynamodb";

const ddb = new DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});

const tableName = process.env.TABLE_TODOS;

export const handler = async (event: DynamoDBStreamEvent) => {
  if (!tableName) {
    throw new Error("tableName not specified in process.env.TABLE_TODOS");
  }

  for (const todo of event.Records) {
    console.log(JSON.stringify(todo));
  }
};
