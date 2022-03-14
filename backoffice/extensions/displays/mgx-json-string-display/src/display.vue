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
		json: {
			type: String,
			required: true,
		},
	},

	setup(props) {
		
		const { t } = useI18n();
		const displayValue = computed(() => {
			try {
				const json = JSON.parse(props.json);
				if(json[props.value] != undefined){
					return json[props.value]
				}else{
					return props.value
				}
			} catch (error) {
				return props.value;
			}
		});


		return { displayValue, t };
	},
});
</script>
