import { defineStore } from 'pinia';
import { useUserStore } from './user';

const createId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function sanitize(store) {
  const todos = Array.isArray(store.todos)
    ? store.todos
        .filter((t) => t && ['id', 'userId', 'title'].every((key) => typeof t[key] === 'string'))
        .map((t) => ({ id: t.id, userId: t.userId, title: t.title, done: Boolean(t.done) }))
    : [];
  store.$patch({ todos });
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
    query: '', 
    filter: 'all',
  }),

  getters: {
    myTodos(state) {
      const userId = useUserStore().currentUserId;
      return userId ? state.todos.filter((t) => t.userId === userId) : [];
    },

    visibleTodos() {
      const q = this.query.trim().toLowerCase();
      return this.myTodos
        .filter((t) => {
          if (this.filter === 'active' && t.done) return false;
          if (this.filter === 'done' && !t.done) return false;
          return !q || t.title.toLowerCase().includes(q);
        })
        // выполненные — вниз списка (сортировка стабильная)
        .sort((a, b) => Number(a.done) - Number(b.done));
    },

    remaining() {
      return this.myTodos.filter((t) => !t.done).length;
    },
  },

  actions: {
    findMine(id) {
      return this.myTodos.find((t) => t.id === id) ?? null;
    },

    addTodo(title) {
      const userId = useUserStore().currentUserId;
      if (!userId) return;
      this.todos.unshift({ id: createId(), userId, title, done: false });
    },

    updateTodo(id, title) {
      const todo = this.findMine(id);
      if (todo) todo.title = title;
    },

    toggleTodo(id) {
      const todo = this.findMine(id);
      if (todo) todo.done = !todo.done;
      return todo;
    },

    removeTodo(id) {
      const userId = useUserStore().currentUserId;
      this.todos = this.todos.filter((t) => !(t.id === id && t.userId === userId));
    },

    resetFilters() {
      this.query = '';
      this.filter = 'all';
    },
  },

  // Сохраняем только задачи; поиск и фильтр после перезагрузки сбрасываются
  persist: {
    key: 'todo-app:todos',
    pick: ['todos'],
    afterHydrate: ({ store }) => sanitize(store),
  },
});
