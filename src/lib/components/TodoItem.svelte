<script lang="ts">
  import { todoActions } from '$lib/stores/todos';
  import { Trash2, Edit3, Check, X } from 'lucide-svelte';
  import type { Todo } from '$lib/types';

  export let todo: Todo;

  let isEditing = false;
  let editValue = todo.text;
  let editInput: HTMLInputElement;

  function startEdit() {
    isEditing = true;
    editValue = todo.text;
    setTimeout(() => editInput?.focus(), 0);
  }

  function saveEdit() {
    if (editValue.trim()) {
      todoActions.update(todo.id, editValue);
    }
    isEditing = false;
  }

  function cancelEdit() {
    isEditing = false;
    editValue = todo.text;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      saveEdit();
    } else if (event.key === 'Escape') {
      cancelEdit();
    }
  }
</script>

<div class="todo-item" class:completed={todo.completed}>
  <div class="todo-content">
    <label class="checkbox-container">
      <input
        type="checkbox"
        checked={todo.completed}
        on:change={() => todoActions.toggle(todo.id)}
      />
      <span class="checkmark"></span>
    </label>

    {#if isEditing}
      <input
        bind:this={editInput}
        bind:value={editValue}
        on:keydown={handleKeydown}
        class="edit-input"
        type="text"
      />
    {:else}
      <span class="todo-text" class:completed={todo.completed}>
        {todo.text}
      </span>
    {/if}
  </div>

  <div class="todo-actions">
    {#if isEditing}
      <button on:click={saveEdit} class="action-btn save">
        <Check size={16} />
      </button>
      <button on:click={cancelEdit} class="action-btn cancel">
        <X size={16} />
      </button>
    {:else}
      <button on:click={startEdit} class="action-btn edit">
        <Edit3 size={16} />
      </button>
      <button on:click={() => todoActions.remove(todo.id)} class="action-btn delete">
        <Trash2 size={16} />
      </button>
    {/if}
  </div>
</div>

<style>
  .todo-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    transition: all 0.2s;
  }

  .todo-item:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .todo-item.completed {
    opacity: 0.6;
  }

  .todo-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
  }

  .checkbox-container {
    position: relative;
    cursor: pointer;
  }

  .checkbox-container input {
    opacity: 0;
    position: absolute;
  }

  .checkmark {
    width: 20px;
    height: 20px;
    border: 2px solid #d1d5db;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .checkbox-container input:checked + .checkmark {
    background: #3b82f6;
    border-color: #3b82f6;
  }

  .checkbox-container input:checked + .checkmark::after {
    content: '✓';
    color: white;
    font-size: 12px;
  }

  .todo-text {
    flex: 1;
    font-size: 1rem;
    transition: all 0.2s;
  }

  .todo-text.completed {
    text-decoration: line-through;
    color: #9ca3af;
  }

  .edit-input {
    flex: 1;
    padding: 0.25rem 0.5rem;
    border: 1px solid #3b82f6;
    border-radius: 0.25rem;
    font-size: 1rem;
  }

  .edit-input:focus {
    outline: none;
    border-color: #2563eb;
  }

  .todo-actions {
    display: flex;
    gap: 0.5rem;
  }

  .action-btn {
    padding: 0.5rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .action-btn.edit {
    background: #f3f4f6;
    color: #6b7280;
  }

  .action-btn.edit:hover {
    background: #e5e7eb;
  }

  .action-btn.delete {
    background: #fef2f2;
    color: #ef4444;
  }

  .action-btn.delete:hover {
    background: #fee2e2;
  }

  .action-btn.save {
    background: #f0fdf4;
    color: #22c55e;
  }

  .action-btn.save:hover {
    background: #dcfce7;
  }

  .action-btn.cancel {
    background: #fff7ed;
    color: #f97316;
  }

  .action-btn.cancel:hover {
    background: #fed7aa;
  }
</style>