<template>
	<div>{{new Intl.NumberFormat('fr-Fr', { style: 'currency', currency: 'XOF' }).format(value)}}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		value: {
			type: Number,
			default: null,
		},
	},
});
</script>
