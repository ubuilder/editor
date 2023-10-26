<script lang="ts">
	import { nanoid } from 'nanoid'
	import {
		Dropdown,
		DropdownItem,
		DropdownMenu,
		El,
		FormEditor,
		FormField,
		FormInput,
		Label,
		Button,
		FormSelect,
		FormSwitch,
		Icon,
		FormRadioGroup,
		FormTextarea,
	} from '@ulibs/yesvelte'
	import FilePicker from './FilePicker.svelte'
	import { createEventDispatcher } from 'svelte'

	const id = 'form-field-' + nanoid()

	let reload = 0

  const dispatch = createEventDispatcher()

	function onAdd(key: string) {
    reload += 1

		if (['image', 'file', 'switch', 'select'].includes(type)) {
			value = '{{' + key + '}}'
    }else if (type === 'rich_text') {
      value = '{{{' + key + '}}}'
		} else if (type == 'array') {
			value = key
		} else {
			value = (value??'') + '{{' + key + '}}'
		}

    dispatch('change')
    console.log(value)
	}

	export let items: any = {}
	export let type: string = 'plain_text'
	export let accept: string[] = []

	export let label: string | undefined = undefined
	export let required: boolean = false
	export let value: any

	export let col: any | undefined = undefined

	let itemsMemo = JSON.stringify(items)

	function getItemsArray(items: any, array: any[] = [], key = '') {
		if (JSON.stringify(items) === itemsMemo && itemsArray.length !== 0) return itemsArray ?? []

		let list: any[] = []

		Object.keys(items).map((item) => {
			list.push({
				text: items[item].text,
				key: key ? key + '.' + item : item,
				type: items[item].type,
			})

			if (items[item].type === 'object' && items[item].content) {
				list = getItemsArray(items[item].content, list, (key ? key + '.' : '') + item)
				console.log(list)
			}
		})

		return [...array, ...list]
	}

	let itemsArray: any[] = []
	$: itemsArray = getItemsArray(items)

	$: filteredItems = itemsArray.filter((x) => x.type === type || accept.includes(x.type))
	$: isDynamic = value?.includes?.('{{')
</script>

<FormField colMd={col}>
	<Label d="flex" gap="2" for={id} {required} slot="label">
		<span>{label}</span>
		{#if filteredItems.length > 0}
			<Dropdown autoClose arrow={false} placement="right-start">
				<div slot="target" tabindex="0" class="dynamic-icon" />
				<DropdownMenu>
					{#each filteredItems as item}
						<DropdownItem on:click={() => onAdd(item.key)}>
							{item.text}
						</DropdownItem>
					{/each}
				</DropdownMenu>
			</Dropdown>
		{/if}
	</Label>
  {#key reload}
		{#if type === 'plain_text'}
			{#if $$props.input_type === 'textarea'}
				<FormTextarea rows="5" {...$$restProps} bind:value />
			{:else}
      {#key reload}
				<FormInput {...$$restProps} bind:value />
        {/key}
			{/if}
		{:else if type === 'rich_text'}
			<FormEditor {...$$restProps} bind:value />
		{:else if type === 'select'}
			{#if isDynamic}
				<FormInput disabled value="Dynamic: {value}">
					<Button color="danger" slot="end" on:click={() => (value = '')}>
						<Icon name="minus" />
					</Button>
				</FormInput>
			{:else}
				{@const isObject = typeof $$restProps.options?.[0] === 'object'}
				{#if $$props.input_type === 'radio_group'}
					<!-- Support Checkbox group -->
					<FormRadioGroup
						{...$$restProps}
						items={typeof $$restProps.options === 'string'
							? $$restProps.options.split(',').map((x) => x.trim())
							: $$restProps.options}
						bind:value
						key={isObject ? $$props.key ?? 'key' : undefined}
						let:item>
						{isObject ? item[$$props.text ?? 'text'] : item}
					</FormRadioGroup>
				{:else}
					<FormSelect
						{...$$restProps}
						items={typeof $$restProps.options === 'string'
							? $$restProps.options.split(',').map((x) => x.trim())
							: $$restProps.options}
						bind:value
						key={isObject ? $$props.key ?? 'key' : undefined}
						let:item>
						{isObject ? item[$$props.text ?? 'text'] : item}
					</FormSelect>
				{/if}
			{/if}
		{:else if type === 'image'}
			<FilePicker {...$$restProps} bind:value={value} type="image" />
		{:else if type === 'file'}
			<FilePicker {...$$restProps} bind:value={value} type="file" />
		{:else if type === 'switch'}
			{#if isDynamic}
				<FormInput disabled value="Dynamic: {value}">
					<Button color="danger" slot="end" on:click={() => (value = '')}>
						<Icon name="minus" />
					</Button>
				</FormInput>
			{:else}
				<FormSwitch {...$$restProps} bind:checked={value} />
			{/if}
		{/if}
    {/key}
	<slot />
</FormField>

<style>
	.dynamic-icon {
		z-index: 10;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--y-primary);
		border-radius: 50%;
		width: 16px;
		height: 16px;
		margin-top: 2px;
	}

	.dynamic-icon::before {
		content: '+';
		color: white;
		margin-bottom: -1px;
	}
	.dynamic-icon:hover {
		/* top: 17px; */
		background: #1da1f2;
		/* left: -12px;
      width: 25px;
      height: 25px; */
	}
	.dynamic-icon:hover::before {
		font-size: 20px;
		/* margin-bottom: 5px; */
	}
</style>
