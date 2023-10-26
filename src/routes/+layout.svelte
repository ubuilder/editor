<script lang="ts">
  import { AlertProvider, ModalProvider } from '@ulibs/yesvelte';
  import { alert } from '@ulibs/yesvelte';
  import '@ulibs/yesvelte/styles.css';
</script>

<slot />
<ModalProvider />
<AlertProvider fixed alerts={$alert} />
