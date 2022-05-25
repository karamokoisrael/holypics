<template>
	<private-view small-header class="ssr-container">
		 <iframe :src="src">
		 
		 </iframe> 
	</private-view>
</template>

<script lang="ts">
import { useApi } from '@directus/extensions-sdk';
import { defineComponent, onMounted, ref } from 'vue';
const ssrPath = "/ssr"

export default defineComponent({
	setup(){
		const src = ref(ssrPath);
		const isValidURL = (string: any)=> {
			const res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
			return (res !== null)
		};

		

		onMounted(async () => {
			const params = Object.fromEntries(new URLSearchParams(window.location.search));
			const url = params.url != "" && params.url != undefined && params.url!=null ? params.url : ssrPath
			
			try {
				if(!(url as string).startsWith("/")){
					if(!isValidURL(url)) src.value = ssrPath //url
				}else{
					const api =  useApi();
					const { data } = await api.get(`/user/getAccessToken`);	
					src.value = `${url}${url.includes("?") ? "&" : "?"}access_token=${data.data.token}`
				}
			} catch (error) {
				console.log(error);
				return src.value = url
			}
		})
	
		return { src: src}
	},
});
</script>

<style>
	iframe{
		width: 100% !important;
		height: 100% !important;
		overflow-y: auto !important;
		border: unset !important;
	}

	.ssr-container #navigation .module-nav, .ssr-container #sidebar {
    	display: none !important;
	}
</style>
