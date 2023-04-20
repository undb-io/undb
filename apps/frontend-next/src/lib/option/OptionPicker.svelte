<script lang="ts">
	import type { SelectField } from '@undb/core'
	import { Button, Dropdown, DropdownItem, Radio } from 'flowbite-svelte'
	import Option from './Option.svelte'

	export let value: string | undefined
	export let field: SelectField

	let group: string | undefined

	$: option = group ? field.options.getById(group).into() : null
	$: options = field.options.options

	$: value = group

	$: open = false
</script>

<Button color="alternative">
	{#if option}
		<Option {option} />
	{:else}
		<span>Select Option</span>
	{/if}
</Button>
<Dropdown bind:open>
	{#each options as option}
		<DropdownItem>
			<Radio
				class="cursor-pointer"
				bind:group
				value={option.key.value}
				{...$$restProps}
				custom
				on:change={() => (open = false)}
			>
				<Option {option} />
			</Radio>
		</DropdownItem>
	{/each}
</Dropdown>
