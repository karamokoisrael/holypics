<template>
	<private-view title="Backup manager">
		<div>
				<v-skeleton-loader v-show="backupList.length == 0">
				</v-skeleton-loader>
				<v-button kind="success" rounded="true" @click="onSave()">Sauvgarder maintenant</v-button>
				<v-list v-for="backup in backupList" :key="backup" class="backup-container">
					<v-list-item class="backup-item">
						<h5>{{backup}}</h5>
						<v-button kind="warning" rounded="true" @click="onRestore(backup)">Restorer</v-button>
						<v-button kind="danger" rounded="true" @click="onDelete(backup)">Supprimer</v-button>
					</v-list-item>
					
				</v-list>
			
		</div>
	</private-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { useApi, useStores } from '@directus/extensions-sdk';

export default defineComponent({

	
	data(){
		return { backupList: []}
	},

	async created() {
		// const api = useApi();
		
		// const { useCollectionsStore } = useStores();
		// const collectionsStore = useCollectionsStore();

		try {
			const response = await fetch("/db/get-backup-list");
			const responseJson = await response.json();
			this.backupList = responseJson;
		} catch (error) {

		}
	},
	methods: {
		async onDelete(id: string){
			console.log("deleting => ", id);
				try {
					const response = await fetch(`/db/delete-backup/${id}`, {method: "DELETE"});
					const responseJson = await response.json();
					this.backupList = this.backupList.filter((item: string)=> item != id);
				} catch {}
		},
		async onRestore(id: string){
			console.log("restoring => ", id);
			try {
				const response = await fetch(`/db/db-restore/${id}`, {method: "POST"});
				const responseJson = await response.json();
				this.backupList = this.backupList.filter((item: string)=> item != id);
				alert("opération en cours");
				//@ts-ignore
				window.localStorage.clear();
				//@ts-ignore
				window.location = "/"
			} catch {}
		},
		async onSave(){
			try {
				const response = await fetch(`/cron/db-backup`);
				const responseJson = await response.json();

				const updateResponse = await fetch("/db/get-backup-list");
				const updateResponseJson = await updateResponse.json();
				this.backupList = updateResponseJson;
			} catch {}
		}
	}

});
</script>

<style scoped>

</style>
