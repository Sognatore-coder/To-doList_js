<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useTodos } from './composables/useTodos';
import { useTheme } from './composables/useTheme';
import ThemeToggle from './components/ThemeToggle.vue';
import SearchBar from './components/SearchBar.vue';
import TodoFilters from './components/TodoFilters.vue';
import TodoList from './components/TodoList.vue';
import AddTodoModal from './components/AddTodoModal.vue';
import EditTodoModal from './components/EditTodoModal.vue';
import ConfirmDeleteModal from './components/ConfirmDeleteModal.vue';

const { todos, query, filter, visibleTodos, remaining, findTodo, addTodo, updateTodo, toggleTodo, removeTodo } = useTodos();
const { theme, toggleTheme } = useTheme();

// ---------- состояние интерфейса ----------
const addOpen = ref(false);
const editingId = ref(null);
const deletingId = ref(null);
const status = ref('');

const editingTodo = computed(() => (editingId.value ? findTodo(editingId.value) : null));
const deletingTodo = computed(() => (deletingId.value ? findTodo(deletingId.value) : null));

// ---------- доступность ----------
// Озвучиваем действия скринридеру через live-область
function announce(message) {
  status.value = '';
  setTimeout(() => { status.value = message; }, 50);
}

async function focusById(id) {
  await nextTick();
  document.getElementById(id)?.focus();
}

watch(filter, () => announce(`Показано задач: ${visibleTodos.value.length}`), { flush: 'post' });

// ---------- обработчики ----------
function onAdd(title) {
  addTodo(title);
  addOpen.value = false;
  announce(`Задача «${title}» добавлена`);
}

function onToggle(id) {
  const todo = toggleTodo(id);
  announce(todo.done ? 'Задача выполнена' : 'Задача снова активна');
  focusById(`task-check-${id}`);
}

function onSaveEdit(title) {
  const id = editingId.value;
  updateTodo(id, title);
  announce('Задача обновлена');
  closeEdit(id);
}

function closeEdit(id = editingId.value) {
  editingId.value = null;
  if (id) focusById(`edit-${id}`);
}

function onConfirmDelete() {
  removeTodo(deletingId.value);
  deletingId.value = null;
  announce('Задача удалена');
  focusById('add-open');
}

function closeDelete() {
  const id = deletingId.value;
  deletingId.value = null;
  if (id && findTodo(id)) focusById(`delete-${id}`);
}

function onToggleTheme() {
  toggleTheme();
  announce(theme.value === 'dark' ? 'Включена тёмная тема' : 'Включена светлая тема');
}
</script>

<template>
  <a class="skip-link" href="#main">Перейти к списку задач</a>

  <div class="container">
    <header class="header">
      <h1 class="header__title">Мои задачи</h1>
      <ThemeToggle :theme="theme" @toggle="onToggleTheme" />
    </header>

    <main id="main" class="main" tabindex="-1">
      <button
        id="add-open"
        class="btn btn--primary btn--add"
        type="button"
        aria-haspopup="dialog"
        @click="addOpen = true"
      >
        Добавить задачу
      </button>

      <section class="toolbar" aria-label="Поиск и фильтры">
        <SearchBar v-model="query" />
        <TodoFilters v-model="filter" />
      </section>

      <h2 class="visually-hidden">Список задач</h2>
      <p v-if="todos.length" class="counter">Осталось сделать: {{ remaining }} из {{ todos.length }}</p>

      <TodoList
        :todos="visibleTodos"
        :total="todos.length"
        @toggle="onToggle"
        @edit="editingId = $event"
        @delete="deletingId = $event"
      />
    </main>
  </div>

  <p class="visually-hidden" role="status" aria-live="polite">{{ status }}</p>

  <AddTodoModal :open="addOpen" @close="addOpen = false" @submit="onAdd" />
  <EditTodoModal :open="editingTodo !== null" :todo="editingTodo" @close="closeEdit()" @save="onSaveEdit" />
  <ConfirmDeleteModal :open="deletingTodo !== null" :todo="deletingTodo" @close="closeDelete" @confirm="onConfirmDelete" />
</template>
