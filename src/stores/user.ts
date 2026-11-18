import { defineStore } from 'pinia'
import type { AuthResult, User } from '../types/user'
import { toUser } from '../types/user'


export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const MIN_PASSWORD_LENGTH = 6

interface UserState {
  users: User[]
  currentUserId: string | null
}

const normalizeEmail = (email: string): string => email.trim().toLowerCase()
const createId = (): string =>
  'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7)

// Пароль в явном виде не храним: SHA-256 с солью.
async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`)
  if (globalThis.crypto?.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', data)
    return [...new Uint8Array(digest)]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }
  let h = 0x811c9dc5 // FNV-1a
  for (const byte of data) {
    h ^= byte
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16)
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
    currentUserId: null
  }),

  getters: {
    currentUser: (state): User | null =>
      state.users.find((u) => u.id === state.currentUserId) ?? null,
    isAuthenticated(): boolean {
      return this.currentUser !== null
    }
  },

  actions: {
    async register(email: string, password: string): Promise<AuthResult> {
      const normalized = normalizeEmail(email)
      if (this.users.some((u) => u.email === normalized)) {
        return {
          ok: false,
          error: 'Пользователь с таким email уже зарегистрирован'
        }
      }
      const salt = createId()
      this.users.push({
        id: createId(),
        email: normalized,
        salt,
        hash: await hashPassword(password, salt)
      })
      return { ok: true }
    },

    async login(email: string, password: string): Promise<AuthResult> {
      const user = this.users.find((u) => u.email === normalizeEmail(email))
      const fail: AuthResult = { ok: false, error: 'Неверный email или пароль' }
      if (!user) return fail
      if ((await hashPassword(password, user.salt)) !== user.hash) return fail
      this.currentUserId = user.id
      return { ok: true }
    },

    logout(): void {
      this.currentUserId = null
    }
  },

  persist: {
    key: 'todo-app:users',
    // Данные из localStorage могут быть повреждены или устареть — приводим их к ожидаемому виду.
    // Читаем как unknown: тип User[] в состоянии не гарантирует, что в хранилище лежит именно он.
    afterHydrate: ({ store }) => {
      const rawUsers: unknown = store.users
      const users = Array.isArray(rawUsers)
        ? rawUsers.map(toUser).filter((u): u is User => u !== null)
        : []
      const currentUserId = users.some((u) => u.id === store.currentUserId)
        ? store.currentUserId
        : null
      store.$patch((state) => {
        state.users = users
        state.currentUserId = currentUserId
      })
    }
  }
})
