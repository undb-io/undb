<script lang="ts">
	import { cn } from '$lib/utils'
	import type { SelectField } from '@undb/core'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$lib/components/ui/button'
	import Option from './Option.svelte'
	import { t } from '$lib/i18n'

	export let field: SelectField | undefined
	export let readonly = false

	export let group: string | undefined

	$: option = group ? field?.options.getById(group).into() : null
	$: options = field?.options?.options ?? []
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button
			type="button"
			class={cn('h-full', $$restProps.class)}
			variant="outline"
			disabled={readonly}
			builders={[builder]}
		>
			{#if option}
				<Option {option} />
			{:else}
				<span class="inline-flex items-center gap-2">
					<i class="ti ti-list" />
					<span>{$t('Select Option')}</span>
				</span>
			{/if}
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.RadioGroup bind:value={group}>
			{#each options as option}
				<DropdownMenu.RadioItem class="cursor-pointer flex " value={option.key.value} {...$$restProps}>
					<span role="button" class="inline-flex w-full transition">
						<Option {option} />
					</span>
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
