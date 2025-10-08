import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from "aws-lambda";
import {routes} from "./src/routes";

export interface LambdaEvent extends APIGatewayProxyEventV2 {
  pathParams?: Record<string, string>;
}

export type Handler = (event: LambdaEvent) => Promise<APIGatewayProxyResultV2>;
export const handler = async (event: LambdaEvent): Promise<APIGatewayProxyResultV2> => {

  console.log(`Received request: ${JSON.stringify(event, null, 2)}`);
  const { method, path } = event.requestContext.http;

    const routeSet = routes[method];
    if (!routeSet) return notFound();

    if (routeSet[path]) {
        return await (routeSet[path] as Handler)(event)
    }

    for (const [pattern, handler] of Object.entries(routeSet)) {
        const paramMatch = pattern.match(/^(.+)\{([^/]+)\}$/);
        if (paramMatch) {
            const base = paramMatch[1];
            if (path.startsWith(base)) {
                event.pathParams = { [paramMatch[2]]: path.slice(base.length) };
                return await (handler as Handler)(event)
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
    return jsonResponse({ message: "Route not Found" }, 404);
}