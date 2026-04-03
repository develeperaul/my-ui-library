<template>
  <div class="ui-calendar">
    <div class="ui-calendar__header">
      <button @click="prevMonth" class="ui-calendar__nav">←</button>
      <span class="ui-calendar__title">{{ currentMonthName }} {{ currentYear }}</span>
      <button @click="nextMonth" class="ui-calendar__nav">→</button>
    </div>

    <div class="ui-calendar__weekdays">
      <div v-for="day in weekdays" :key="day" class="ui-calendar__weekday">
        {{ day }}
      </div>
    </div>

    <div class="ui-calendar__days">
      <button
        v-for="day in calendarDays"
        :key="day.date"
        :class="['ui-calendar__day', { 'ui-calendar__day--other-month': day.isOtherMonth }]"
        @click="selectDate(day.date)"
      >
        {{ day.day }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Пропсы
const props = defineProps<{
  modelValue?: Date
}>()

// Эмиты
const emit = defineEmits<{
  'update:modelValue': [date: Date]
}>()

// Текущий отображаемый месяц
const currentDate = ref(props.modelValue || new Date())

// Дни недели
const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

// Названия месяцев
const monthNames = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
]

// Текущий месяц и год
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth())
const currentMonthName = computed(() => monthNames[currentMonth.value])

// Переключение месяцев
const prevMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

// Генерация дней для календаря
const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value

  // Первый день месяца
  const firstDay = new Date(year, month, 1)
  // Какой день недели (0 - воскресенье, адаптируем под понедельник)
  let startWeekday = firstDay.getDay()
  startWeekday = startWeekday === 0 ? 6 : startWeekday - 1

  // Последний день месяца
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  const days = []

  // Добавляем дни предыдущего месяца
  const prevMonthDays = startWeekday
  const prevMonth = new Date(year, month, 0)
  const daysInPrevMonth = prevMonth.getDate()

  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, daysInPrevMonth - i)
    days.push({
      day: daysInPrevMonth - i,
      date,
      isOtherMonth: true
    })
  }

  // Добавляем дни текущего месяца
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    days.push({
      day: i,
      date,
      isOtherMonth: false
    })
  }

  // Добавляем дни следующего месяца
  const remainingDays = 42 - days.length // 6 строк по 7 дней
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      day: i,
      date,
      isOtherMonth: true
    })
  }

  return days
})

// Выбор даты
const selectDate = (date: Date) => {
  emit('update:modelValue', date)
}
</script>

<style scoped>
.ui-calendar {
  width: 100%;
  max-width: 350px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.ui-calendar__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.ui-calendar__title {
  font-size: 16px;
  font-weight: 600;
}

.ui-calendar__nav {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
}

.ui-calendar__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 8px;
}

.ui-calendar__weekday {
  text-align: center;
  font-size: 12px;
  color: #999;
  padding: 8px;
}

.ui-calendar__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.ui-calendar__day {
  aspect-ratio: 1;
  text-align: center;
  padding: 8px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 8px;
}

.ui-calendar__day:hover {
  background: #f0f0f0;
}

.ui-calendar__day--other-month {
  color: #ccc;
}
</style>
