import { defineInterface } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'mgx-select-dropdown-json-string',
	name: 'mgx-select-dropdown-json-string',
	icon: 'box',
	description: 'mgx-select-dropdown-json-string',
	component: InterfaceComponent,
	types: ['string'],
	options: ({ field }) => [
		{
			field: 'choices',
			type: 'string',
			name: '$t:choices',
			meta: {
				width: 'full',
				interface: 'input-code',
				options: {
					placeholder: '$t:interfaces.select-dropdown.choices_placeholder',
					template: '{{ text }}',
					fields: [
						{
							field: 'text',
							type: 'string',
							name: '$t:text',
							meta: {
								interface: 'input',
								width: 'half',
								options: {
									placeholder: '$t:interfaces.select-dropdown.choices_name_placeholder',
								},
							},
						},
						{
							field: 'value',
							type: field.type,
							name: '$t:value',
							meta: {
								interface: 'input',
								options: {
									font: 'monospace',
									placeholder: '$t:interfaces.select-dropdown.choices_value_placeholder',
								},
								width: 'half',
							},
						},
					],
				},
			},
		},
		{
			field: 'allowOther',
			name: '$t:interfaces.select-dropdown.allow_other',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
				options: {
					label: '$t:interfaces.select-dropdown.allow_other_label',
				},
			},
			schema: {
				default_value: false,
			},
		},
		{
			field: 'allowNone',
			name: '$t:interfaces.select-dropdown.allow_none',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
				options: {
					label: '$t:interfaces.select-dropdown.allow_none_label',
				},
			},
			schema: {
				default_value: false,
			},
		},
		{
			field: 'icon',
			name: '$t:icon',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-icon',
			},
		},
		{
			field: 'placeholder',
			name: '$t:placeholder',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
				options: {
					placeholder: '$t:enter_a_placeholder',
				},
			},
		},
	],
});
