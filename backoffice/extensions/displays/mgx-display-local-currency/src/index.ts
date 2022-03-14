import { defineDisplay } from '@directus/extensions-sdk';
import DisplayComponent from './display.vue';

export default defineDisplay({
	id: 'mgx-display-local-user-currency',
	name: 'Dislay user local currency',
	icon: 'money',
	description: 'Display user local currency  so awesome',
	component: DisplayComponent,
	options: null,
	types: ['float', 'integer', 'decimal'],
});
