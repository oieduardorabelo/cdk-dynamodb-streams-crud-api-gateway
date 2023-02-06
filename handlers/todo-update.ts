import type { APIGatewayProxyEvent } from "aws-lambda";
import type { AWSError } from "aws-sdk";

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

  try {
    const body = JSON.parse(event.body || "{}");
    const todoUpdated = await ddb
      .update({
        TableName: tableName,
        Key: {
          pk: event.pathParameters?.id,
        },
        UpdateExpression: "set email = :email, message = :message",
        ExpressionAttributeValues: {
          ":email": body.email,
          ":message": body.message,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
    return send(200, { payload: todoUpdated });
  } catch (e) {
    const err = e as AWSError;
    return send(500, { message: "Failed to connect", error: err.toString() });
  }
};
