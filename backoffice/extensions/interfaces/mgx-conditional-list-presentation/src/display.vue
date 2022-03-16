<template>
	<div>
		okok
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue';
import { useApi, useStores } from '@directus/extensions-sdk';
import { Directus } from '@directus/sdk';

export default defineComponent({
	props: {

	},
	setup(props) {
		const api = useApi();

		const { useUserStore } = useStores();
		const userStore = useUserStore();

		// const values = inject('values', ref<Record<string, any>>({}));
		// console.log(userStore.currentUser);
		// console.log(userStore.currentUser?.first_name);
		
		// return {"ok": "ok"}
	}
});
</script>

<style lang="scss" scoped>

</style>
