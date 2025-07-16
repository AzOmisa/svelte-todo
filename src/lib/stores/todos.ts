import { writable, derived } from 'svelte/store';
import type { Todo, FilterType, SearchOptions } from '../types';
import { todoDb } from './db';

// Основные stores
export const todos = writable<Todo[]>([]);
export const filter = writable<FilterType>('all');
export const searchQuery = writable<string>('');
export const searchOptions = writable<SearchOptions>({
	query: '',
	caseSensitive: false,
	exactMatch: false
});

// Функция для поиска
function searchTodos(todos: Todo[], searchQuery: string, options: SearchOptions): Todo[] {
	if (!searchQuery.trim()) return todos;

	const query = options.caseSensitive ? searchQuery : searchQuery.toLowerCase();

	return todos.filter((todo) => {
		const text = options.caseSensitive ? todo.text : todo.text.toLowerCase();

		if (options.exactMatch) {
			return text === query;
		} else {
			return text.includes(query);
		}
	});
}

// Derived store для фильтрованных и найденных todos
export const filteredTodos = derived(
	[todos, filter, searchQuery, searchOptions],
	([todos, filter, searchQuery, searchOptions]) => {
		// Сначала применяем поиск
		let result = searchTodos(todos, searchQuery, { ...searchOptions, query: searchQuery });

		// Затем применяем фильтр
		switch (filter) {
			case 'active':
				return result.filter((todo) => !todo.completed);
			case 'completed':
				return result.filter((todo) => todo.completed);
			default:
				return result;
		}
	}
);

// Derived store для статистики
export const todoStats = derived(todos, (todos) => ({
	total: todos.length,
	active: todos.filter((todo) => !todo.completed).length,
	completed: todos.filter((todo) => todo.completed).length
}));

// Инициализация базы данных
let dbInitialized = false;
async function initDB() {
	if (!dbInitialized) {
		await todoDb.init();
		dbInitialized = true;
	}
}

// Функции для работы с todos
export const todoActions = {
	async loadTodos() {
		await initDB();
		const loadedTodos = await todoDb.getAllTodos();
		todos.set(loadedTodos);
	},

	async add(text: string) {
		await initDB();
		const newTodo: Todo = {
			id: crypto.randomUUID(),
			text: text.trim(),
			completed: false,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		await todoDb.saveTodo(newTodo);
		todos.update((todos) => [...todos, newTodo]);
	},

	async toggle(id: string) {
		await initDB();
		todos.update((todos) => {
			const updatedTodos = todos.map((todo) =>
				todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date() } : todo
			);

			const updatedTodo = updatedTodos.find((todo) => todo.id === id);
			if (updatedTodo) {
				todoDb.saveTodo(updatedTodo);
			}

			return updatedTodos;
		});
	},

	async remove(id: string) {
		await initDB();
		await todoDb.deleteTodo(id);
		todos.update((todos) => todos.filter((todo) => todo.id !== id));
	},

	async update(id: string, text: string) {
		await initDB();
		todos.update((todos) => {
			const updatedTodos = todos.map((todo) =>
				todo.id === id ? { ...todo, text: text.trim(), updatedAt: new Date() } : todo
			);

			const updatedTodo = updatedTodos.find((todo) => todo.id === id);
			if (updatedTodo) {
				todoDb.saveTodo(updatedTodo);
			}

			return updatedTodos;
		});
	},

	async clearCompleted() {
		await initDB();
		await todoDb.clearCompleted();
		todos.update((todos) => todos.filter((todo) => !todo.completed));
	},

	async clearAll() {
		await initDB();
		await todoDb.clearAll();
		todos.set([]);
	},

	async toggleAll() {
		await initDB();
		todos.update((todos) => {
			const allCompleted = todos.every((todo) => todo.completed);
			const updatedTodos = todos.map((todo) => ({
				...todo,
				completed: !allCompleted,
				updatedAt: new Date()
			}));

			// Сохраняем все обновленные todos
			updatedTodos.forEach((todo) => todoDb.saveTodo(todo));

			return updatedTodos;
		});
	}
};
