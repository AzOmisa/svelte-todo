<script lang="ts">
  import { filter, todoStats, todoActions } from '$lib/stores/todos';
  import type { FilterType } from '$lib/types';

  $: stats = $todoStats;

  function setFilter(newFilter: FilterType) {
    filter.set(newFilter);
  }
</script>

<div class="filters">
  <div class="filter-buttons">
    <button 
      class="filter-btn" 
      class:active={$filter === 'all'}
      on:click={() => setFilter('all')}
    >
      Все ({stats.total})
    </button>
    <button 
      class="filter-btn" 
      class:active={$filter === 'active'}
      on:click={() => setFilter('active')}
    >
      Активные ({stats.active})
    </button>
    <button 
      class="filter-btn" 
      class:active={$filter === 'completed'}
      on:click={() => setFilter('completed')}
    >
      Выполненные ({stats.completed})
    </button>
    {#if stats.completed > 0}
      <button 
        class="clear-btn"
        on:click={todoActions.clearCompleted}
      >
        Очистить выполненные
      </button>
    {/if}
  </div>


</div>

<style>
  .filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1.5rem 0;
    padding: 1rem;
    background: #f9fafb;
    border-radius: 0.5rem;
  }

  .filter-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .filter-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #e5e7eb;
    background: white;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
  }

  .filter-btn:hover {
    border-color: #3b82f6;
  }

  .filter-btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  .clear-btn {
    padding: 0.5rem 1rem;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 0.875rem;
  }

  .clear-btn:hover {
    background: #dc2626;
  }
</style>