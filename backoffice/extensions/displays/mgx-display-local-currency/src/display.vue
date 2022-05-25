<template>
	<div>
		<p>{{displayValue}}</p>
		
	</div>
</template>

<script lang="ts">
import { useApi } from '@directus/extensions-sdk';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
	props: {
		value: {
			type: [String, Number],
			default: null,
		},
		lang: {
			type: String,
			default: "fr-FR",
		},
		currency: {
			type: String,
			default: null,
		}
	},
	setup(props){
		const displayValue = ref(null);
		const isEmpty = (value: any)=> value == null || value == undefined || value == ""
		const areEmpty = (values: any[])=>{
			for (const value of values) {
				if(isEmpty(value)) return true;
			}
			return false;
		}
		onMounted(async () => {
			try {
				if(areEmpty([props.lang, props.currency])){
					const api =  useApi();
					const { data } = await api.get(`/users/me`, { params: { fields: ["currency", "language"]}});	
					displayValue.value = new Intl.NumberFormat(isEmpty(props.lang) ? data.data.language : props.lang, { style: "currency", currency: data.data.currency }).format(Number(props.value))
				}else{
					displayValue.value = new Intl.NumberFormat(props.lang, { style: "currency", currency: props.currency }).format(Number(props.value))
				}
				
			} catch (error) {
				displayValue.value = props.value;
			}
		})
		return {displayValue}
	},
});


</script>

