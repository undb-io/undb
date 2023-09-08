<script lang="ts">
	import FieldIcon from '../FieldIcon.svelte'
	import { FIELD_SELECT_ITEMS } from '../types'
	import type { IFieldType } from '@undb/core'
	import { t } from '$lib/i18n'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$components/ui/button'

	export let value: IFieldType | undefined
	export let types = FIELD_SELECT_ITEMS
	export let filter: (type: IFieldType) => boolean = () => true
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="outline" builders={[builder]} type="button" {...$$restProps}>
			{#if value}
				<span class="inline-flex gap-2 items-center text-sm truncate">
					<FieldIcon type={value} />
					<span>
						{$t(value)}
					</span>
				</span>
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="md:w-64 max-h-72 overflow-y-auto">
		<DropdownMenu.RadioGroup bind:value>
			{#each types.filter((type) => filter(type.value)) as type}
				<DropdownMenu.RadioItem value={type.value} class="gap-2">
					<FieldIcon type={type.value} size={16} />
					<span>
						{$t(type.value)}
					</span>
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
