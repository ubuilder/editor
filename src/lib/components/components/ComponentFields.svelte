<script lang="ts">
  import type { Field } from "$lib/types";
  import {
    FormCheckbox,
    FormField,
    El,
    Icon,
    Card,
    Accordion,
    AccordionHeader,
    Button,
    FormRadioGroup,
    FormSwitch,
    AccordionBody,
    Badge,
    FormInput,
    FormAutocomplete,
    Accordions,
    FormSlider,
    FormSelect,
    FormCheckboxGroup,
    CardHeader,
    CardBody,
  } from "@ulibs/yesvelte";
  import DynamicFormField from "../content/DynamicFormField.svelte";
	import { t } from "$lib/i18n"

  export let components: any[] = [];
  export let fields: any[] = [];

  const icons: any = {
    plain_text: "abc",
    rich_text: "float-left",
    // date_time: "calendar",
    switch: "toggle-right",
    number: "123",
    file: "file-text",
    image: "photo",
    slot: "box",
    // relation: "database-share",
    select: "list",
  };

  const selectItems = [
    { key: "plain_text", text: "Plain Text" },
    { key: "rich_text", text: "Rich Text" },
    { key: "number", text: "Number" },
    // { key: "date_time", text: "DateTime" },
    { key: "image", text: "Image" },
    { key: "file", text: "File" },
    { key: "switch", text: "Switch" },
    { key: "select", text: "Select" },
    { key: "slot", text: "Slot" },

    // { key: "relation", text: "Relation" },
  ];

  function removeField(field: Field) {
    fields = fields.filter((x) => x !== field);
  }

  function addField() {
    if (new_name === "" || new_type === "") return;

    const newField: any = {
      name: new_name,
      type: new_type,
    };

    if (newField.type === "plain_text") {
      newField.input_type ??= "input";
    }

    fields = [...fields, newField];
    new_name = "";
    new_type = "";
  }

  let new_name = "";
  let new_type = "";
</script>

<FormField label="Fields">
  <Accordions>
    {#each fields as field}
      <Accordion class="page-slot" mb="2">
        <AccordionHeader border>
          <El d="flex" alignItems="center" gap="2">
            <Icon name={icons[field.type]} />
            <El tag="span" mx="2">
              {field.name}
            </El>
            {#if field.required}
              <Badge
                on:click!stopPropagation={() =>
                  (field.required = !field.required)}
                color="danger"
              >
                Required
              </Badge>
            {:else}
              <Badge
                on:click!stopPropagation={() =>
                  (field.required = !field.required)}
                color="info">Optional</Badge
              >
            {/if}
            {#if ["select", "image", "relation"].includes(field.type)}
              {#if field.mode === "single"}
                <Badge
                  on:click!stopPropagation={() => (field.mode = "multiple")}
                  color="info"
                >
                  Single
                </Badge>
              {:else}
                <Badge
                  on:click!stopPropagation={() => (field.mode = "single")}
                  color="info"
                >
                  Multiple
                </Badge>
              {/if}
            {/if}
          </El>
        </AccordionHeader>
        <AccordionBody class="no-padding">
          <Card>
            <CardBody>
              <El row>
                <FormInput
                  col="12"
                  colSm="6"
                  label="Name"
                  bind:value={field.name}
                />
                <FormAutocomplete
                  col="12"
                  colSm="6"
                  label="type"
                  key="key"
                  items={selectItems}
                  bind:value={field.type}
                  let:item
                >
                  <El>
                    <Icon me="2" name={icons[item.key]} />
                    {item.text}
                  </El>
                </FormAutocomplete>
                <!-- <FormInput
                          col="12"
                          label="Hint"
                          bind:value={field.hint}
                        /> -->

                <FormInput
                  col="12"
                  placeholder="Placeholder of input (same as this) ...."
                  label="Placeholder"
                  bind:value={field.placeholder}
                />
                {#if field.type === "select"}
                  <FormInput
                    placeholder="comma separated value..."
                    bind:value={field.options}
                    label="Options"
                  />
                  <FormRadioGroup
                    inline
                    items={["single", "multiple"]}
                    label="Mode"
                    bind:value={field.mode}
                  />
                {:else if field.type === "slot"}
                  {@const a = (field.buttonText ??= "Add Slot")}
                  <FormInput
                    label="Text of add Button"
                    bind:value={field.buttonText}
                  />

                  <FormSelect label="Child Component type" items={[{id: undefined, name: 'All'}, ...components]} key="id" bind:value={field.componentId} let:item>
                    {item.name}
                  </FormSelect>
                  
                  {#if !field.componentId}
                  <FormCheckboxGroup
                    items={components}
                    col="6"
                    key="id"
                    label="Allowed Components"
                    bind:value={field.allowedComponents}
                    let:item
                  >
                    {item.name}
                  </FormCheckboxGroup>
                  <FormCheckboxGroup
                    items={components}
                    col="6"
                    key="id"
                    label="Disabled Components"
                    bind:value={field.disabledComponents}
                    let:item
                  >
                    {item.name}
                  </FormCheckboxGroup>
                  {/if}
                {/if}

                {#if field.type !== 'slot'}
                <DynamicFormField
                  label="Default Value"
                  type={field.type}
                  bind:value={field.default_value}
                />
                {/if}
                <El col="12" d="flex" justifyContent="end">
                  <Button
                    ms="auto"
                    color="danger"
                    on:click={() => removeField(field)}
                  >
                    {t("buttons.remove")}
                  </Button>
                </El>
              </El>
            </CardBody>
          </Card>
        </AccordionBody>
      </Accordion>
    {/each}
  </Accordions>

  <El tag="form" on:submit!preventDefault={addField} row mt="4">
    <FormInput
      col="12"
      colSm
      bind:value={new_name}
      placeholder="Name of new field..."
    />
    <FormAutocomplete
      col="12"
      colSm
      placeholder="Type of new field..."
      key="key"
      items={selectItems}
      bind:value={new_type}
      let:item
    >
      <El>
        <Icon me="2" name={icons[item.key]} />
        {item.text}
      </El>
    </FormAutocomplete>

    <El col="auto">
      <Button
        color="primary"
        disabled={new_name === "" || new_type === ""}
        type="submit">Add Field</Button
      >
    </El>
  </El>
</FormField>

<style>
  :global(.no-padding .y-accordion-body-inner) {
    padding: 0;
  }
</style>
