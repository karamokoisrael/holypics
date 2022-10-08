import { ApiExtensionContext } from "@directus/shared/types";
import { Knex } from 'knex';
import { FilterHandler, ActionHandler, InitHandler, ScheduleHandler, SchemaOverview, Accountability } from "@directus/shared/types";
import { PrimaryKey } from '@directus/shared/types';

interface DirectusEventEmitter {
    emitFilter: <T>(
        event: string | string[],
        payload: T,
        meta: Record<string, any>,
        context: EventContext) => Record<string, any>

    emitAction: (
        event: string | string[],
        meta: Record<string, any>,
        context: EventContext) => void

    emitInit: <T>(
        event: string | string[],
        meta: Record<string, any>) => Promise<void>

    onFilter: (event: string, handler: FilterHandler) => void
    onAction: (event: string, handler: ActionHandler) => void
    onInit: (event: string, handler: InitHandler) => void
    offFilter: (event: string, handler: FilterHandler) => void
    offAction: (event: string, handler: ActionHandler) => void
    offInit: (event: string, handler: InitHandler) => void
    offAll: () => void

}
export type ExtendedApiExtensionContext = ApiExtensionContext & {
    emitter: DirectusEventEmitter
}


export type EventContext = {
    database: Knex;
    schema: SchemaOverview | null;
    accountability: Accountability | null;
};

export type RegisterFunctions = {
    filter: (event: string, handler: FilterHandler) => void;
    action: (event: string, handler: ActionHandler) => void;
    init: (event: string, handler: InitHandler) => void;
    schedule: (cron: string, handler: ScheduleHandler) => void;
};

export type DirectusTranslation = {
    key: string,
    Transaction: Record<string, string>
}

export type DirectusTranslations = Array<DirectusTranslation>

export type DirectusData<T> = {
    data: Record<string, T>
}

export type DirectusDecodeToken = {
    id: string,
    role: string | null,
    app_access: string | null,
    admin_access: string | null,
    iat: number,
    exp: number,
    iss: string
    // collection: string,
    // accountability: Accountability,
    // eventScope: Record<string, any>,
    // schema: SchemaOverview,
    // cache?: null | any
}

export type DirectusDecodeTokenOuput = {
    decoded: DirectusDecodeToken | null,
    token: string | string[] | null | undefined
}

export type NotificationPayload = {
    status: string;
    timestamp: string;
    recipient: string;
    sender: string | null;
    subject: string;
    message: string | null;
    collection?: string | null;
    item?: PrimaryKey | null;
};

export type AdminTokens = {
    admin_id?: PrimaryKey
    access_token: string,
    refresh_token?: string,
    expires?: number
}

