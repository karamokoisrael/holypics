import { defineDisplay } from '@directus/extensions-sdk';
import DisplayComponent from './display.vue';

export default defineDisplay({
	id: 'mgx-display-image',
	name: 'mgx-display-image',
	icon: 'pic',
	description: 'Display picture',
	component: DisplayComponent,
	options: [
		{
			field: 'alt',
			name: 'alt',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
			},
			schema: {
				default_value: "",
			},
		},
		{
			field: 'style',
			name: 'style',
			type: 'string',
			meta: {
				width: 'full',
				interface: 'input-code',
				language: "css"
			},
			schema: {
				default_value: "",
			},
		},
		{
			field: 'prefix',
			name: '$t:displays.formatted-value.prefix',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
				options: {
					label: '$t:displays.formatted-value.prefix_label',
					trim: false,
				},
			},
			schema: {
				default_value: "",
			},
		},
		{
			field: 'suffix',
			name: '$t:displays.formatted-value.suffix',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
				options: {
					label: '$t:displays.formatted-value.suffix_label',
					trim: false,
				},
			},
			schema: {
				default_value: "",
			},
		},
	],
	types: ['string']
});
