export const emailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
export const passwordValid = (value) => value.length >= 8
export const amountValid = (value) => Number(value) > 0
