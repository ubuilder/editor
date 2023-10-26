<script lang="ts">
  import {
    El,
    FormDatePicker,
    FormEditor,
    FormField,
    FormInput,
    FormSelect,
    FormSwitch,
    FormTextarea,
    Popover,
    PopoverBody,
  } from "@ulibs/yesvelte";
  import FilePicker from "./FilePicker.svelte";
  import FormDataSelect from "./FormDataSelect.svelte";
  import type { Field } from "$lib/types";

  export let field: Field;
  export let data: any = {}; 
  export let errorMessage: string | undefined = undefined

  export let label: string = field.name;
  export let items: any[] = [];

  $: fieldProps = {
    required: field.required,
    label,
  };

  $: validationProps = {
    state: errorMessage ? 'invalid' : undefined,
    hint: errorMessage
  }

  $: props = {
    required: field.required,
    placeholder: field.placeholder,
  };
</script>

<FormField position="relative" {...fieldProps}>
  
  <El row>
    {#if field.type === "plain_text"}
      {#if field.input_type === "textarea"}
        <FormTextarea {...validationProps} name={field.name} rows="10" {...props} bind:value={data[field.name]} />
      {:else}
        <FormInput
          {...props}
          {...validationProps}
          name={field.name}
          minlength={field.minlength}
          maxlength={field.maxlength}
          bind:value={data[field.name]}
        />
      {/if}
    {:else if field.type === "rich_text"}
      <FormEditor {...validationProps} name={field.name} {...props} bind:value={data[field.name]} />
    {:else if field.type === "number"}
      <FormInput
        {...validationProps}
        {...props}
        name={field.name}
        type="number"
        min={field.min}
        max={field.max}
        bind:value={data[field.name]}
      />
    {:else if field.type === "date_time"}
      <FormDatePicker
        {...validationProps}
        name={field.name}
        {...props}
        range={field.range}
        bind:value={data[field.name]}
      />
    {:else if field.type === "select"}
      <FormSelect
        {...validationProps}
        name={field.name}
        items={(field.options ?? "").split(",").map((x) => x.trim())}
        {...props}
        let:item
        bind:value={data[field.name]}
      >
        {item}
      </FormSelect>
      <!-- <FormFileUpload {...props} label="use Asset picker (check multiple)" bind:value={data[field.name]}/> -->
    {:else if field.type === "file"}
      <FilePicker {...validationProps} name={field.name} {...props} bind:value={data[field.name]} />
    {:else if field.type === "image"}
      <FilePicker {...validationProps} name={field.name} type="image" {...props} bind:value={data[field.name]} />

      <!-- <FormFileUpload {...props} label="use Asset picker (check multiple)" bind:value={data[field.name]}/> -->
    {:else if field.type === "switch"}
      <FormSwitch {...validationProps} name={field.name} {...props} bind:checked={data[field.name]} />
    {:else if field.type === "relation"}
      <FormDataSelect
        {...validationProps}
        name={field.name}
        multiple={field.multiple}
        table={field.table}
        title={field.title}
        bind:value={data[field.name]}
      />
    {/if}
  </El>
</FormField>

