<script lang="ts">
	import { t } from '$lib/i18n'
	import { getRecord } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import CollaboratorAvatar from '$lib/user/CollaboratorAvatar.svelte'
	import type { IQueryAudit } from '@undb/integrations/dist'
	import { parseISO } from 'date-fns'
	import { format } from 'date-fns/fp'
	import { match } from 'ts-pattern'

	const record = getRecord()

	$: getAudits = trpc().audit.getRecordAudits.query(
		{
			recordId: $record?.id.value ?? '',
		},
		{ enabled: !!$record },
	)

	$: audits = $getAudits.data?.audits ?? []

	const dateFormat = format('yyyy-MM-dd hh:mm:ss')

	const getAuditMessage = (audit: Omit<IQueryAudit, 'target'>) =>
		match(audit)
			.with({ op: 'record.created' }, { op: 'record.updated' }, (audit) =>
				$t(audit.op, {
					username: audit.operator.username,
					timestamp: dateFormat(parseISO(audit.timestamp)),
					ns: 'audit',
				}),
			)
			.otherwise(() => null)

	const getIcon = (audit: Omit<IQueryAudit, 'target'>) =>
		match(audit)
			.with({ op: 'record.created' }, () => 'ti ti-plus')
			.with({ op: 'record.updated' }, () => 'ti ti-pencil')
			.otherwise(() => '')
</script>

<section class="px-2 space-y-4">
	{#each audits as audit}
		{@const message = getAuditMessage(audit)}
		{#if message}
			<div class="flex items-center gap-2 text-gray-500 text-xs w-full">
				<CollaboratorAvatar
					username={audit.operator.username}
					color={audit.operator.color}
					avatar={audit.operator.avatar}
				/>
				<i class={getIcon(audit)}></i>
				<span>
					{message}
				</span>
			</div>
		{/if}
	{/each}
</section>
