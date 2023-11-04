<script lang="ts">
  import { SvelteComponent, onMount } from 'svelte';
  import WrapperProvider from './WrapperProvider.svelte';

  export let page;
  export let selectedComponent;
  const componentsSelector = '.u-component';
  let components;
  let editor;
  let targets: HTMLElement[] = [];
  let wrapperProvider: SvelteComponent;
  function handler(event: Event) {
    console.log('enter');
    targets.push(event?.target);
    targets = targets;
  }
  function leaveHandler(event: Event) {
    console.log('leave');
    targets.pop();
    targets = targets;
  }

  function registerEvents() {
    components = document.querySelectorAll(componentsSelector);
    components.forEach((component) => {
      component.addEventListener('mouseenter', handler);
      component.addEventListener('mouseleave', leaveHandler);
    });
  }
  onMount(() => {
    registerEvents();
  });
</script>

<div
  bind:this={editor}
  style="position:absolute;pointers-event:none;border: none; width: -moz-available"
>
  <slot />
  <WrapperProvider
    bind:selectedComponent
    bind:page
    bind:editor
    bind:this={wrapperProvider}
    bind:target={targets[targets.length - 1]}
  />
</div>
