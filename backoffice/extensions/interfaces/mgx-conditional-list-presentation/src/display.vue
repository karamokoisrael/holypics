<template>
<div>
	working
</div>
	<!-- <v-notice v-if="!junction || !relation" type="warning">
		{{ t('relationship_not_setup') }}
	</v-notice> -->
	<!-- <div v-else class="many-to-many">
		<template v-if="loading">
			<v-skeleton-loader
				v-for="n in (value || []).length || 3"
				:key="n"
				:type="(value || []).length > 4 ? 'block-list-item-dense' : 'block-list-item'"
			/>
		</template>

		<v-notice v-else-if="sortedItems.length === 0">
			{{ t('no_items') }}
		</v-notice>

		<v-list v-else>
			<draggable
				:force-fallback="true"
				:model-value="sortedItems"
				item-key="id"
				handle=".drag-handle"
				:disabled="!junction.meta?.sort_field"
				@update:model-value="sortItems($event)"
			>
				<template #item="{ element }">
					<v-list-item :dense="sortedItems.length > 4" block clickable @click="editItem(element)">
						<v-icon
							v-if="junction.meta?.sort_field"
							name="drag_handle"
							class="drag-handle"
							left
							@click.stop="() => {}"
						/>
						<render-template
							:collection="junctionCollection.collection"
							:item="element"
							:template="templateWithDefaults"
						/>
						<div class="spacer" />
						<v-icon v-if="!disabled" name="close" @click.stop="deleteItem(element)" />
					</v-list-item>
				</template>
			</draggable>
		</v-list>

		<div v-if="!disabled" class="actions">
			<v-button v-if="enableCreate && createAllowed" @click="createNew()">{{ t('create_new') }}</v-button>
			<v-button v-if="enableSelect && selectAllowed" @click="selectModalActive = true">
				{{ t('add_existing') }}
			</v-button>
		</div>

		<drawer-item
			v-if="!disabled"
			:active="editModalActive"
			:collection="relationInfo.junctionCollection"
			:primary-key="currentlyEditing || '+'"
			:related-primary-key="relatedPrimaryKey || '+'"
			:junction-field="relationInfo.junctionField"
			:edits="editsAtStart"
			:circular-field="junction.field"
			@input="stageEdits"
			@update:active="cancelEdit"
		/>


	</div> -->
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { defineComponent, computed, PropType, toRefs, inject, ref } from 'vue';
import { get } from 'lodash';
import Draggable from 'vuedraggable';
import { Filter } from '@directus/shared/types';
import { parseFilter } from '@directus/shared/src/utils/parse-filter';
import { render } from 'micromustache';
import { deepMap } from '@directus/shared/utils';

import { getFieldsFromTemplate } from '@directus/shared/utils';
// import { defineComponent, computed, PropType, toRefs, inject, ref } from 'vue';
// import { parseFilter } from '@directus/shared/src/utils/parse-filter';
// import { useApi, useStores } from '@directus/extensions-sdk';
// import { Directus } from '@directus/sdk';
// import { log } from 'console';

export default defineComponent({
	props: {
		value: {
			type: Array as PropType<(number | string | Record<string, any>)[] | null>,
			default: null,
		},
		primaryKey: {
			type: [Number, String],
			required: true,
		},
		collection: {
			type: String,
			required: true,
		},
		field: {
			type: String,
			required: true,
		},
		template: {
			type: String,
			default: null,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		enableCreate: {
			type: Boolean,
			default: true,
		},
		enableSelect: {
			type: Boolean,
			default: true,
		},
		filter: {
			type: Object as PropType<any>,
			default: null,
		},
	},
	setup(props) {
		// const api = useApi();

		// const { useUserStore } = useStores();
		// const userStore = useUserStore();

		// const values = inject('values', ref<Record<string, any>>({}));
		// console.log(userStore.currentUser);
		// console.log(userStore.currentUser?.first_name);
		
		// return {"ok": "ok"}
		
		const { t } = useI18n();

		const values = inject('values', ref<Record<string, any>>({}));

		const customFilter = computed(() => {
			return parseFilter(
				deepMap(props.filter, (val: any) => {
					if (val && typeof val === 'string') {
						return render(val, values.value);
					}

					return val;
				})
			, null, {});
		});

		console.log(customFilter);
		
		const { value, collection, field } = toRefs(props);
		
	}
});
</script>

<style lang="scss" scoped>

</style>
