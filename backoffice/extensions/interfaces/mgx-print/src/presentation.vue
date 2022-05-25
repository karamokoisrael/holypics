<template>
	<div>{{displayValue}}</div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import vm from 'vm';
export default defineComponent({
	props: {
		value: {
			type: String,
			default: null,
		},
		function: {
			type: String,
			required: true,
		},
	},
	setup(props) {
		

		const safeEval = (code: any, context: any=undefined, opts: any = undefined)=> {
		var sandbox = {}
		var resultKey = 'SAFE_EVAL_' + Math.floor(Math.random() * 1000000)
		sandbox[resultKey] = {}
		var clearContext = `
			(function(){
			Function = undefined;
			const keys = Object.getOwnPropertyNames(this).concat(['constructor']);
			keys.forEach((key) => {
				const item = this[key];
				if(!item || typeof item.constructor !== 'function') return;
				this[key].constructor = undefined;
			});
			})();
		`
		code = clearContext + resultKey + '=' + code
		if (context) {
			Object.keys(context).forEach(function (key) {
			sandbox[key] = context[key]
			})
		}
		vm.runInNewContext(code, sandbox, opts)
		return sandbox[resultKey]
		}
		const { t } = useI18n();
		const displayValue = computed(() => {
			try {
				const value = props.value
				// const newValue = eval(props.function)
				const newValue = safeEval(props.function)
				return newValue;
			} catch (error) {
				return props.value;
			}
		});

		return { displayValue, t };
	},
});
</script>

<style lang="scss" scoped>

</style>
