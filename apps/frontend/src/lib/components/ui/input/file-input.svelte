<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
	import { cn } from '$lib/utils'
	import type { InputEvents } from '.'

	type $$Props = HTMLInputAttributes
	type $$Events = InputEvents

	let className: $$Props['class'] = undefined
	export let files: FileList | undefined | null = undefined
	export { className as class }
</script>

<input
	class={cn(
		'fflex h-9 w-full rounded-md border border-input bg-white dark:bg-gray-900 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium dark:file:text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:text-white',
		className,
	)}
	bind:files
	on:blur
	on:change
	on:click
	on:focus
	on:keydown
	on:keypress
	on:keyup
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:paste
	on:input
	{...$$restProps}
	type="file"
/>
