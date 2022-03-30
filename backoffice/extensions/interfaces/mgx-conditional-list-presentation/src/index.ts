import { defineInterface } from '@directus/shared/utils';
import PresentationListInterface from './display.vue';

export default defineInterface({
	id: 'mgx-conditional-list-presentation',
	name: 'mgx-conditional-list-presentation',
	description: 'mgx-conditional-list-presentation',
	icon: 'note_add',
	component: PresentationListInterface,
	relational: true,
	types: ['alias'],
	localTypes: ['presentation'],
	group: 'presentation',
	options: ({ editing, relations, fields }) => {

		return [
			{
				field: 'collection',
				type: 'string',
				name: '$t:collection',
				meta: {
					interface: 'system-collection',
					options: {
						includeSystem: true,
					},
					width: 'half',
				},
			},
			{
				field: 'enableCreate',
				name: '$t:creating_items',
				schema: {
					default_value: true,
				},
				meta: {
					interface: 'boolean',
					options: {
						label: '$t:enable_create_button',
					},
					width: 'half',
				},
			},
			{
				field: 'enableSelect',
				name: '$t:selecting_items',
				schema: {
					default_value: true,
				},
				meta: {
					interface: 'boolean',
					options: {
						label: '$t:enable_select_button',
					},
					width: 'half',
				},
			},
			{
				field: 'filter',
				name: '$t:filter',
				type: 'json',
				meta: {
					interface: 'system-filter',
					options: {
						collectionName: "test",
					},
					conditions: [
						{
							rule: {
								enableSelect: {
									_eq: false,
								},
							},
							hidden: true,
						},
					],
				},
			},
		];
	},
	recommendedDisplays: ['related-values']
});
