<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/user';
import { useTodoStore } from '../stores/todo';
import { useAnnouncer } from '../composables/useAnnouncer';
import SearchBar from '../components/SearchBar.vue';
import TodoFilters from '../components/TodoFilters.vue';
import TodoList from '../components/TodoList.vue';
import AddTodoModal from '../components/AddTodoModal.vue';
import EditTodoModal from '../components/EditTodoModal.vue';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal.vue';

const store = useTodoStore();
// Состояние — из стора (только задачи текущего пользователя); действия вызываются у самого стора
const { query, filter, visibleTodos, remaining, myTodos } = storeToRefs(store);
const { currentUser } = storeToRefs(useUserStore());
const { announce } = useAnnouncer();

// ---------- состояние интерфейса ----------
const addOpen = ref(false);
const editingId = ref(null);
const deletingId = ref(null);

const editingTodo = computed(() => (editingId.value ? store.findMine(editingId.value) : null));
const deletingTodo = computed(() => (deletingId.value ? store.findMine(deletingId.value) : null));

async function focusById(id) {
  await nextTick();
  document.getElementById(id)?.focus();
}

watch(filter, () => announce(`Показано задач: ${visibleTodos.value.length}`), { flush: 'post' });

// ---------- обработчики ----------
function onAdd(title) {
  store.addTodo(title);
  addOpen.value = false;
  announce(`Задача «${title}» добавлена`);
}

function onToggle(id) {
  const todo = store.toggleTodo(id);
  announce(todo.done ? 'Задача выполнена' : 'Задача снова активна');
  focusById(`task-check-${id}`);
}

function onSaveEdit(title) {
  const id = editingId.value;
  store.updateTodo(id, title);
  announce('Задача обновлена');
  closeEdit(id);
}

function closeEdit(id = editingId.value) {
  editingId.value = null;
  if (id) focusById(`edit-${id}`);
}

function onConfirmDelete() {
  store.removeTodo(deletingId.value);
  deletingId.value = null;
  announce('Задача удалена');
  focusById('add-open');
}

function closeDelete() {
  const id = deletingId.value;
  deletingId.value = null;
  if (id && store.findMine(id)) focusById(`delete-${id}`);
}
</script>

<template>
  <section class="todo">
    <h1>Мои задачи</h1>
    <p v-if="currentUser" class="todo__owner">Аккаунт: {{ currentUser.email }}</p>

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

    <!-- v-if: счётчик не нужен, пока задач нет -->
    <p v-if="myTodos.length" class="counter">Осталось сделать: {{ remaining }} из {{ myTodos.length }}</p>

    <TodoList
      :todos="visibleTodos"
      :total="myTodos.length"
      @toggle="onToggle"
      @edit="editingId = $event"
      @delete="deletingId = $event"
    />

    <AddTodoModal :open="addOpen" @close="addOpen = false" @submit="onAdd" />
    <EditTodoModal :open="editingTodo !== null" :todo="editingTodo" @close="closeEdit()" @save="onSaveEdit" />
    <ConfirmDeleteModal :open="deletingTodo !== null" :todo="deletingTodo" @close="closeDelete" @confirm="onConfirmDelete" />
  </section>
</template>
