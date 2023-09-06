<script lang="ts">
	import { operaotrsMap, type Field } from '@undb/core'
	import { t } from '$lib/i18n'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$components/ui/button'

	export let value: string = ''
	export let field: Field | undefined
	export let readonly = false

	$: data = field?.type ? operaotrsMap[field.type] : []
	$: if (!!field && !data.some((v) => v === value)) {
		value = data[0] ?? ''
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button
			variant="outline"
			builders={[builder]}
			disabled={readonly}
			class={$$restProps.class}
			type="button"
			size="sm"
		>
			{#if value}
				{$t(value, { ns: 'common' })}
			{:else}
				<span class="text-sm font-normal text-gray-400">
					{$t('select filter operator')}
				</span>
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.RadioGroup bind:value>
			{#each data as item}
				<DropdownMenu.RadioItem value={item}>
					{$t(item, { ns: 'common' })}
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
