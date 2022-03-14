import { defineDisplay } from '@directus/extensions-sdk';
import { DisplayConfig } from '@directus/shared/types';
import DisplayComponent from './display.vue';
export default defineDisplay({
	id: 'mgx-json-string-display ',
	name: 'display an element from a json string',
	icon: 'box',
	description: `display an element from a json string  like [{"key":"my_key", "value": "my_value"}]`,
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
