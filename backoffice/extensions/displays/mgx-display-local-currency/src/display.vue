<template>
	<div>{{new Intl.NumberFormat('fr-Fr', { style: 'currency', currency: 'XOF' }).format(value)}}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useApi, useStores } from '@directus/extensions-sdk';

export default defineComponent({
	props: {
		value: {
			type: Number,
			default: null,
		},
	},


	setup(){
		const stores = useStores();
		console.log(stores);
		
		// const api = useApi();
		
		// const { useCollectionsStore } = useStores();
		// const collectionsStore = useCollectionsStore();
	}
});
</script>
