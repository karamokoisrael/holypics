import { defineDisplay } from '@directus/extensions-sdk';
import DisplayComponent from './display.vue';

export default defineDisplay({
	id: 'mgx-display-local-user-currency',
	name: 'Dislay user local currency',
	icon: 'money',
	description: 'Display user local currency  so awesome',
	component: DisplayComponent,
	options: ({ collection }) => [
		{
			field: 'lang',
			name: 'lang',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
				placeholder: 'en-US'
			},
			schema:{
				default_value: "fr-FR"
			}
		},
		{
			field: 'currency',
			name: 'currency',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
				placeholder: 'USD'
			}
		},
	],
	types: ['float', 'integer', 'decimal', 'string'],
});
