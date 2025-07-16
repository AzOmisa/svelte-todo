<script lang="ts">
  import TodoInput from '$lib/components/TodoInput.svelte';
  import TodoList from '$lib/components/TodoList.svelte';
  import TodoFilters from '$lib/components/TodoFilters.svelte';
  import TodoSearch from '$lib/components/TodoSearch.svelte';
  import { todoStats, todoActions } from '$lib/stores/todos';
  import { onMount } from 'svelte';
	import TodoSettings from '$lib/components/TodoSettings.svelte';

  $: stats = $todoStats;

  // Загрузка данных из IndexedDB при монтировании
  onMount(async () => {
    try {
      await todoActions.loadTodos();
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  });
</script>

<svelte:head>
  <title>Todo List - SvelteKit</title>
  <meta name="description" content="Простой и функциональный Todo List на SvelteKit" />
</svelte:head>

<div class="app">
  <header class="header">
    <h1>Todo List</h1>
    <p class="subtitle">Организуйте свои задачи эффективно</p>
  </header>

  <main class="main">
    <div class="container">
      <TodoInput />
      <TodoSearch />
      <TodoFilters />
      <TodoList />
      
      {#if stats.total > 0}
        <div class="stats">
          <span class="stat">Всего: {stats.total}</span>
          <span class="stat">Активных: {stats.active}</span>
          <span class="stat">Выполнено: {stats.completed}</span>
        </div>
      {/if}
    </div>
  </main>
</div>

<style>
  :global(body) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f8fafc;
    margin: 0;
    padding: 0;
  }

  .app {
    min-height: 100vh;
    padding: 2rem 1rem;
  }

  .header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }

  .subtitle {
    font-size: 1.125rem;
    color: #64748b;
    margin: 0.5rem 0 0 0;
  }

  .main {
    display: flex;
    justify-content: center;
  }

  .container {
    width: 100%;
    max-width: 600px;
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .stats {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .stat {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }

  @media (max-width: 640px) {
    .app {
      padding: 1rem 0.5rem;
    }

    .container {
      padding: 1.5rem;
    }

    .header h1 {
      font-size: 2rem;
    }

    .stats {
      flex-direction: column;
      gap: 0.5rem;
      text-align: center;
    }
  }
</style>