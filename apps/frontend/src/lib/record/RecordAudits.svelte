<script lang="ts">
	import { t } from '$lib/i18n'
	import { getRecord } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import CollaboratorAvatar from '$lib/user/CollaboratorAvatar.svelte'
	import type { IQueryAudit } from '@undb/integrations'
	import { match } from 'ts-pattern'
	import RecordAuditDetail from './audit/RecordAuditDetail.svelte'
	import { EVT_RECORD_CREATED, EVT_RECORD_DELETED, EVT_RECORD_RESTORED, EVT_RECORD_UPDATED } from '@undb/core'
	import { formatDistance } from '$lib/date'
	import { format } from 'date-fns'

	const record = getRecord()

	$: getAudits = trpc().record.audit.list.query(
		{
			recordId: $record?.id.value ?? '',
		},
		{ enabled: !!$record },
	)

	$: audits = $getAudits.data?.audits ?? []

	const getAuditMessage = (audit: Omit<IQueryAudit, 'target'>) =>
		match(audit)
			.with(
				{ op: EVT_RECORD_CREATED },
				{ op: EVT_RECORD_UPDATED },
				{ op: EVT_RECORD_DELETED },
				{ op: EVT_RECORD_RESTORED },
				(audit) =>
					$t(audit.op, {
						username: audit.operator.username,
						ns: 'audit',
					}),
			)
			.otherwise(() => null)

	const getIcon = (audit: Omit<IQueryAudit, 'target'>) =>
		match(audit)
			.with({ op: EVT_RECORD_CREATED }, () => 'ti ti-plus')
			.with({ op: EVT_RECORD_UPDATED }, () => 'ti ti-pencil')
			.with({ op: EVT_RECORD_DELETED }, () => 'ti ti-trash')
			.with({ op: EVT_RECORD_RESTORED }, () => 'ti ti-history')
			.otherwise(() => '')
</script>

<section class="px-2 space-y-2">
	{#each audits as audit}
		{@const message = getAuditMessage(audit)}
		{#if message}
			<div class="justify-between flex items-center">
				<div class="flex items-center gap-2 text-gray-500 dark:text-white text-xs w-full">
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

				<span
					class="text-xs text-gray-500 dark:text-white whitespace-nowrap"
					title={format(new Date(audit.timestamp), 'yyyy-MM-dd HH:mm:ss')}
				>
					{$formatDistance(new Date(audit.timestamp))}
				</span>
			</div>

			{#if audit.op === 'record.updated' && audit.detail}
				<RecordAuditDetail detail={audit.detail} />
			{/if}
		{/if}
	{/each}
</section>
