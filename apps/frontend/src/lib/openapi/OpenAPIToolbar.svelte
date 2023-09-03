<script lang="ts">
	import cx from 'classnames'
	import { sidebarCollapsed } from '$lib/store/ui'
			<div>
				<Button size="sm" class="gap-2">
					<i class="ti ti-chevron-down"></i>
					<span>
						{$t('download openapi')}
					</span>
				</Button>
				<Dropdown style="z-index: 50;">
					<DropdownItem on:click={() => download()}>{$t('openapi spec')}</DropdownItem>
					<DropdownItem on:click={() => download('postman')}>{$t('postman collections')}</DropdownItem>
				</Dropdown>
			</div>
		</div>
	</div>
</div>
