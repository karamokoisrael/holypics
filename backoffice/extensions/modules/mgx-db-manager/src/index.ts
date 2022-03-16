import { defineModule } from '@directus/extensions-sdk';
import ModuleComponent from './module.vue';

export default defineModule({
	id: 'mgx-db-manager',
	name: 'Database Manager',
	icon: 'backup',
	routes: [
		{
			path: '',
			component: ModuleComponent,
		},
	],
});
