import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from "aws-lambda";
import {router} from "./src/routes";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { path, httpMethod } = event;
  console.log(`Path: ${path}`);
  console.log(`Method: ${httpMethod}`);
    return await router(path, httpMethod, event);
};