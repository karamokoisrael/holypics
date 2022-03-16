export type WebSocketMessage = {
    message: string;
    owner?: string;
    target?: string;
    content?: string;
}

export type WebSocketMessageType = "updateSocketKey" | "notification" | "connId"