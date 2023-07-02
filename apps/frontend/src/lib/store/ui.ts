import { writable, type Writable } from 'svelte/store'

export const sidebarCollapsed = writable(false)

export const changeDarkMode = (mode: string) => {
	document.documentElement.classList.toggle(mode)
}

export const theme: Writable<'light' | 'dark'> = writable('dark')
