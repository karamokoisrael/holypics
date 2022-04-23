export type WebSocketMessage = {
    message?: string;
    owner?: string;
    target?: string;
    content?: string | Record<string, any>;
}

export type WebSocketUser = {
    id: string
}
export type WebSocketMessageType = "connectionReceived" | "updateSocketKey" | "notification" | "connId"