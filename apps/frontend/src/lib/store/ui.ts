import { writable, type Writable } from 'svelte/store'
import { LIGHT_THEME, DARK_THEME, type Theme } from './ui.type'
import { browser } from '$app/environment'

const defaultValue: Theme = LIGHT_THEME

const initialValue: Theme = browser ? (window.localStorage.getItem('theme') as Theme) ?? defaultValue : defaultValue

export const sidebarCollapsed = writable(false)

export const theme: Writable<Theme> = writable(initialValue)

export const changeThemeMode = (mode: Theme) => {
	if (mode === LIGHT_THEME) {
		document.documentElement.classList.remove(DARK_THEME)
		theme.set(LIGHT_THEME)
	} else {
		document.documentElement.classList.add(DARK_THEME)
		theme.set(DARK_THEME)
	}
	window.localStorage.setItem('theme', mode)
}
