<template>
	<div>{{displayValue}}</div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	props: {
		value: {
			type: String,
			default: null,
		},
		function: {
			type: String,
			required: true,
		},
	},

	setup(props) {
		
		const { t } = useI18n();
		const displayValue = computed(() => {
			try {
				const value = props.value
				const newValue = eval(props.function)
				return newValue;
			} catch (error) {
				return props.value;
			}
		});


		return { displayValue, t };
	},
});
</script>
