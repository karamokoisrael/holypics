<template>
	<div>{{displayValue}}</div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

type Option = {
	text: string;
	value: string | number | boolean;
	children?: Option[];
};

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
				const json: Array<Option> = JSON.parse(props.json);
				const choices: Array<Option> = [];

				for (const choice of json) {
					choices.push(choice);
					if(choice.children != null && choice.children != undefined){
						for (const childrenChoice of choice.children) {
							choices.push(childrenChoice);
						}
					}
				}
				const item = choices.find((choice)=> choice.value == props.value);
				return item.text;
				
				// if(json[props.value] != undefined){
				// 	return json[props.value]
				// }else{
				// 	return props.value
				// }
			} catch (error) {
				return props.value;
			}
		});


		return { displayValue, t };
	},
});
</script>
