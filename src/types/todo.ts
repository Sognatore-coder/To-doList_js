import { isRecord } from '../utils/guards'

export interface Todo {
  id: string
  userId: string
  title: string
  done: boolean
}

export type TodoFilter = 'all' | 'active' | 'done'


export function toTodo(value: unknown): Todo | null {
  if (!isRecord(value)) return null
  const { id, userId, title, done } = value
  if (
    typeof id !== 'string' ||
    typeof userId !== 'string' ||
    typeof title !== 'string'
  ) {
    return null
  }
  return { id, userId, title, done: Boolean(done) }
}
