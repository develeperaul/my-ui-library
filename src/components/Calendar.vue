<template>
  <div class="ui-calendar">
    <!-- Шапка с навигацией -->
    <div class="ui-calendar__header">
      <button @click="prevMonth" class="ui-calendar__nav" :disabled="!canGoPrevMonth">←</button>
      <span class="ui-calendar__title">{{ currentMonthName }} {{ currentYear }}</span>
      <button @click="nextMonth" class="ui-calendar__nav" :disabled="!canGoNextMonth">→</button>
    </div>

    <!-- Дни недели -->
    <div class="ui-calendar__weekdays">
      <div v-for="day in weekdays" :key="day" class="ui-calendar__weekday">
        {{ day }}
      </div>
    </div>

    <!-- Ячейки с датами -->
    <div class="ui-calendar__days">
      <button
        v-for="day in calendarDays"
        :key="day.date.toISOString()"
        :class="[
          'ui-calendar__day',
          {
            'ui-calendar__day--other-month': day.isOtherMonth,
            'ui-calendar__day--selected': isSelected(day.date),
            'ui-calendar__day--in-range': isInRange(day.date),
            'ui-calendar__day--range-start': isRangeStart(day.date),
            'ui-calendar__day--range-end': isRangeEnd(day.date),
            'ui-calendar__day--disabled': isDisabled(day.date),
            'ui-calendar__day--weekend': isWeekend(day.date),
            'ui-calendar__day--today': isToday(day.date)
          }
        ]"
        :disabled="isDisabled(day.date)"
        @click="selectDate(day.date)"
        @mouseenter="onDateHover(day.date)"
      >
        {{ day.day }}
      </button>
    </div>

    <!-- Кнопки действий -->
    <div v-if="showActions" class="ui-calendar__actions">
      <button class="ui-calendar__btn ui-calendar__btn--secondary" @click="handleReset">
        Сбросить
      </button>
      <button
        class="ui-calendar__btn ui-calendar__btn--primary"
        @click="handleApply"
        :disabled="!isApplyEnabled"
      >
        Применить
      </button>
    </div>

    <!-- Отображение выбранного периода -->
    <div v-if="mode === 'range' && displayRangeText" class="ui-calendar__range-info">
      Выбранный период: {{ displayRangeText }}
    </div>

    <!-- Сообщение об ошибке -->
    <div v-if="errorMessage" class="ui-calendar__error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

type SelectMode = 'single' | 'range'

// Типы ограничений
interface DateRestriction {
  /** Запретить прошлые даты */
  noPast?: boolean
  /** Запретить будущие даты */
  noFuture?: boolean
  /** Запретить определенные дни недели (0-6, 0=воскресенье) */
  disabledWeekdays?: number[]
  /** Максимальное количество дней в диапазоне */
  maxRangeDays?: number
  /** Минимальное количество дней в диапазоне */
  minRangeDays?: number
  /** Запретить выходные */
  disableWeekends?: boolean
  /** Запретить сегодняшний день */
  disableToday?: boolean
}

interface Props {
  mode?: SelectMode
  modelValue?: Date | { start: Date | null; end: Date | null } | null
  /** Минимальная дата */
  minDate?: Date
  /** Максимальная дата */
  maxDate?: Date
  /** Конкретные заблокированные даты */
  disabledDates?: Date[]
  /** Конкретные разрешённые даты (только их можно выбрать) */
  enabledDates?: Date[]
  /** Ограничения по правилам */
  restrictions?: DateRestriction
  /** Показывать кнопки действий */
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'single',
  showActions: true,
  restrictions: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  apply: [value: any]
  reset: []
}>()

// Состояния
const currentDate = ref(new Date())
const hoverDate = ref<Date | null>(null)
const errorMessage = ref('')

// Временный диапазон для выбора (до нажатия "Применить")
const tempRange = ref<{ start: Date | null; end: Date | null }>({
  start: null,
  end: null
})

// Если режим single
const selectedSingleDate = ref<Date | null>(
  props.mode === 'single' ? (props.modelValue as Date) || null : null
)

// Если режим range
const selectedRange = ref<{ start: Date | null; end: Date | null }>(
  props.mode === 'range'
    ? (props.modelValue as { start: Date | null; end: Date | null }) || {
        start: null,
        end: null
      }
    : { start: null, end: null }
)

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

// Проверка, можно ли переключить месяц назад
const canGoPrevMonth = computed(() => {
  if (!props.minDate) return true
  const prevMonthDate = new Date(currentYear.value, currentMonth.value - 1, 1)
  const minDateNormalized = new Date(props.minDate)
  minDateNormalized.setDate(1)
  return prevMonthDate >= minDateNormalized
})

// Проверка, можно ли переключить месяц вперёд
const canGoNextMonth = computed(() => {
  if (!props.maxDate) return true
  const nextMonthDate = new Date(currentYear.value, currentMonth.value + 1, 1)
  const maxDateNormalized = new Date(props.maxDate)
  maxDateNormalized.setDate(1)
  return nextMonthDate <= maxDateNormalized
})

// Проверка, является ли дата сегодняшней
const isToday = (date: Date): boolean => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

// Проверка, является ли дата выходным (суббота или воскресенье)
const isWeekend = (date: Date): boolean => {
  const day = date.getDay()
  return day === 0 || day === 6
}

// Проверка, заблокирована ли дата
const isDisabled = (date: Date): boolean => {
  // Очищаем время для корректного сравнения
  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 1. Проверка minDate
  if (props.minDate) {
    const min = new Date(props.minDate)
    min.setHours(0, 0, 0, 0)
    if (compareDate < min) return true
  }

  // 2. Проверка maxDate
  if (props.maxDate) {
    const max = new Date(props.maxDate)
    max.setHours(0, 0, 0, 0)
    if (compareDate > max) return true
  }

  // 3. Проверка restrictions
  if (props.restrictions) {
    const r = props.restrictions

    // Запрет прошлых дат
    if (r.noPast && compareDate < today) return true

    // Запрет будущих дат
    if (r.noFuture && compareDate > today) return true

    // Запрет сегодняшней даты
    if (r.disableToday && compareDate.toDateString() === today.toDateString()) return true

    // Запрет выходных
    if (r.disableWeekends && isWeekend(date)) return true

    // Запрет определённых дней недели
    if (r.disabledWeekdays && r.disabledWeekdays.length) {
      // Конвертируем день недели (вс=0 -> вс=0, пн=1)
      let dayOfWeek = date.getDay()
      if (r.disabledWeekdays.includes(dayOfWeek)) return true
    }
  }

  // 4. Проверка конкретных заблокированных дат
  if (props.disabledDates) {
    const isDisabled = props.disabledDates.some((d) => {
      const disabledDate = new Date(d)
      disabledDate.setHours(0, 0, 0, 0)
      return compareDate.toDateString() === disabledDate.toDateString()
    })
    if (isDisabled) return true
  }

  // 5. Проверка разрешённых дат (если указаны)
  if (props.enabledDates && props.enabledDates.length) {
    const isEnabled = props.enabledDates.some((d) => {
      const enabledDate = new Date(d)
      enabledDate.setHours(0, 0, 0, 0)
      return compareDate.toDateString() === enabledDate.toDateString()
    })
    if (!isEnabled) return true
  }

  return false
}

// Проверка валидности диапазона
const isValidRange = (start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return true

  const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const r = props.restrictions

  if (r?.maxRangeDays && diffDays > r.maxRangeDays) {
    errorMessage.value = `Максимальный период: ${r.maxRangeDays} дней`
    return false
  }

  if (r?.minRangeDays && diffDays < r.minRangeDays) {
    errorMessage.value = `Минимальный период: ${r.minRangeDays} дней`
    return false
  }

  errorMessage.value = ''
  return true
}

// Проверка, можно ли применить
const isApplyEnabled = computed(() => {
  if (props.mode === 'single') {
    return selectedSingleDate.value !== null
  } else {
    return (
      tempRange.value.start &&
      tempRange.value.end &&
      isValidRange(tempRange.value.start, tempRange.value.end)
    )
  }
})

// Отображение выбранного периода
const displayRangeText = computed(() => {
  if (props.mode !== 'range') return ''

  const range = tempRange.value.start && tempRange.value.end ? tempRange.value : selectedRange.value

  if (range.start && range.end) {
    const diffDays =
      Math.ceil(Math.abs(range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return `${formatDate(range.start)} - ${formatDate(range.end)} (${diffDays} дн.)`
  }
  if (range.start) {
    return `${formatDate(range.start)} - ...`
  }
  return ''
})

// Форматирование даты
const formatDate = (date: Date): string => {
  return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${date.getFullYear()}`
}

// Получение активного диапазона для отображения
const activeRange = computed(() => {
  if (props.mode !== 'range') return null

  if (tempRange.value.start && !tempRange.value.end) {
    if (hoverDate.value) {
      let start = tempRange.value.start
      let end = hoverDate.value
      if (start > end) {
        ;[start, end] = [end, start]
      }
      return { start, end }
    }
    return { start: tempRange.value.start, end: null }
  }

  if (tempRange.value.start && tempRange.value.end) {
    return tempRange.value
  }

  return selectedRange.value
})

// Проверка, выбран ли день
const isSelected = (date: Date): boolean => {
  if (props.mode === 'single') {
    return selectedSingleDate.value?.toDateString() === date.toDateString()
  } else {
    const range = activeRange.value
    if (!range) return false
    return (
      range.start?.toDateString() === date.toDateString() ||
      range.end?.toDateString() === date.toDateString()
    )
  }
}

// Проверка, входит ли дата в диапазон
const isInRange = (date: Date): boolean => {
  if (props.mode !== 'range') return false

  const range = activeRange.value
  if (!range?.start || !range?.end) return false

  return date > range.start && date < range.end
}

// Проверка, является ли дата началом диапазона
const isRangeStart = (date: Date): boolean => {
  if (props.mode !== 'range') return false
  const range = activeRange.value
  return range?.start?.toDateString() === date.toDateString()
}

// Проверка, является ли дата концом диапазона
const isRangeEnd = (date: Date): boolean => {
  if (props.mode !== 'range') return false
  const range = activeRange.value
  return range?.end?.toDateString() === date.toDateString()
}

// Переключение месяцев
const prevMonth = () => {
  if (canGoPrevMonth.value) {
    currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
  }
}

const nextMonth = () => {
  if (canGoNextMonth.value) {
    currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
  }
}

// Генерация дней для календаря
const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value

  const firstDay = new Date(year, month, 1)
  let startWeekday = firstDay.getDay()
  startWeekday = startWeekday === 0 ? 6 : startWeekday - 1

  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  const days = []

  // Дни предыдущего месяца
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

  // Дни текущего месяца
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    days.push({
      day: i,
      date,
      isOtherMonth: false
    })
  }

  // Дни следующего месяца
  const remainingDays = 42 - days.length
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

// Обработка наведения для подсветки диапазона
const onDateHover = (date: Date) => {
  if (props.mode !== 'range') return
  if (tempRange.value.start && !tempRange.value.end && !isDisabled(date)) {
    hoverDate.value = date
  }
}

// Выбор даты
const selectDate = (date: Date) => {
  if (isDisabled(date)) return

  if (props.mode === 'single') {
    selectedSingleDate.value = date
    emit('update:modelValue', date)
    if (!props.showActions) {
      emit('apply', date)
    }
  } else {
    // Range mode
    if (!tempRange.value.start || (tempRange.value.start && tempRange.value.end)) {
      // Начинаем новый диапазон
      tempRange.value = { start: date, end: null }
      hoverDate.value = null
      errorMessage.value = ''
    } else {
      // Завершаем диапазон
      let start = tempRange.value.start
      let end = date

      // Сортируем даты
      if (start && end && start > end) {
        ;[start, end] = [end, start]
      }

      // Проверяем валидность диапазона
      if (isValidRange(start, end)) {
        tempRange.value = { start, end }

        if (!props.showActions) {
          selectedRange.value = { start, end }
          emit('update:modelValue', { start, end })
          emit('apply', { start, end })
        }
      }
    }
  }
}

// Применить изменения
const handleApply = () => {
  if (props.mode === 'range') {
    if (
      tempRange.value.start &&
      tempRange.value.end &&
      isValidRange(tempRange.value.start, tempRange.value.end)
    ) {
      selectedRange.value = {
        start: tempRange.value.start,
        end: tempRange.value.end
      }
      emit('update:modelValue', {
        start: tempRange.value.start,
        end: tempRange.value.end
      })
      emit('apply', { start: tempRange.value.start, end: tempRange.value.end })
    }
  } else {
    emit('apply', selectedSingleDate.value)
  }
}

// Сбросить выбор
const handleReset = () => {
  if (props.mode === 'single') {
    selectedSingleDate.value = null
    emit('update:modelValue', null)
  } else {
    tempRange.value = { start: null, end: null }
    selectedRange.value = { start: null, end: null }
    hoverDate.value = null
    emit('update:modelValue', { start: null, end: null })
  }
  errorMessage.value = ''
  emit('reset')
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
  border-radius: 4px;
}

.ui-calendar__nav:hover:not(:disabled) {
  background: #f0f0f0;
}

.ui-calendar__nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
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
  gap: 2px;
}

.ui-calendar__day {
  aspect-ratio: 1;
  text-align: center;
  padding: 8px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.ui-calendar__day:hover:not(:disabled) {
  background: #f0f0f0;
}

.ui-calendar__day--other-month {
  color: #ccc;
}

.ui-calendar__day--selected {
  background: #3490dc;
  color: white;
}

.ui-calendar__day--in-range {
  background: #e3f2fd;
}

.ui-calendar__day--range-start,
.ui-calendar__day--range-end {
  background: #3490dc;
  color: white;
}

.ui-calendar__day--disabled {
  color: #ddd;
  cursor: not-allowed;
  text-decoration: line-through;
}

.ui-calendar__day--weekend {
  color: #e74c3c;
}

.ui-calendar__day--today {
  font-weight: bold;
  border: 1px solid #3490dc;
}

.ui-calendar__actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.ui-calendar__btn {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.ui-calendar__btn--primary {
  background: #3490dc;
  color: white;
}

.ui-calendar__btn--primary:hover:not(:disabled) {
  background: #2779bd;
}

.ui-calendar__btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-calendar__btn--secondary {
  background: #e0e0e0;
  color: #333;
}

.ui-calendar__btn--secondary:hover {
  background: #d0d0d0;
}

.ui-calendar__range-info {
  margin-top: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
  color: #666;
}

.ui-calendar__error {
  margin-top: 12px;
  padding: 8px;
  background: #fee;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
  color: #e74c3c;
}
</style>
