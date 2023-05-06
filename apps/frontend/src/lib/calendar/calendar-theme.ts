export const theme = (theme: Record<string, string>) => {
	return {
		...theme,
		today: theme.today + ' !bg-amber-50',
		event: theme.event + ' !bg-sky-500 hover:!bg-sky-600 transition',
	}
}
