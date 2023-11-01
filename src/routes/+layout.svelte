<script lang="ts">
  import LeftBar from '$lib/components/LeftBar.svelte';
  import RightBar from '$lib/components/RightBar.svelte';
import { AlertProvider, El, ModalProvider } from '@ulibs/yesvelte';
  import { alert } from '@ulibs/yesvelte';
  import '@ulibs/yesvelte/styles.css';
  import tabler from 'yesvelte/css/tabler.min.css?url';
</script>

<svelte:head>
  <link rel="stylesheet" href={tabler} />
</svelte:head>
<div data-bs-theme="dark">
  <!-- header -->
  <div>Ubuilder cms</div>
  <div class="center">
    <!--left sidebar -->
    <LeftBar  />
    <!-- center -->
    <div style="position: relative; ">
      <slot />
    </div>
    <!-- right sidebar -->
    <RightBar />
    
  </div>
</div>

<ModalProvider />
<AlertProvider fixed alerts={$alert} />

<style>
  .center {
    width: 100%;
    display: grid;
    grid-template-columns: 50px auto 50px;
  }
</style>
