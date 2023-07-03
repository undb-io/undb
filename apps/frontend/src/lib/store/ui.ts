import { writable, type Writable } from 'svelte/store'
import { LIGHT_THEME, DARK_THEME, type Theme } from './ui.type'

export const sidebarCollapsed = writable(false)

export const theme: Writable<Theme> = writable(LIGHT_THEME)

export const changeThemeMode = (mode: Theme) => {
	if (mode === LIGHT_THEME) {
		document.documentElement.classList.remove(DARK_THEME)
	} else {
		document.documentElement.classList.add(DARK_THEME)
	}
}
