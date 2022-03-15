import { defineDisplay } from '@directus/extensions-sdk';
import { DisplayConfig } from '@directus/shared/types';
import DisplayComponent from './display.vue';
export default defineDisplay({
	id: 'mgx-select-json-string',
	name: 'display an item from a json string',
	icon: 'box',
	description: `display an item from a json string like 
	[
		{
			"text": "ok",
			"value": "ok"
		},
		{
			"text": "test",
			"value": "test"
		}
	]`,
	component: DisplayComponent,
	options: ({ field }) => {

		const options: DisplayConfig['options'] = [
			{
			field: 'json',
			name: 'json',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input-code',
				options: {
					label: 'json',
					language: "javascript"
				},
			},
			schema: {
				default_value: null,
			},
			}
		]
		return options;
	},

	types: ['string'],
});
