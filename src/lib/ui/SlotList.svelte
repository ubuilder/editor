<script lang="ts">
  import Sortable from "sortablejs";
  import {
    ButtonList,
    modal,
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionTitle,
    Accordions,
    Button,
    Card,
    confirmModal,
    El,
    Icon,
    Tabs,
    CardHeader,
    TabList,
    TabItem,
    CardBody,
    TabContent,
    TabPanel,
  } from "@ulibs/yesvelte";
  import SlotModal from "./SlotModal.svelte";
  import { onDestroy, onMount } from "svelte";
  import { slots as slotsStore } from "$lib/stores/pageSlots";
  import type { Component } from ".";
  import ComponentProp from "./ComponentProp.svelte";
	import { goto } from "$app/navigation"

  export let buttonText: string = "Add Slot";
  export let allowedComponents: string[] = [];
  export let disabledComponents: string[] = [];
  export let componentId: string | undefined = undefined;

  export let components: Component[] = []
  export let slotList: any[] = [];

  export let id = "";
  export let items: any = {};

  let element: HTMLDivElement;
  let instance: Sortable;

  async function onRemoveSlot(index: number) {
    const choice = await confirmModal.open({
      status: "danger",
    });

    if (choice) {
      slotList.splice(index, 1);
      slotList = slotList;
    }
  }
  type MoveCustomeEvent = {
    from: string;
    to: string;
    fromIndex: number;
    toIndex: number;
  };
  function onMove(obj: MoveCustomeEvent): void {
    let fromAdd = obj.from?.split("_") ?? [];
    let toAdd = obj.to?.split("_") ?? [];
    let from = $slotsStore;
    let to = $slotsStore;
    for (let i of fromAdd) {
      if (i !== "") {
        from = from[i].slot;
      }
    }
    for (let i of toAdd) {
      if (i !== "") {
        to = to[i].slot;
      }
    }
    const temp = JSON.stringify(from[obj.fromIndex]) as string;
    from.splice(obj.fromIndex, 1);
    to.splice(obj.toIndex, 0, JSON.parse(temp));
    $slotsStore = $slotsStore;
  }

  

  onMount(() => {
    instance = new Sortable(element, {
      animation: 150,
      easing: "cubic-bezier(1, 0, 0, 1)",
      draggable: ".sortable-item",
      group: "nested",
      onEnd: function (/**Event*/ evt) {
        console.log(evt);
        onMove({
          from: evt.from?.parentElement?.id,
          to: evt.to?.parentElement?.id,
          fromIndex: evt.oldIndex,
          toIndex: evt.newIndex,
        });
      },
    });
  });

  onDestroy(() => {
    if (instance) {
      instance.destroy();
    }
  });

  async function onAddSlot() {
    console.log("onAddSlot");

    if (componentId) {
      const component = components.find((x) => x.id === componentId);
      if (component) {
        slotList = [...(slotList ?? []), { type: component.id, props: {} }];
      } else {
        console.log("component not found...");
      }
    } else {
      const slot = await modal.open(SlotModal, {
        components,
        allowedComponents,
        disabledComponents,
        mode: "add",
        slot: {
          props: {},
        },
      });
      if (slot) {
        slotList = [...(slotList ?? []), slot];
      }
    }
  }
</script>

<Accordions id={id + "_"}>
  <div style="padding: 8px 0px" bind:this={element}>
    {#each slotList ?? [] as slot, index}
      {@const component = components.find(x => x.id === slot.type)}
      <Card
        style="border: none;"
        id={id + "_" + index}
        class="page-slot sortable-item"
        my="2"
      >
        <Accordion>
          <AccordionHeader p="0">
            <El w="100" d="flex" alignItems="center" justifyContent="between">
              <AccordionTitle px="3" style="flex: 1; color: #aaa">
                {component?.name}
              </AccordionTitle>
              <ButtonList on:click>
              
                <Button
                  ghost
                  color="danger"
                  on:click!stopPropagation={() => onRemoveSlot(index)}
                >
                  <Icon name="trash" />
                </Button>
              </ButtonList>
            </El>
          </AccordionHeader>
          <AccordionBody p="0">
            {#if component}
              {#if Array.isArray(component.fields)}
                <Card p="3">
                  <El row>
                    {#each component.fields as field}
                      <ComponentProp
                        {components}
                        {items}
                        {field}
                        bind:value={slot.props[field.name]}
                      />
                    {/each}
                  </El>
                </Card>
              {:else}
                <Card>
                  <Tabs>
                    <CardHeader>
                      <TabList>
                        {#each Object.keys(component.fields) as key}
                          <TabItem>{key}</TabItem>
                        {/each}
                      </TabList>
                    </CardHeader>
                    <CardBody>
                      <TabContent>
                        {#each Object.keys(component.fields) as key}
                          <TabPanel>
                            <El row>
                              {#each component.fields[key] as field}
                                <ComponentProp
                                  {components}
                                  {items}
                                  {field}
                                  bind:value={slot.props[field.name]}
                                />
                              {/each}
                            </El>
                          </TabPanel>
                        {/each}
                      </TabContent>
                    </CardBody>
                  </Tabs>
                </Card>
                <!-- Tabs -->
              {/if}
            {:else}
              Component not found ({slot.type})
            {/if}
            <!-- <Element bind:element={slot} {items} {components} mode="edit" /> -->
          </AccordionBody>
        </Accordion>
      </Card>
    {/each}
  </div>
</Accordions>

<Button mb="3" color="primary" on:click={onAddSlot}>
  <Icon name="plus" />
  {buttonText}
</Button>

<style>
  :global(.y-el-p-0 .y-accordion-body-inner) {
    padding: 0;
  }
  :global(.y-el-p-0 .y-accordion-header-button) {
    padding: 0;
  }
  :global(.y-accordion-header-button::after) {
    content: unset;
  }
</style>
