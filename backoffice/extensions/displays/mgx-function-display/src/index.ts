import { defineDisplay } from '@directus/extensions-sdk';
import { DisplayConfig } from '@directus/shared/types';
import DisplayComponent from './display.vue';
type OptionsParams = {field: string };
export default defineDisplay({
	id: 'mgx-function-display',
	name: 'display function output',
	icon: 'box',
	description: `get the output of a function looking like  value + bonjour`,
	component: DisplayComponent,
	options: ({ field }) => {

		const options: DisplayConfig['options'] = [
				{
				field: 'function',
				name: 'function',
				type: 'string',
				meta: {
					width: 'full',
					interface: 'input-code',
					options: {
						label: 'function',
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
