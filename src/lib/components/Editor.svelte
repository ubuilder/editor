<script lang="ts">
  import { SvelteComponent, onMount } from "svelte";
  import WrapperProvider from "./WrapperProvider.svelte"
  
  export let page 
  export let selectedComponent
  const componentsSelector = ".u-component"
  let components
  let editor
  let targets:HTMLElement []  = []


  let wrapperProvider: SvelteComponent


    onMount(()=>{
        components = document.querySelectorAll(componentsSelector)
        function handler(event: Event ){
            targets.push(event?.target)
            targets = targets
            event.preventDefault()
        }
        function leaveHandler(event: Event){
            targets.pop()
            targets = targets
        }
        components.forEach(component =>{
            component.addEventListener('mouseenter', handler)
            component.addEventListener('mouseleave', leaveHandler)
        })
    })

</script>
<div bind:this = {editor} style = 'position:relative;pointers-event:none;border: none; width: -moz-available'>
    <slot />
    <WrapperProvider bind:selectedComponent bind:page bind:editor  bind:this = {wrapperProvider} bind:target = {targets[targets.length - 1]} />
</div>


