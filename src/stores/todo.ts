import { defineStore } from 'pinia'
import type { Todo, TodoFilter } from '../types/todo'
import { toTodo } from '../types/todo'
import { useUserStore } from './user'

interface TodoState {
  todos: Todo[]
  query: string
  filter: TodoFilter
}

const createId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

export const useTodoStore = defineStore('todo', {
  state: (): TodoState => ({
    todos: [],
    query: '',
    filter: 'all'
  }),

  getters: {
    myTodos(state): Todo[] {
      const userId = useUserStore().currentUserId
      return userId ? state.todos.filter((t) => t.userId === userId) : []
    },

    visibleTodos(): Todo[] {
      const q = this.query.trim().toLowerCase()
      return this.myTodos
        .filter((t) => {
          if (this.filter === 'active' && t.done) return false
          if (this.filter === 'done' && !t.done) return false
          return !q || t.title.toLowerCase().includes(q)
        })
        .sort((a, b) => Number(a.done) - Number(b.done))
    },

    remaining(): number {
      return this.myTodos.filter((t) => !t.done).length
    }
  },

  actions: {
    findMine(id: string): Todo | null {
      return this.myTodos.find((t) => t.id === id) ?? null
    },

    addTodo(title: string): void {
      const userId = useUserStore().currentUserId
      if (!userId) return
      this.todos.unshift({ id: createId(), userId, title, done: false })
    },

    updateTodo(id: string, title: string): void {
      const todo = this.findMine(id)
      if (todo) todo.title = title
    },

    toggleTodo(id: string): Todo | null {
      const todo = this.findMine(id)
      if (todo) todo.done = !todo.done
      return todo
    },

    removeTodo(id: string): void {
      const userId = useUserStore().currentUserId
      this.todos = this.todos.filter(
        (t) => !(t.id === id && t.userId === userId)
      )
    },

    resetFilters(): void {
      this.query = ''
      this.filter = 'all'
    }
  },

  persist: {
    key: 'todo-app:todos',
    pick: ['todos'],
    afterHydrate: ({ store }) => {
      const rawTodos: unknown = store.todos
      const todos = Array.isArray(rawTodos)
        ? rawTodos.map(toTodo).filter((t): t is Todo => t !== null)
        : []
      store.$patch((state) => {
        state.todos = todos
      })
    }
  }
})
