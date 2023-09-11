<script lang="ts">
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import { createRecordModal } from '$lib/store/modal'
	import { Button } from '$components/ui/button'
	import { createRecordFormId, getTable } from '$lib/store/table'
	import { cn } from '$lib/utils'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'

	const table = getTable()

	$: forms = $table.forms.forms
	$: formCount = forms.length
	$: hasForm = formCount > 0
</script>

{#if $hasPermission('record:create')}
	<div class="flex items-center">
		<Button
			on:click={() => createRecordModal.open()}
			size="sm"
			class={cn('inline-flex items-center whitespace-nowrap', hasForm && 'rounded-r-none')}
		>
			<i class="ti ti-row-insert-bottom text-sm lg:mr-2" />
			<span class="hidden lg:block">
				{$t('Create New Record')}
			</span>
		</Button>
		{#if hasForm}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button size="sm" class="rounded-l-none items-center justify-center" builders={[builder]}>
						<i class="ti ti-chevron-down font-semibold text-[14px]"></i>
					</Button>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content class="z-[9999999999] w-56">
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger class="font-semibold text-xs gap-2">
							<i class="ti ti-row-insert-bottom text-sm" />
							<span>
								{$t('create record by form', { form: '' })}
							</span>
						</DropdownMenu.SubTrigger>
						<DropdownMenu.SubContent class="w-56">
							{#each forms as form}
								<DropdownMenu.Item
									class="font-semibold text-xs gap-2"
									on:click={() => {
										$createRecordFormId = form.id.value
										createRecordModal.open()
									}}
								>
									<i class="ti ti-row-insert-bottom text-sm" />
									<span>
										{$t('create record by form', { form: ` ${form.name.value} ` })}
									</span>
								</DropdownMenu.Item>
							{/each}
						</DropdownMenu.SubContent>
					</DropdownMenu.Sub>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
	</div>
{/if}
