import { defineInterface } from '@directus/extensions-sdk';
import IntefaceComponent from './interface.vue';

export default defineInterface({
	id: 'mgx-interface-ssr',
	name: 'Interface SSR',
	icon: 'box',
	description: 'Here a an alternative way of displaying interface data using server side rendering',
	component: IntefaceComponent,
	hideLabel: true,
	hideLoader: true,
	types: ['alias'],
	localTypes: ['presentation'],
	group: 'presentation',
	options: ({ collection }) => [
		{
			field: 'url',
			type: 'string',
			name: '$t:url',
			meta: {
				width: 'full',
				interface: 'system-display-template',
				options: {
					collectionName: collection,
					font: 'monospace',
					placeholder: 'https://example.com/articles/{{ id }}/{{ slug }}',
				},
			},
		},
		{
			field: 'text',
			name: 'Text',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'full',
			},
		},
	],
});
