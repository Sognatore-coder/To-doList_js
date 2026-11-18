<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'
import { useTodoStore } from '../stores/todo'
import { useAnnouncer } from '../composables/useAnnouncer'
import SearchBar from '../components/SearchBar.vue'
import TodoFilters from '../components/TodoFilters.vue'
import TodoList from '../components/TodoList.vue'
import AddTodoModal from '../components/AddTodoModal.vue'
import EditTodoModal from '../components/EditTodoModal.vue'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal.vue'

const store = useTodoStore()
// Состояние — из стора (только задачи текущего пользователя); действия вызываются у самого стора
const { query, filter, visibleTodos, remaining, myTodos } = storeToRefs(store)
const { currentUser } = storeToRefs(useUserStore())
const { announce } = useAnnouncer()

// ---------- состояние интерфейса ----------
const addOpen = ref(false)
const editingId = ref<string | null>(null)
const deletingId = ref<string | null>(null)

const editingTodo = computed(() =>
  editingId.value ? store.findMine(editingId.value) : null
)
const deletingTodo = computed(() =>
  deletingId.value ? store.findMine(deletingId.value) : null
)

async function focusById(id: string): Promise<void> {
  await nextTick()
  document.getElementById(id)?.focus()
}

watch(filter, () => announce(`Показано задач: ${visibleTodos.value.length}`), {
  flush: 'post'
})

// ---------- обработчики ----------
function onAdd(title: string): void {
  store.addTodo(title)
  addOpen.value = false // фокус вернётся на кнопку «Добавить задачу»
  announce(`Задача «${title}» добавлена`)
}

function onToggle(id: string): void {
  const todo = store.toggleTodo(id)
  if (todo) announce(todo.done ? 'Задача выполнена' : 'Задача снова активна')
  focusById(`task-check-${id}`)
}

function onSaveEdit(title: string): void {
  const id = editingId.value
  if (!id) return
  store.updateTodo(id, title)
  announce('Задача обновлена')
  closeEdit(id)
}

function closeEdit(id: string | null = editingId.value): void {
  editingId.value = null
  if (id) focusById(`edit-${id}`)
}

function onConfirmDelete(): void {
  if (deletingId.value) store.removeTodo(deletingId.value)
  deletingId.value = null
  announce('Задача удалена')
  focusById('add-open')
}

function closeDelete(): void {
  const id = deletingId.value
  deletingId.value = null
  if (id && store.findMine(id)) focusById(`delete-${id}`)
}
</script>

<template>
  <section class="todo">
    <h1>Мои задачи</h1>
    <p v-if="currentUser" class="todo__owner">
      Аккаунт: {{ currentUser.email }}
    </p>

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

    <p v-if="myTodos.length" class="counter">
      Осталось сделать: {{ remaining }} из {{ myTodos.length }}
    </p>

    <TodoList
      :todos="visibleTodos"
      :total="myTodos.length"
      @toggle="onToggle"
      @edit="editingId = $event"
      @delete="deletingId = $event"
    />

    <AddTodoModal :open="addOpen" @close="addOpen = false" @submit="onAdd" />
    <EditTodoModal
      :open="editingTodo !== null"
      :todo="editingTodo"
      @close="closeEdit()"
      @save="onSaveEdit"
    />
    <ConfirmDeleteModal
      :open="deletingTodo !== null"
      :todo="deletingTodo"
      @close="closeDelete"
      @confirm="onConfirmDelete"
    />
  </section>
</template>
