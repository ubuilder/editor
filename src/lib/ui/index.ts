// import ViewButton from './components/Button/ViewButton.svelte'
// import ViewContainer from './components/Container/ViewContainer.svelte'
// import EditButton from './components/Button/EditButton.svelte'
// import EditContainer from './components/Container/EditContainer.svelte'
// import HtmlText from './components/HtmlText/ViewHtmlText.svelte'

import type { ComponentField, Field } from '$lib/types'

// import EditList from "./components/List/EditList.svelte"
// import ViewList from "./components/List/ViewList.svelte"
// import ViewImage from "./components/Image/ViewImage.svelte"
// import EditImage from "./components/Image/EditImage.svelte"

// import EditMenu from "./components/Menu/EditMenu.svelte"
// import ViewMenu from "./components/Menu/ViewMenu.svelte"

// import EditFooter from "./components/Footer/EditFooter.svelte"
// import ViewFooter from "./components/Footer/ViewFooter.svelte"
// import ViewHeader from "./components/Header/ViewHeader.svelte"
// import EditCard from "./components/Card/EditCard.svelte"
// import ViewCard from "./components/Card/ViewCard.svelte"

// import EditInput from './components/Input/EditInput.svelte'
// import ViewInput from './components/Input/ViewInput.svelte'
// import EditForm from './components/Form/EditForm.svelte'
// import ViewForm from './components/Form/ViewForm.svelte'
// import EditHeader from './components/Header/EditHeader.svelte'
// import ViewLink from './components/Link/ViewLink.svelte'
// import EditLink from './components/Link/EditLink.svelte'

// export const components = {
//     Button: {
//         text: 'Button',
//         edit: EditButton,
//         view: ViewButton
//     },
//     Container: {
//         text: 'Container',
//         edit: EditContainer,
//         view: ViewContainer
//     },
//     HtmlText: {
//         text: 'HtmlText',
//         edit: HtmlText,
//         view: HtmlText
//     },
//     Input: {
//         text: 'Input',
//         edit: EditInput,
//         view: ViewInput
//     },
//     Form: {
//         text: 'Form',
//         edit: EditForm,
//         view: ViewForm
//     },
//     // Row: {
//     //     text: 'Row',
//     //     edit: EditRow,
//     //     view: ViewRow
//     // },
//     List: {
//         text: 'List',
//         edit: EditList,
//         view: ViewList
//     },
//     Image: {
//         text: 'Image',
//         edit: EditImage,
//         view: ViewImage
//     },
//     Header: {
//         text: 'Header',
//         edit: EditHeader,
//         view: ViewHeader
//     },
//     Menu: {
//         text: 'Menu',
//         edit: EditMenu,
//         view: ViewMenu
//     },
//     Footer: {
//         text: 'Footer',
//         edit: EditFooter,
//         view: ViewFooter
//     },
//     Card: {
//         text: 'Card',
//         edit: EditCard,
//         view: ViewCard
//     },
//     Link: {
//         text: 'Link',
//         edit: EditLink,
//         view: ViewLink
//     }
//     // FormSelect
// }

// export {default as Element} from './Element.svelte'

export type Prop = {
	type: 'plain_text' | 'slot' | 'image' | 'file'
}

export type Component = {
	name: string
	template: string
	css?: string
	fields?: ComponentField[] | Record<string, ComponentField[]>
}

export const components: Component[] = [
	{
		name: 'Card',
		template: `<div class="y-card">{{#if Title}} <div class="y-card-header"><div class="y-card-title">{{ Title }}</div></div>{{/if}} <div class="y-card-body">{{{ Slot }}}</div></div>`,
		fields: [
			{
				name: 'Title',
				type: 'plain_text',
			},
			{
				name: 'Slot',
				type: 'slot',
				disabledComponents: ['Card'],
			},
		],
	},
	{
		name: 'Button',
		template: `<button type="{{ Type }}" class="y-button y-button-color-{{ Color }}">{{ Text }}</button>`,
		fields: {
			General: [
				{
					name: 'Text',
					type: 'plain_text',
				},
			],
			Style: [
				{
					name: 'Color',
					type: 'select',
					options: ['red', 'green', 'blue'],
					col: '6',
				},
				{
					name: 'Size',
					type: 'select',
					options: ['sm', 'md', 'lg'],
					col: '6',
				},
			],
			Advanced: [
				{
					name: 'Type',
					type: 'select',
					options: ['submit', 'button', 'reset'],
					default_value: 'button',
				},
			],
		},
		// fields: {
		//     type: 'Tab',
		//     slot: [
		//         {
		//             type: 'Input',
		//             colMd: '3',
		//             name: 'Color'
		//         }
		//     ]

		// }
	},
]
