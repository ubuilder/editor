import type { ContentField } from './field'

export type Table = {
	id: string
	name: string
	slug: string
	icon?: string
	fields: ContentField[]
}

export type TableCreateRequest = {
	name: string
	icon?: string
	fields: ContentField[]
}
