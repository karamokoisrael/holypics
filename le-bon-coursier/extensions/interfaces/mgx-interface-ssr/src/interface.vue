<template>
	<div class="panel-ssr-container">
		<iframe :src="src"></iframe> 
	</div>
</template>

<script lang="ts">
import { useApi } from '@directus/extensions-sdk';
import { defineComponent, inject, onMounted, ref } from 'vue';
import { render } from 'micromustache';

export default defineComponent({
	props: {
		url:  {
			type: String,
			default: '/ssr',
		},
	},
	setup(props){
		const ssrPath = '/ssr'
		const isValidURL = (string: any)=> {
			const res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
			return (res !== null)
		};
		const src = ref<string>(props.url)
		const values = inject('values', ref<Record<string, any>>({}));
		onMounted(async ()=>{
			if(!(src.value as string).startsWith("/")){
				if(!isValidURL(src.value)) src.value = ssrPath //url
			}else{
				const api =  useApi();
				const { data } = await api.get(`/user/getAccessToken`);	
				src.value = `${src.value}${src.value.includes("?") ? "&" : "?"}access_token=${data.data.token}`
			}
		})
		
		return {src: render(src.value, values.value)}
	}
});
</script>

<style scoped>
.text {
	padding: 12px;
}

.text.has-header {
	padding: 0 12px;
}

iframe{
	width: 100vw !important;
	height: 100vh !important;
	overflow-y: auto !important;
	border: unset !important;
}

.panel-ssr-container{
	display: flex;
	align-content: center;
	justify-content: center;
	width: 100% !important;
	height: 100% !important;
}
</style>
