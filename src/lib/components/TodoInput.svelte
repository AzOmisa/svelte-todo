<script lang="ts">
  import { todoActions } from '$lib/stores/todos';
  import { Plus } from 'lucide-svelte';

  let inputValue = '';
  let inputElement: HTMLInputElement;

  function handleSubmit() {
    if (inputValue.trim()) {
      todoActions.add(inputValue);
      inputValue = '';
      inputElement.focus();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }
</script>

<div class="todo-input">
  <div class="input-container">
    <input
      bind:this={inputElement}
      bind:value={inputValue}
      on:keydown={handleKeydown}
      placeholder="Добавить новую задачу..."
      class="input"
      type="text"
    />
    <button
      on:click={handleSubmit}
      class="add-button"
      disabled={!inputValue.trim()}
    >
      <Plus size={20} />
    </button>
  </div>
</div>

<style>
  .todo-input {
    margin-bottom: 2rem;
  }

  .input-container {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  .input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .add-button {
    padding: 0.75rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .add-button:hover:not(:disabled) {
    background: #2563eb;
  }

  .add-button:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
</style>