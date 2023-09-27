<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$lib/components/ui/button'
	import { t } from '$lib/i18n'
	import { cn } from '$lib/utils'
	import { trpc } from '$lib/trpc/client'

	export let value: string | undefined

	export let enabled: boolean

	const getBases = trpc().base.list.query({}, { enabled })

	$: bases = $getBases.data?.bases ?? []
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button class={cn('gap-2', $$restProps.class)} variant="outline" builders={[builder]}>
			<i class="ti ti-database"></i>
			<span>
				{$t('Select Base', { ns: 'base' })}
			</span>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.RadioGroup bind:value>
			{#each bases as base}
				<DropdownMenu.RadioItem value={base.id} class="flex items-center gap-2">
					<i class="ti ti-database"></i>
					<span>
						{base.name}
					</span>
				</DropdownMenu.RadioItem>
			{/each}
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
