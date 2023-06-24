import { writable } from 'svelte/store'

export const sidebarCollapsed = writable(false)

export const changeDarkMode = (mode: string) => {
	document.documentElement.classList.toggle(mode)
}
