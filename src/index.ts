// src/index.ts
import './styles/index.css'

import Calendar from './components/Calendar.vue'

// Экспорт по отдельности
export { Calendar }

// Экспорт всех компонентов одним объектом
const components = { Calendar }

export default components

export const version = '1.0.3'
