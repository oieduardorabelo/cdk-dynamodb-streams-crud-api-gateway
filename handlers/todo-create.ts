import type { APIGatewayProxyEvent } from "aws-lambda";
import type { AWSError } from "aws-sdk";

import { randomUUID } from "node:crypto";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { send } from "./utils";

const ddb = new DocumentClient({
  apiVersion: "2012-08-10",
  region: process.env.AWS_REGION,
});

const tableName = process.env.TABLE_TODOS;

export const handler = async (event: APIGatewayProxyEvent) => {
  if (!tableName) {
    throw new Error("tableName not specified in process.env.TABLE_TODOS");
  }

  const body = JSON.parse(event.body || "{}");

  const putParams = {
    TableName: tableName,
    Item: {
      pk: randomUUID(),
      email: body.email,
      message: body.message,
    },
  };

  try {
    await ddb.put(putParams).promise();
  } catch (e) {
    const err = e as AWSError;
    return send(500, { message: "Failed to connect", error: err.toString() });
  }

  return send(200, { payload: putParams.Item });
};
