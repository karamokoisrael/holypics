import { defineInterface } from '@directus/shared/utils';
import InterfacePresentation from './presentation.vue';

export default defineInterface({
	id: 'mgx-eval',
	name: 'mgx-eval',
	description: `get the output of a function looking like  value + bonjour`,
	icon: 'box',
	component: InterfacePresentation,
	hideLabel: true,
	hideLoader: true,
	types: ['alias'],
	localTypes: ['presentation'],
	group: 'presentation',
	options: () => [
		{
			field: 'function',
			type: 'string',
			name: 'function',
			meta: {
				width: 'full',
				interface: 'input-code',
				options: {
					label: 'function',
					language: "javascript"
				},
			},
		},
	],
});
