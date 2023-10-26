import type { DbFilter } from '$lib/types'
import type { AssetType } from '$lib/types/asset'

export async function getAssets({
	filters,
	api,
}: {
	filters: DbFilter
	api: any
}): Promise<AssetType[]> {
	return api.getAssets({ where: filters }).then((res: any) => res.data)
}
