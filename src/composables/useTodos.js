import { ref, computed, watch } from 'vue';

const STORAGE_KEY = 'todo:tasks';

// Битый JSON или неверный формат не должны ронять приложение — стартуем с пустого списка
function loadTodos() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(data)) return [];
    return data
      .filter((t) => t && typeof t.id === 'string' && typeof t.title === 'string')
      .map((t) => ({ id: t.id, title: t.title, done: Boolean(t.done) }));
  } catch {
    return [];
  }
}

const createId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function useTodos() {
  const todos = ref(loadTodos());
  const query = ref('');
  const filter = ref('all');

  const visibleTodos = computed(() => {
    const q = query.value.trim().toLowerCase();
    return todos.value
      .filter((t) => {
        if (filter.value === 'active' && t.done) return false;
        if (filter.value === 'done' && !t.done) return false;
        return !q || t.title.toLowerCase().includes(q);
      })
      // выполненные — вниз списка
      .sort((a, b) => Number(a.done) - Number(b.done));
  });

  const remaining = computed(() => todos.value.filter((t) => !t.done).length);

  watch(
    todos,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch {
      }
    },
    { deep: true }
  );

  const findTodo = (id) => todos.value.find((t) => t.id === id) ?? null;

  function addTodo(title) {
    todos.value.unshift({ id: createId(), title, done: false });
  }

  function updateTodo(id, title) {
    const todo = findTodo(id);
    if (todo) todo.title = title;
  }

  function toggleTodo(id) {
    const todo = findTodo(id);
    if (todo) todo.done = !todo.done;
    return todo;
  }

  function removeTodo(id) {
    todos.value = todos.value.filter((t) => t.id !== id);
  }

  return { todos, query, filter, visibleTodos, remaining, findTodo, addTodo, updateTodo, toggleTodo, removeTodo };
}
