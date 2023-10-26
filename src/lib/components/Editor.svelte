<script lang="ts">
  import { SvelteComponent, onMount } from "svelte";
  import WrapperProvider from "./WrapperProvider.svelte"
  const componentsSelector = ".u-component"
  let components
  let editor
  let targets:HTMLElement []  = []


  let wrapperProvider: SvelteComponent


    onMount(()=>{
        components = document.querySelectorAll(componentsSelector)
        function handler(event: Event ){
            targets.push(event?.target?.firstChild)
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
<div bind:this = {editor} style = 'position:absolute;pointers-event:none;border: none; width: -moz-available'>
    <slot />
    <WrapperProvider bind:editor  bind:this = {wrapperProvider} bind:target = {targets[targets.length - 1]} />
</div>


