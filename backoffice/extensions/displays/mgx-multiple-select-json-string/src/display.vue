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
				const jsonValues: Array<any> = JSON.parse(props.value);
				let text = "";
				for (const choice of json) {
					choices.push(choice);
					if(choice.children != null && choice.children != undefined){
						for (const childrenChoice of choice.children) {
							choices.push(childrenChoice);
						}
					}
				}
				const items = choices.filter((choice)=> jsonValues.includes(choice.value));
				for (let i = 0; i < items.length; i++) {
					text+=`${items[i].text}${i < items.length -1 ? ", " : ""}`
				}
				
				
				return text;
			} catch (error) {
				return props.value;
			}
		});


		return { displayValue, t };
	},
});
</script>
