import { defineStore } from 'pinia';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MIN_PASSWORD_LENGTH = 6;

const normalizeEmail = (email) => String(email).trim().toLowerCase();
const createId = () => 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  if (globalThis.crypto?.subtle) {
    const digest = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 0x811c9dc5;
  for (const byte of data) {
    h ^= byte;
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

function sanitize(store) {
  const users = Array.isArray(store.users)
    ? store.users.filter(
        (u) => u && ['id', 'email', 'salt', 'hash'].every((key) => typeof u[key] === 'string')
      )
    : [];
  const currentUserId = users.some((u) => u.id === store.currentUserId) ? store.currentUserId : null;
  store.$patch({ users, currentUserId });
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [], // [{ id, email, salt, hash }]
    currentUserId: null, 
  }),

  getters: {
    currentUser: (state) => state.users.find((u) => u.id === state.currentUserId) ?? null,
    isAuthenticated() {
      return this.currentUser !== null;
    },
  },

  actions: {
    async register(email, password) {
      const normalized = normalizeEmail(email);
      if (this.users.some((u) => u.email === normalized)) {
        return { ok: false, error: 'Пользователь с таким email уже зарегистрирован' };
      }
      const salt = createId();
      this.users.push({ id: createId(), email: normalized, salt, hash: await hashPassword(password, salt) });
      return { ok: true };
    },

    async login(email, password) {
      const user = this.users.find((u) => u.email === normalizeEmail(email));
      const fail = { ok: false, error: 'Неверный email или пароль' };
      if (!user) return fail;
      if ((await hashPassword(password, user.salt)) !== user.hash) return fail;
      this.currentUserId = user.id;
      return { ok: true };
    },

    logout() {
      this.currentUserId = null;
    },
  },

  persist: {
    key: 'todo-app:users',
    afterHydrate: ({ store }) => sanitize(store),
  },
});
