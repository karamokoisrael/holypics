<template>
  <v-avatar tile>
    <img
      :src="src"
      role="presentation"
      :alt="alt"
      :style="style"
      :class="classNames"
    />
  </v-avatar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  props: {
    value: {
      type: String,
      default: "",
    },
    alt: {
      type: String,
      default: "",
    },
    class: {
      type: String,
      default: "",
    },
    prefix: {
      type: String,
      default: "",
    },
    suffix: {
      type: String,
      default: "",
    },
  },

  setup(props) {
    let src = props.value;
    if (props.prefix != null && props.prefix != undefined)
      src = props.prefix + src;
    if (props.suffix != null && props.suffix != undefined) src += props.suffix;

    const { t } = useI18n();
    return { src, classNames: props.class, t };
  },
});
</script>

<style scoped>
	img {
    display: inline-block;
    width: auto;
    height: 100%;
    vertical-align: -30%;
    border-radius: var(--border-radius);
	}
</style>
