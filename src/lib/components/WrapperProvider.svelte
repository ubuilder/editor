<script lang="ts">
  import { Button, Icon } from "yesvelte";

  export let target: HTMLElement;
  export let editor: HTMLElement
  let show = false
  let x = 0;
  let y = 0;
  let w = 0;
  let h = 0;
  function setValues(target) {
    if (!target || !editor) {
      show = false
      return
    };
    show = true

    const rect = target?.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(editor)
    
    x = rect.left  - computedStyle?.left?.split("px")[0] + 0.2;
    y = rect.top - computedStyle?.top?.split("px")[0];
    w = rect.width;
    h = rect.height;
  }
  $: {
    setValues(target);
  }

</script>

<div class="wrapper" style="width:{w}px; height: {h}px; top: {y}px; left: {x}px; border: 1px solid green; position : absolute; pointer-events:none; display:{show?"":"none"}">
  <div style = 'position:relative;pointer-events:all;display:flex;flex-wrap:nowrap '>
      <Button size = 'sm' color = 'danger'>Remove<Icon name = "x"  /></Button>
      <Button size = "sm" color   = 'primary'> Add slot<Icon name = "plus" /></Button>
  </div>
</div>
