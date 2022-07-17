import { Knex } from 'knex';
import { FilterHandler, ActionHandler, InitHandler, ScheduleHandler, SchemaOverview, Accountability } from "@directus/shared/types";
import { PrimaryKey } from '@directus/shared/types';

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
    role: string |null,
    app_access: string |null,
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

