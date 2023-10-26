import fa from './fa'
import en from './en'
import ps from './ps'

const translations: any = {
	en,
	fa,
	ps
}

let lang = 'en'

export function setLang(lng: string) {
	if (lng) {
		lang = lng
	}
}

export const t = (key: string) => {
	const keys = key.split('.')
	const result = keys.reduce((prev, curr) => {
		if (!prev || !prev[curr]) return key
		return prev[curr]
	}, translations[lang])

	return result
}
