export function isArrayOf(type: 'string', value: unknown): value is string[]

export function isArrayOf(type: 'number', value: unknown): value is number[]

export function isArrayOf(
  type: 'string' | 'number',
  value: unknown,
): value is (string | number)[]

export function isArrayOf(
    type: 'string' | 'number',
    value: unknown,
): value is (string | number)[] {
  return Array.isArray(value) && value.every((v) => typeof v === type)
}