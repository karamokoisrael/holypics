<template>
	<v-notice v-if="!choices" type="warning">
		{{ t('choices_option_configured_incorrectly') }}
	</v-notice>
	<v-select
		v-else
		multiple
		:model-value="value"
		:items="choices"
		:disabled="disabled"
		:show-deselect="allowNone"
		:placeholder="placeholder"
		:allow-other="allowOther"
		:close-on-content-click="false"
		@update:model-value="updateValue($event)"
	>
		<template v-if="icon" #prepend>
			<v-icon :name="icon" />
		</template>
	</v-select>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { defineComponent, PropType } from 'vue';
import { sortBy } from 'lodash';

type Option = {
	text: string;
	value: string | number | boolean;
	children?: Option[];
};

export default defineComponent({
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		value: {
			type: String,
			default: null,
		},
		choices: {
			type: String,
			default: null,
		},
		icon: {
			type: String,
			default: null,
		},
		allowNone: {
			type: Boolean,
			default: false,
		},
		placeholder: {
			type: String,
			default: () => "",
		},
		allowOther: {
			type: Boolean,
			default: false,
		},
	},
	// emits: ['input'],
	// setup(props) {
	// 	const choices:Array<Option> = JSON.parse(props.choices)
	// 	const { t } = useI18n();
	// 	return { choices, t };
	// },
	emits: ['input'],
	setup(props, { emit }) {
		const { t } = useI18n();
		const choices:Array<Option> = JSON.parse(props.choices);

		return { t, updateValue };

		
		function updateValue(value: PropType<string[]>) {
			const sortedValue = sortBy(value, (val) => {
				const sortIndex = choices.findIndex((choice) => val === choice.value);
				return sortIndex !== -1 ? sortIndex : value.length;
			});

			emit('input', sortedValue);
		}
	},
});
</script>
