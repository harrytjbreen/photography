import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import {routes} from "./src/routes";

export interface LambdaEvent extends APIGatewayProxyEventV2 {
  pathParams?: Record<string, string>;
}

export const handler: APIGatewayProxyHandlerV2 = async (event: LambdaEvent) => {

  console.log(`Received request: ${JSON.stringify(event, null, 2)}`);
  const { method, path } = event.requestContext.http;

    const routeSet = routes[method];
    if (!routeSet) return notFound();

    if (routeSet[path]) {
        return jsonResponse(await routeSet[path](event), 200);
    }

    for (const [pattern, handler] of Object.entries(routeSet)) {
        const paramMatch = pattern.match(/^(.+):([^/]+)$/);
        if (paramMatch) {
            const base = paramMatch[1];
            if (path.startsWith(base)) {
                event.pathParams = { [paramMatch[2]]: path.slice(base.length + 1) };
                return await handler(event)
            }
        }
    }

    return notFound();
};

export const jsonResponse = (body: unknown, statusCode = 200): {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
} => {
    return {
        statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    };
}

const notFound = (): {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
} => {
    return jsonResponse({ message: "Not Found" }, 404);
}