<script setup>
import TodoItem from './TodoItem.vue';

defineProps({
  todos: { type: Array, required: true },
  total: { type: Number, required: true },
});
defineEmits(['toggle', 'edit', 'delete']);
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
  <p v-else class="empty">
    {{ total ? 'Ничего не найдено. Измените запрос или фильтр.' : 'Задач пока нет. Добавьте первую кнопкой выше.' }}
  </p>
</template>
