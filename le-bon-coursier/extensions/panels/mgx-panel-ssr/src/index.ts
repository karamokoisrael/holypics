import { definePanel } from '@directus/extensions-sdk';
import PanelComponent from './panel.vue';

export default definePanel({
	id: 'mgx-panel-ssr',
	name: 'Panel SSR',
	icon: 'box',
	description: 'Here a an alternative way of displaying panel data using server side rendering',
	component: PanelComponent,
	options: () => [
		{
			field: 'url',
			type: 'string',
			name: '$t:url',
			meta: {
				width: 'full',
				interface: 'input',
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
	minWidth: 12,
	minHeight: 8,
});
