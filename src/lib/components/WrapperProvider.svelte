<script lang="ts">
  import { confirmModal } from '@ulibs/yesvelte';
  import { Button, Icon } from 'yesvelte';
  export let target: HTMLElement;

  $:console.log('target change: ', target)
  export let editor: HTMLElement;

  export let page;
  export let selectedComponent;
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


    // x = rect.left
    // x = rect.left - computedStyle?.left?.split('px')[0] + 0.2;
    x = rect.left - editor.getBoundingClientRect().left + 0.2;
    y = rect.top - editor.getBoundingClientRect().top;
    // y = rect.top
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
      console.log('page: ', page);
      console.log('id', id);
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
      page = page;
      console.log('page: ', page);
    }
  }
  function setSelectedComponent() {
    console.log('selectedComponent: ', selectedComponent)
    let id = target.id.split('.');
    let parentId = id.slice(0, id.length -1)
    let component = findComponent(page, id)
    
    // const parent = findComponent (page, parentId)

    // parentId.pop()
    //Todo 
    // find element
    // find the parent element
    console.log('id: ', id)
    console.log('parentID: ', parentId)
    console.log('compoent: ', parent)
    console.log('selectedComponent: ', selectedComponent)
    // selectedComponent = {}

  }
  function findComponent(page, id){
    if(id.length === 0){
       selectedComponent = page.slot
    }else if(id.length  === 1 ){
       selectedComponent = page.slot[id[0]]
    }else{
      let s = page.slot[id[0]]
      for(let i =  1; i < id.length ; i++){
        s = s.props.slot[i]
      }
      selectedComponent = s
    }
  }
</script>

<div
  class="wrapper"
  style="width:{w}px; height: {h}px; top: {y}px; left: {x}px; display:{show ? '' : 'none'}"
  on:click={setSelectedComponent}
>
  <!-- <div class="banner">component name</div> -->
  

</div>

<style>
  .wrapper {
    border: 1px solid rgb(0, 21, 250);
    position: absolute;
    background: transparent;
    /* pointer-events: none; */
  }
  .banner {
    pointer-events: all;
    position: relative;
    z-index: -1;
    transform: translateY(-100%);
  }
</style>
