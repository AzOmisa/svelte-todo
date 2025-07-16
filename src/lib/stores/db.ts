import type { Todo } from '../types';

const DB_NAME = 'TodoApp';
const DB_VERSION = 1;
const TODO_STORE = 'todos';

class TodoDB {
	private db: IDBDatabase | null = null;

	async init(): Promise<void> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, DB_VERSION);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				this.db = request.result;
				resolve();
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;

				if (!db.objectStoreNames.contains(TODO_STORE)) {
					const store = db.createObjectStore(TODO_STORE, { keyPath: 'id' });
					store.createIndex('completed', 'completed', { unique: false });
					store.createIndex('createdAt', 'createdAt', { unique: false });
					store.createIndex('text', 'text', { unique: false });
				}
			};
		});
	}

	async getAllTodos(): Promise<Todo[]> {
		if (!this.db) throw new Error('Database not initialized');

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([TODO_STORE], 'readonly');
			const store = transaction.objectStore(TODO_STORE);
			const request = store.getAll();

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				const todos = request.result.map((todo) => ({
					...todo,
					createdAt: new Date(todo.createdAt),
					updatedAt: new Date(todo.updatedAt)
				}));
				resolve(todos);
			};
		});
	}

	async saveTodo(todo: Todo): Promise<void> {
		if (!this.db) throw new Error('Database not initialized');

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([TODO_STORE], 'readwrite');
			const store = transaction.objectStore(TODO_STORE);
			const request = store.put(todo);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}

	async deleteTodo(id: string): Promise<void> {
		if (!this.db) throw new Error('Database not initialized');

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([TODO_STORE], 'readwrite');
			const store = transaction.objectStore(TODO_STORE);
			const request = store.delete(id);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}

	async clearCompleted(): Promise<void> {
		if (!this.db) throw new Error('Database not initialized');

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([TODO_STORE], 'readwrite');
			const store = transaction.objectStore(TODO_STORE);
			const index = store.index('completed');
			const request = index.openCursor(IDBKeyRange.only('true'));


			request.onerror = () => reject(request.error);
			request.onsuccess = (event) => {
				const cursor = (event.target as IDBRequest).result;
				if (cursor) {
					cursor.delete();
					cursor.continue();
				} else {
					resolve();
				}
			};
		});
	}

	async clearAll(): Promise<void> {
		if (!this.db) throw new Error('Database not initialized');

		return new Promise((resolve, reject) => {
			const transaction = this.db!.transaction([TODO_STORE], 'readwrite');
			const store = transaction.objectStore(TODO_STORE);
			const request = store.clear();

			request.onerror = () => reject(request.error);
			request.onsuccess = () => resolve();
		});
	}
}

export const todoDb = new TodoDB();
