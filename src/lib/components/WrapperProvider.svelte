<script lang="ts">
  import { confirmModal } from '@ulibs/yesvelte';
  import { Button, Icon } from 'yesvelte';
  export let target: HTMLElement;
  export let editor: HTMLElement;

  export let page;
  export let selectedComponent
  // $:console.log('i got the slot: ', slot)
  let show = false;
  let x = 0;
  let y = 0;
  let w = 0;
  let h = 0;
  function setValues(target) {
    if (!target || !editor) {
      show = false;
      return;
    }
    show = true;

    const rect = target?.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(editor);

    x = rect.left - computedStyle?.left?.split('px')[0] + 0.2;
    y = rect.top - computedStyle?.top?.split('px')[0];
    w = rect.width;
    h = rect.height;
  }
  $: {
    setValues(target?.firstChild);
  }

  async function onAddSlot() {
    console.log('onAddSlot');

    if (componentId) {
      const component = components.find((x) => x.id === componentId);
      if (component) {
        slotList = [...(slotList ?? []), { type: component.id, props: {} }];
      } else {
        console.log('component not found...');
      }
    } else {
      const slot = await modal.open(SlotModal, {
        components,
        allowedComponents,
        disabledComponents,
        mode: 'add',
        slot: {
          props: {}
        }
      });
      if (slot) {
        slotList = [...(slotList ?? []), slot];
      }
    }
  }
  async function onRemoveSlot() {
    const id = target.id.split('.');
    let forDeleteParent = page.slot;

    const choice = await confirmModal.open({
      status: 'danger'
    });

    if (choice) {
      console.log('page: ', page)
      console.log('choice')
      if (id.length == 1) {
        forDeleteParent.splice(id[0], 1);
      } else {
        forDeleteParent = forDeleteParent[id[0]];
        for (let i = 1; i < id.length; i++) {
          if (i == id.length - 1) {
            forDeleteParent.props.slot.splice(id[i], 1);
            break;
          }
          forDeleteParent = forDeleteParent.props.slot[id[i]];
        }
      }
      page = page
      console.log('page: ', page)

    }
  }
  function setSelectedComponent(){
    let id = target.id.split('.')
    let selected = page.slot[id.shift()]
    for (let i of id){
      selected = selected.props.slot[i]
    }
    selectedComponent = selected

  }
</script>

<div
  class="wrapper"
  style="width:{w}px; height: {h}px; top: {y}px; left: {x}px; border: 1px solid green; position : absolute; pointer-events:none; display:{show
    ? ''
    : 'none'}"
    on:click   = {setSelectedComponent}
>
  <div style="position:relative;pointer-events:all;display:flex;flex-wrap:nowrap ">
    <Button size="sm" color="danger" on:click={onRemoveSlot}>Remove<Icon name="x" /></Button>
  </div>
</div>
