import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from "aws-lambda";
import {router} from "./src/routes";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { path, httpMethod } = event;
  console.log(`Received request: ${JSON.stringify(event, null, 2)}`);
    return await router(path, httpMethod, event);
};