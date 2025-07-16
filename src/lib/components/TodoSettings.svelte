<script lang="ts">
  import { Settings } from 'lucide-svelte';
  import { todoActions } from '$lib/stores/todos';
  
  let showSettings = false;
  
  function exportTodos() {
    // Экспорт в JSON
    import('$lib/stores/todos').then(({ todos }) => {
      todos.subscribe(value => {
        const dataStr = JSON.stringify(value, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'todos.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      })();
    });
  }
</script>

<div class="settings">
  <button 
    class="settings-btn"
    on:click={() => showSettings = !showSettings}
  >
    <Settings size={18} />
  </button>
  
  {#if showSettings}
    <div class="settings-menu">
      <button on:click={exportTodos}>Экспорт задач</button>
      <button on:click={() => confirm('Удалить все задачи?') && todoActions.clearAll()}>
        Очистить все
      </button>
    </div>
  {/if}
</div>

<style>
  .settings {
    position: relative;
    margin-left: auto;
  }

  .settings-btn {
    padding: 0.5rem;
    background: #f3f4f6;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .settings-btn:hover {
    background: #e5e7eb;
  }

  .settings-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 10;
    width: max-content;
  }

  .settings-menu button {
    display: block;
    width: 100%;
    padding: 0.5rem;
    text-align: left;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 0.25rem;
    transition: background-color 0.2s;
  }

  .settings-menu button:hover {
    background: #f3f4f6;
  }
</style>