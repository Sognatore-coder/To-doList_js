import { isRecord } from '../utils/guards'

/** Учебный пользователь. Пароль в открытом виде не хранится: только соль и хэш. */
export interface User {
  id: string
  email: string
  salt: string
  hash: string
}

export type AuthResult = { ok: true } | { ok: false; error: string }

export function toUser(value: unknown): User | null {
  if (!isRecord(value)) return null
  const { id, email, salt, hash } = value
  if (
    typeof id !== 'string' ||
    typeof email !== 'string' ||
    typeof salt !== 'string' ||
    typeof hash !== 'string'
  ) {
    return null
  }
  return { id, email, salt, hash }
}
