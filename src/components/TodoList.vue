<script setup lang="ts">
import type { Todo } from '../types/todo'
import TodoItem from './TodoItem.vue'

defineProps<{
  todos: Todo[]
  total: number
}>()
defineEmits<{
  toggle: [id: string]
  edit: [id: string]
  delete: [id: string]
}>()
</script>

<template>
  <ul v-if="todos.length" class="task-list" role="list">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle="$emit('toggle', $event)"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />
  </ul>
  <!-- v-if: пустого <ul> в DOM быть не должно, вместо него — подсказка -->
  <p v-else class="empty">
    {{
      total
        ? 'Ничего не найдено. Измените запрос или фильтр.'
        : 'Задач пока нет. Добавьте первую кнопкой выше.'
    }}
  </p>
</template>
