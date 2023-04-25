<script lang="ts">
	import type { SelectField } from '@undb/core'
	import { Button, Dropdown, DropdownItem, Radio } from 'flowbite-svelte'
	import Option from './Option.svelte'

	export let field: SelectField

	export let group: string | undefined

	$: option = group ? field.options.getById(group).into() : null
	$: options = field.options.options

	$: open = false
</script>

<Button color="alternative">
	{#if option}
		<Option {option} />
	{:else}
		<span>Select Option</span>
	{/if}
</Button>
<Dropdown bind:open placement="bottom-start">
	{#each options as option}
		<Radio
			class="cursor-pointer px-3 py-2 hover:bg-gray-100 transition"
			bind:group
			value={option.key.value}
			{...$$restProps}
			custom
			on:change={() => (open = false)}
		>
			<Option {option} />
		</Radio>
	{/each}
</Dropdown>
