import { defineModule } from '@directus/extensions-sdk';
import ModuleComponent from './module.vue';

export default defineModule({
	id: 'mgx-terminal-emulator',
	name: 'Terminal emulator',
	icon: 'backup',
	routes: [
		{
			path: '',
			component: ModuleComponent,
		},
	],
});
