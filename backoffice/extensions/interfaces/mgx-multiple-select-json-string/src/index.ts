import { defineInterface } from '@directus/shared/utils';
import InterfaceSelectMultipleDropdown from './select-multiple-dropdown.vue';

export default defineInterface({
	id: 'mgx-multiple-select-json-string',
	name: 'mgx-multiple-select-json-string',
	description: `select multiple items from a json string like 
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
	icon: 'arrow_drop_down_circle',
	component: InterfaceSelectMultipleDropdown,
	types: ['string', 'integer', 'float', 'bigInteger'],
	group: 'selection',
	options: [
		{
			field: 'choices',
			type: 'string',
			name: '$t:choices',
			meta: {
				width: 'full',
				interface: 'input-code',
				options: {
					label: 'json',
					language: "javascript"
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
		{
			field: 'icon',
			name: '$t:icon',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-icon',
			},
		},
	],
	recommendedDisplays: ['mgx-multiple-select-json-string'],
});

