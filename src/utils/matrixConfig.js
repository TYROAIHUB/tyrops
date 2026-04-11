// Latin + digits + specials
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const latinLower = 'abcdefghijklmnopqrstuvwxyz'
const digits = '0123456789'
const specials = '@#$%^&*()*&^%+-/~{[|`]}'

export const CHAR_SET_HACKER = latin + latinLower + digits + specials
export const FONT_SIZE = 10

export function getRandomChar() {
  return CHAR_SET_HACKER[Math.floor(Math.random() * CHAR_SET_HACKER.length)]
}

// ─── Theme ───

export const THEME = {
  background: '#000000',
  headColor: '#FFFFFF',
  brightColor: '#00FF41',
  midColor: '#008F11',
  fadeOpacity: 0.04,
  glowColor: '#00FF41',
  textColor: '#00FF41',
}
