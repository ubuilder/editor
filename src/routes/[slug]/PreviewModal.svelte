<script lang="ts">
  import {
    ButtonList,
    modal,
    BaseModal,
    Button,
    Icon,
    ModalHeader,
    ModalTitle,
  } from "@ulibs/yesvelte";

  export let slug: any[] = [];
  export let title: string | undefined = undefined;
</script>

<BaseModal>
  <ModalHeader px="3">
    <ModalTitle>{title}</ModalTitle>
    <ButtonList>
      <Button target="_blank" href="/{slug}"
        ><Icon name="external-link" />
        Open in new Tab</Button
      >
      <Button on:click={() => $modal.close()}>Close</Button>
    </ButtonList>
  </ModalHeader>
  <iframe {title} src="/{slug}" frameborder="0" />
</BaseModal>
