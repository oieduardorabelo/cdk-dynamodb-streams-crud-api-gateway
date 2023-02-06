import { APIGatewayProxyResult } from "aws-lambda";

export function send(
  statusCode: number,
  payload: { message: string; error: string } | { payload: unknown }
): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      "Content-Typer": "application/json",
    },
    body: JSON.stringify(payload),
  };
}
