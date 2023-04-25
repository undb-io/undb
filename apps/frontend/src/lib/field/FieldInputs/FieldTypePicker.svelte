<script lang="ts">
	import { Button, Dropdown, Radio } from 'flowbite-svelte'
	import Portal from 'svelte-portal'
	import FieldIcon from '../FieldIcon.svelte'
	import { FIELD_SELECT_ITEMS } from '../types'
	import type { IFieldType } from '@undb/core'

	export let value: IFieldType | undefined
	export let types = FIELD_SELECT_ITEMS
	let open = false
</script>

<Button id="field_type_picker" color="alternative" class="max-w-max inline-flex gap-2" {...$$restProps}>
	{#if value}
		<div class="flex items-center gap-2">
			<FieldIcon size={16} type={value} />
			<span>{value}</span>
		</div>
	{:else}
		Type...
	{/if}
</Button>
<Portal target="body">
	<Dropdown
		triggeredBy="#field_type_picker"
		bind:open
		inline
		class="max-h-64 w-[400px] overflow-y-auto py-1 shadow-md"
		frameClass="z-[100]"
	>
		{#each types as type}
			{@const selected = type.value === value}
			<Radio
				value={type.value}
				bind:group={value}
				class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
				custom
				on:change={() => (open = false)}
			>
				<li class="w-full flex justify-between items-center text-gray-500">
					<div class="flex flex-1 items-center gap-2">
						<FieldIcon type={type.value} size={16} />
						<span>
							{type.name}
						</span>
					</div>
					{#if selected}
						<i class="ti ti-check text-sm" />
					{/if}
				</li>
			</Radio>
		{/each}
	</Dropdown>
</Portal>
