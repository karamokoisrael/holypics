import { defineModule } from '@directus/extensions-sdk';
import ModuleComponent from './module.vue';

export default defineModule({
	id: 'mgx-ssr',
	name: 'pages',
	icon: 'density_medium',
	routes: [
		{
			path: '',
			component: ModuleComponent,
		}
	],
});
