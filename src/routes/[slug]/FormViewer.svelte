<script>
	import { t } from "$lib/i18n"
	import { BaseModal, modal, ModalFooter, ButtonList, Button } from "@ulibs/yesvelte"

export let data;
</script>
<BaseModal title="Form submission content">
    
    <pre style="font-size: 20px; font-family: monospace;margin: 1rem;" dir="ltr">{JSON.stringify(data, null, 2)}</pre>

    <ModalFooter>
        <ButtonList>
          <Button on:click={() => $modal.resolve()} color="primary">{t("buttons.done")}</Button>
        </ButtonList>
      </ModalFooter>
</BaseModal>