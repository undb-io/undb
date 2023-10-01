<script lang="ts">
	import { cn } from '$lib/utils'
	import { colors } from '$lib/field/helpers'
	import type { IQueryMember, IRolesWithoutOwner } from '@undb/authz'
	import { hasPermission } from '$lib/store/authz'
	import { trpc } from '$lib/trpc/client'
	import { t } from '$lib/i18n'
	import * as Card from '$lib/components/ui/card'
	import { Badge } from '$lib/components/ui/badge'
	import * as Avatar from '$lib/components/ui/avatar'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { Button } from '$lib/components/ui/button'
	import { toast } from 'svelte-sonner'

	export let member: IQueryMember

	const canUpdateRole = $hasPermission('member:update_role')

	const items = [
		{ value: 'admin', name: $t('admin', { ns: 'authz' }) },
		{ value: 'editor', name: $t('editor', { ns: 'authz' }) },
		{ value: 'viewer', name: $t('viewer', { ns: 'authz' }) },
	] as const

	const updateRoleMutation = trpc().authz.member.updateRole.mutation({
		onSuccess(data, variables, context) {
			toast.success(
				$t('MEMBER.ROLE_UPDATED', {
					ns: 'success',
					username: member.userProfile.username,
					role: $t(variables.role, { ns: 'authz' }),
				}),
			)
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})
	const updateRole = (value: IRolesWithoutOwner) => {
		$updateRoleMutation.mutate({
			memberId: member.id,
			role: value,
		})
	}
</script>

<Card.Root>
	<Card.Header>
		<div class="flex items-center">
			<div class="flex min-w-0 flex-1 items-center">
				<div class="flex-shrink-0">
					<Avatar.Root>
						<Avatar.Image src={member?.userProfile.avatar} alt={member?.userProfile.username} />
						<Avatar.Fallback class={cn('text-white', colors[member.userProfile.color])}>
							{member?.userProfile.username.slice(0, 2)}
						</Avatar.Fallback>
					</Avatar.Root>
				</div>
				<div class="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
					<div>
						<p class="truncate text-sm font-medium text-primary dark:text-white">
							{member.userProfile.username}
						</p>
						<p class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-200">
							<svg
								class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-200"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
								<path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
							</svg>
							<span class="truncate">{member.userProfile.email}</span>
						</p>
					</div>
					<div class="hidden">
						<div>
							<p class="text-sm text-gray-900">
								Applied on
								<time datetime="2020-01-07">January 7, 2020</time>
							</p>
							<p class="mt-2 flex items-center text-sm text-gray-500">
								<svg
									class="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
										clip-rule="evenodd"
									/>
								</svg>
								Completed phone screening
							</p>
						</div>
					</div>
				</div>
			</div>
			<div>
				{#if canUpdateRole && member.role !== 'owner'}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button variant="outline" builders={[builder]} class="gap-2">
								<span>
									{$t(member.role, { ns: 'authz' })}
								</span>
								<i class="ti ti-chevron-down"></i>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-56">
							<DropdownMenu.RadioGroup bind:value={member.role}>
								{#each items as item}
									<DropdownMenu.RadioItem
										value={item.value}
										on:click={() => {
											updateRole(item.value)
										}}
									>
										{item.name}
									</DropdownMenu.RadioItem>
								{/each}
							</DropdownMenu.RadioGroup>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{:else}
					<Badge color="blue" class="border border-primary">
						{$t(member.role, { ns: 'authz' })}
					</Badge>
				{/if}
			</div>
			<div class="hidden">
				<svg
					class="h-5 w-5 text-gray-400 dark:text-gray-200"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
		</div>
	</Card.Header>
</Card.Root>
