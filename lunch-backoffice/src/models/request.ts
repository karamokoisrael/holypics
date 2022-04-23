import { PrimaryKey } from 'directus/dist/types';
import { BaseException } from '@directus/shared/exceptions';

export class JsonResponse extends BaseException {
	id: PrimaryKey | null;
	data: Record<string, any>;
	constructor(id: PrimaryKey | null, data: Record<string, any>) {
		super("", 200, "");
		this.id = id
		this.data = data
	}
}