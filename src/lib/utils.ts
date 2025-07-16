export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat('ru-RU', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}).format(date);
}

export function debounce<T extends (...args: any[]) => void>(
	func: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
}

export function highlightText(text: string, query: string, caseSensitive: boolean = false): string {
	if (!query.trim()) return text;

	const searchText = caseSensitive ? text : text.toLowerCase();
	const searchQuery = caseSensitive ? query : query.toLowerCase();

	if (!searchText.includes(searchQuery)) return text;

	const regex = new RegExp(`(${escapeRegExp(query)})`, caseSensitive ? 'g' : 'gi');
	return text.replace(regex, '<mark>$1</mark>');
}

function escapeRegExp(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\');
}
