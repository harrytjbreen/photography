import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from "aws-lambda";
import {router} from "./src/routes";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log(`Received request: ${JSON.stringify(event, null, 2)}`);
    return await router(event.requestContext.http.path, event.requestContext.http.method, event);
};