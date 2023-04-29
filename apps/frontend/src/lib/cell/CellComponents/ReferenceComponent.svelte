<script lang="ts">
	import { t } from '$lib/i18n'
	import cx from 'classnames'
	export let value: (string | null)[] = []
	$: content = value.filter(Boolean).toString()
</script>

<span class={cx('bg-gray-100 text-xs mr-2 px-2.5 py-0.5 rounded', !content && 'text-gray-400 font-normal')}>
	{content || $t('unamed', { ns: 'common' })}
</span>
