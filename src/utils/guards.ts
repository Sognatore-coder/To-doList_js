// TypeScript не проверяет содержимое localStorage во время выполнения, а утверждение типа
// после JSON.parse() ничего не гарантирует. Поэтому данные читаем как unknown и проверяем.

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
