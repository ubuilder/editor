<script lang="ts">
  import { browser } from "$app/environment";
  import * as hljs from "highlight.js";
  import { onDestroy, onMount } from "svelte";

  export let value = "";
  export let readonly = false;

  export let disabled = false;
  export let lang = "hbs";
  let thisValue = value;

  let el;
  let instance: any;

  onMount(() => {
    import('codejar').then(({CodeJar}) => {

    instance = CodeJar(el, hljs.default.highlightElement, {
      tab: "  ",
      catchTab: false,
    });

    instance.onUpdate((code) => {
      console.log("calling on update", code);
      value = code;
      thisValue = code;
      // this.$data.value = code
    });
})

  });

  onDestroy(() => {
    if (instance) {
      instance.destroy();
    }
  });

  $: if (browser && value !== thisValue) {
    thisValue = value;
    instance.updateCode(value);
  }
</script>

<pre
  contenteditable={readonly || disabled ? false : undefined}
  tabindex={readonly ? 0 : undefined}
  bind:this={el}
  class="y-code-editor language-{lang}"
/>
