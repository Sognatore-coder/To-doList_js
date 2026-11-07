<script setup>
defineProps({
  todo: { type: Object, required: true },
});
defineEmits(['toggle', 'edit', 'delete']);
</script>

<template>
  <li class="task" :class="{ 'task--done': todo.done }">
    <label class="task__check">
      <input
        :id="`task-check-${todo.id}`"
        class="task__checkbox"
        type="checkbox"
        :checked="todo.done"
        :aria-labelledby="`task-title-${todo.id}`"
        @change="$emit('toggle', todo.id)"
      >
      <span :id="`task-title-${todo.id}`" class="task__title">{{ todo.title }}</span>
    </label>

    <div class="task__actions">
      <button
        :id="`edit-${todo.id}`"
        class="btn btn--icon"
        type="button"
        aria-label="Редактировать"
        :aria-labelledby="`edit-${todo.id} task-title-${todo.id}`"
        @click="$emit('edit', todo.id)"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <path d="M4 20h4L19 9l-4-4L4 16v4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        </svg>
      </button>
      <button
        :id="`delete-${todo.id}`"
        class="btn btn--icon btn--danger-hover"
        type="button"
        aria-label="Удалить"
        :aria-labelledby="`delete-${todo.id} task-title-${todo.id}`"
        @click="$emit('delete', todo.id)"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </li>
</template>
