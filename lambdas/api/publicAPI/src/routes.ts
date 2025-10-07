import { APIGatewayProxyEvent } from "aws-lambda";
import { getAllCollections } from "./handlers/collections";

interface LambdaEvent extends APIGatewayProxyEvent {
    pathParams?: Record<string, string>;
}

type Handler = (event: LambdaEvent) => Promise<unknown>;

export const routes: Record<string, Record<string, Handler>> = {
    GET: {
        "/collections": getAllCollections,
    },
};

export const router = async (path: string, method: string, event: LambdaEvent): Promise<{
    statusCode: number;
    headers: Record<string, string>;
    body: string;
}> => {
    path = path.replace(/\/+$/, "");

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
                return jsonResponse(await handler(event), 200);
            }
        }
    }

    return notFound();
}

const jsonResponse = (body: unknown, statusCode = 200): {
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