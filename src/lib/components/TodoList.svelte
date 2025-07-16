<script lang="ts">
  import { filteredTodos, todoActions } from '$lib/stores/todos';
  import TodoItem from './TodoItem.svelte';
  import { CheckSquare } from 'lucide-svelte';
	import TodoSettings from './TodoSettings.svelte';

  $: todos = $filteredTodos;
</script>

<div class="todo-list">
  {#if todos.length > 0}
    <div class="list-header">
      <button
        class="toggle-all-btn"
        on:click={todoActions.toggleAll}
        title="Переключить все"
      >
        <CheckSquare size={20} />
      </button>
      <span class="list-title">Список задач</span>
      <TodoSettings />
    </div>

    <div class="todos-container">
      {#each todos as todo (todo.id)}
        <TodoItem {todo} />
      {/each}
    </div>
  {:else}
    <div class="empty-state">
      <p>Нет задач для отображения</p>
    </div>
  {/if}
</div>

<style>
  .todo-list {
    min-height: 200px;
  }

  .list-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .toggle-all-btn {
    padding: 0.5rem;
    background: #f3f4f6;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    color: #6b7280;
  }

  .toggle-all-btn:hover {
    background: #e5e7eb;
  }

  .list-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
  }

  .todos-container {
    display: flex;
    flex-direction: column;
  }

  .empty-state {
    text-align: center;
    padding: 2rem;
    color: #9ca3af;
  }

  .empty-state p {
    font-size: 1.125rem;
    margin: 0;
  }
</style>