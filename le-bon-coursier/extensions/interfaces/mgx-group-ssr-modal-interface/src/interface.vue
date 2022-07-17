<template>
	<div class="group-modal">
		<v-dialog v-if="layout === 'modal'" v-model="internalActive" @esc="internalActive = false" :persistent="true" placement="center">
			<template #activator="{ on }">
				<component :is="validationErrors.length > 0 ? 'v-badge' : 'div'" icon="priority_high" bordered>
					<v-button small class="trigger-button" :class="headerColor" @click="on">
						<v-icon v-if="headerIcon" :name="headerIcon" left :disabled="disabled" />
						{{ groupTitle }}
					</v-button>
				</component>
			</template>
			<v-card>
				<v-card-title>
					<v-icon v-if="headerIcon" :name="headerIcon" left :disabled="disabled" />
					{{ groupTitle }}
				</v-card-title>
				<v-card-text>
					<!-- <v-form
						:initial-values="initialValues"
						:fields="fields"
						:model-value="values"
						:primary-key="primaryKey"
						:group="field.meta.field"
						:validation-errors="validationErrors"
						:loading="loading"
						:batch-mode="batchMode"
						@update:model-value="$emit('apply', $event)"
					/> -->
				<div :class="layout == 'modal' ? 'modal-ssr-container' : 'sidebar-ssr-container'">
					<iframe :class="layout == 'modal' ? 'modal-iframe' : 'sidebar-iframe'" :src="src"></iframe> 
				</div>
				</v-card-text>
				<v-card-actions>
					<v-button @click="internalActive = false">{{ t('done') }}</v-button>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-drawer
			v-else
			v-model="internalActive"
			:persistent="true"
			:title="groupTitle"
			:icon="headerIcon || 'box'"
			@cancel="internalActive = false"
		>
			<template #activator="{ on }">
				<component :is="validationErrors.length > 0 ? 'v-badge' : 'div'" icon="priority_high" bordered>
					<v-button small class="trigger-button" :class="headerColor" @click="on">
						<v-icon v-if="headerIcon" :name="headerIcon" left :disabled="disabled" />
						{{ groupTitle }}
					</v-button>
				</component>
			</template>
			<!-- <v-form
				:initial-values="initialValues"
				:fields="fields"
				:model-value="values"
				:primary-key="primaryKey"
				:group="field.meta.field"
				:validation-errors="validationErrors"
				:loading="loading"
				:batch-mode="batchMode"
				class="in-drawer"
				@update:model-value="$emit('apply', $event)"
			/> -->
			<div :class="layout == 'modal' ? 'modal-ssr-container' : 'sidebar-ssr-container'">
				<iframe :class="layout == 'modal' ? 'modal-iframe' : 'sidebar-iframe'" :src="src"></iframe> 
			</div>
		</v-drawer>
	</div>
</template>

<script lang="ts">
import { Field } from '@directus/shared/types';
import { defineComponent, PropType, ref, computed, inject } from 'vue';
import { ValidationError } from '@directus/shared/types';
import { render } from 'micromustache';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'InterfaceGroupDetail',
	props: {
		field: {
			type: Object as PropType<Field>,
			required: true,
		},
		fields: {
			type: Array as PropType<Field[]>,
			required: true,
		},
		values: {
			type: Object as PropType<Record<string, unknown>>,
			required: true,
		},
		initialValues: {
			type: Object as PropType<Record<string, unknown>>,
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		batchMode: {
			type: Boolean,
			default: false,
		},
		batchActiveFields: {
			type: Array as PropType<string[]>,
			default: () => [],
		},
		primaryKey: {
			type: [Number, String],
			required: true,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		validationErrors: {
			type: Array as PropType<ValidationError[]>,
			default: () => [],
		},
		layout: {
			type: String as PropType<'modal' | 'sidebar'>,
			default: 'modal',
		},
		title: {
			type: String,
			default: null,
		},
		url: {
			type: String,
			default: "/ssr"
		},
		headerIcon: {
			type: String,
			default: null,
		},
		headerColor: {
			type: String as PropType<'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger'>,
			default: 'secondary',
		},
	},
	emits: ['apply'],
	setup(props) {
		const { t } = useI18n();
		const internalActive = ref<boolean>(false);
		const values = inject('values', ref<Record<string, any>>({}));
		const groupTitle = computed<string>(() => {
			if (!props.title) return props.field.name;

			return render(props.title, values.value);
		});

		const src = computed<string>(() => {
			return render(props.url, values.value);
		});

		return {
			t,
			groupTitle,
			internalActive,
			src,
			layout: props.layout
		};
	},
});
</script>


<style scoped>

.modal-iframe{
	width: 100vw !important;
	height: 65vh !important;
	overflow-y: auto !important;
	border: unset !important;
}

.modal-ssr-container{
	display: flex;
	align-content: center;
	justify-content: center;
	width: 100% !important;
	height: 100% !important;
}

.sidebar-iframe{
	width: 100vw !important;
	height: 100vh !important;
	overflow-y: auto !important;
	border: unset !important;
}

.sidebar-ssr-container{
	display: flex;
	align-content: center;
	justify-content: center;
	width: 100% !important;
	height: 100% !important;
}

.trigger-button.info {
	--v-button-background-color: var(--blue);
	--v-button-background-color-hover: var(--blue-125);
	--v-button-color: var(--blue-alt);
	--v-button-color-hover: var(--blue-alt);
}

.trigger-button.success {
	--v-button-background-color: var(--success);
	--v-button-background-color-hover: var(--success-125);
	--v-button-color: var(--success-alt);
	--v-button-color-hover: var(--success-alt);
}

.trigger-button.warning {
	--v-button-background-color: var(--warning);
	--v-button-background-color-hover: var(--warning-125);
	--v-button-color: var(--warning-alt);
	--v-button-color-hover: var(--warning-alt);
}

.trigger-button.danger {
	--v-button-icon-color: var(--white);
	--v-button-background-color: var(--danger);
	--v-button-background-color-hover: var(--danger-125);
	--v-button-color: var(--danger-alt);
	--v-button-color-hover: var(--danger-alt);
}

.v-form {
	padding-top: calc(var(--form-vertical-gap) / 2);
}

.v-form.in-drawer {
	padding-left: var(--form-horizontal-gap);
}

@media (max-width: 959px) {
	.v-form.in-drawer {
		padding-right: var(--form-horizontal-gap);
	}
}
</style>
