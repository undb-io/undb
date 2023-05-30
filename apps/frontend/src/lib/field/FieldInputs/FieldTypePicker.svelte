<script lang="ts">
	import cx from 'classnames'
	import { Button, Dropdown, Radio } from 'flowbite-svelte'
	import Portal from 'svelte-portal'
	import FieldIcon from '../FieldIcon.svelte'
	import { FIELD_SELECT_ITEMS } from '../types'
	import type { IFieldType } from '@undb/core'
	import { t } from '$lib/i18n'

	export let value: IFieldType | undefined
	export let types = FIELD_SELECT_ITEMS
	export let filter: (type: IFieldType) => boolean = () => true
	let open = false
</script>

<Button id="field_type_picker" color="alternative" class="max-w-max inline-flex gap-2" {...$$restProps}>
	{#if value}
		<div class="flex items-center gap-2">
			<FieldIcon size={16} type={value} />
			<span>{$t(value)}</span>
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
		class="w-[400px] overflow-y-auto py-1 shadow-md max-h-[200px]"
		frameClass="z-[100]"
	>
		{#each types.filter((type) => filter(type.value)) as type}
			{@const selected = type.value === value}
			<Radio
				value={type.value}
				bind:group={value}
				class={cx('px-3 py-2 hover:bg-gray-100 cursor-pointer', selected && 'bg-gray-100')}
				custom
				on:change={() => (open = false)}
			>
				<li class="w-full flex justify-between items-center text-gray-700">
					<div class="flex flex-1 items-center gap-2">
						<FieldIcon type={type.value} size={16} />
						<span>
							{$t(type.value)}
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
