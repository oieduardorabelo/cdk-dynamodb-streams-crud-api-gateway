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

  //
  // Kinesis Data Streams sends the records to Kinesis Data Firehose for transformation and delivery.
  // A Lambda function converts the records from a DynamoDB record format to JSON-format, which contains
  // only the record item attribute names and values.
  // https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/deliver-dynamodb-records-to-amazon-s3-using-kinesis-data-streams-and-kinesis-data-firehose-with-aws-cdk.html
  //
  for (const todo of event.Records) {
    console.log(JSON.stringify(todo));
  }
};
