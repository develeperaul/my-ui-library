# Calendar

Компонент календаря для выбора одной даты или диапазона дат.

<!-- ## Установка

```bash
npm install my-ui-library
``` -->

## Импорт

```vue
<script setup>
import { Calendar } from 'my-ui-library'
import 'my-ui-library/style.css'
</script>
```

## Базовое использование

## Одиночный выбор

```vue
<template>
  <Calendar mode="single" v-model="date" />
</template>

<script setup>
import { ref } from 'vue'
const date = ref(null)
</script>
```

## Выбор диапазона

```vue
<template>
  <Calendar mode="range" v-model="range" />
</template>

<script setup>
import { ref } from 'vue'
const range = ref({ start: null, end: null })
</script>
```

## Свойства

| Свойство        | Тип                          | По умолчанию | Описание             |
| :-------------- | :--------------------------- | :----------- | :------------------- |
| `mode`          | `'single' \| 'range'`        | `'single'`   | Режим выбора         |
| `modelValue`    | `Date \| RangeValue \| null` | `null`       | Выбранное значение   |
| `minDate`       | `Date`                       | `undefined`  | Минимальная дата     |
| `maxDate`       | `Date`                       | `undefined`  | Максимальная дата    |
| `disabledDates` | `Date[]`                     | `[]`         | Заблокированные даты |
| `enabledDates`  | `Date[]`                     | `[]`         | Разрешённые даты     |
| `showActions`   | `boolean`                    | `true`       | Показать кнопки      |
| `restrictions`  | `DateRestriction`            | `{}`         | Ограничения          |

## RangeValue

```ts
interface RangeValue {
  start: Date | null
  end: Date | null
}
```

## DateRestriction

| Свойство           | Тип        | Описание                     |
| :----------------- | :--------- | :--------------------------- |
| `noPast`           | `boolean`  | Запретить прошлые даты       |
| `noFuture`         | `boolean`  | Запретить будущие даты       |
| `disableToday`     | `boolean`  | Запретить сегодня            |
| `disableWeekends`  | `boolean`  | Запретить выходные           |
| `disabledWeekdays` | `number[]` | Запрещённые дни (0=вс, 1=пн) |
| `maxRangeDays`     | `number`   | Максимум дней в диапазоне    |
| `minRangeDays`     | `number`   | Минимум дней в диапазоне     |

## События (Emits)

| Событие             | Аргументы              | Описание              |
| :------------------ | :--------------------- | :-------------------- |
| `update:modelValue` | `(value: any) => void` | При изменении         |
| `apply`             | `(value: any) => void` | При клике "Применить" |
| `reset`             | `() => void`           | При клике "Сбросить"  |

## Запрет прошлых дат

```vue
<Calendar mode="single" :restrictions="{ noPast: true }" />
```

## Запрет выходных

```vue
<Calendar mode="single" :restrictions="{ disableWeekends: true }" />
```

## Ограничение диапазона (макс. 7 дней)

```vue
<Calendar mode="range" :restrictions="{ maxRangeDays: 7 }" />
```

## Запрет определённых дней недели

```vue
<!-- Запрет пн(1) и ср(3) -->
<Calendar mode="single" :restrictions="{ disabledWeekdays: [1, 3] }" />
```

## Только разрешённые даты

```vue
<Calendar
  mode="single"
  :enabledDates="[new Date(2024, 2, 15), new Date(2024, 2, 16), new Date(2024, 2, 17)]"
/>
```

## С границами

```vue
<Calendar mode="range" :minDate="new Date(2024, 0, 1)" :maxDate="new Date(2024, 11, 31)" />
```

## Без кнопок (мгновенный выбор)

```vue
<Calendar mode="range" :showActions="false" />
```

## С обработчиками

```vue
<Calendar mode="range" @apply="handleApply" @reset="handleReset" />

<script setup>
const handleApply = (range) => {
  console.log('Выбран период:', range)
}

const handleReset = () => {
  console.log('Сброшено')
}
</script>
```

## Комбинированные ограничения

```vue
<Calendar
  mode="range"
  :restrictions="{
    noPast: true,
    disableWeekends: true,
    maxRangeDays: 14,
    minRangeDays: 3
  }"
/>
```

# Стилизация

## CSS переменные

```css
:root {
  --ui-color-primary: #3490dc; /* Основной цвет */
  --ui-color-primary-dark: #2779bd; /* Тёмный оттенок */
  --ui-radius-md: 8px; /* Скругление */
  --ui-transition: all 0.2s ease; /* Анимация */
}
```

## Кастомные стили

```vue
<template>
  <Calendar class="my-calendar" />
</template>

<style>
.my-calendar {
  --ui-color-primary: #ff6b6b;
  --ui-radius-md: 16px;
}

.my-calendar .ui-calendar__day--selected {
  background: linear-gradient(135deg, #667eea, #764ba2);
}
</style>
```

## CSS классы

| Класс                            | Описание         |
| :------------------------------- | :--------------- |
| `.ui-calendar`                   | Корневой элемент |
| `.ui-calendar__day--selected`    | Выбранная дата   |
| `.ui-calendar__day--in-range`    | В диапазоне      |
| `.ui-calendar__day--range-start` | Начало диапазона |
| `.ui-calendar__day--range-end`   | Конец диапазона  |
| `.ui-calendar__day--disabled`    | Заблокирована    |
| `.ui-calendar__day--weekend`     | Выходной         |
| `.ui-calendar__day--today`       | Сегодня          |

## Примечания

### Требования к компоненту выбора дат

- Сравнение дат: Сравнение дат выполняется без учёта времени (сравниваются только год, месяц и день)
- Сортировка диапазона: При выборе диапазона даты автоматически сортируются
- Валидация: При нарушении ограничений показывается сообщение об ошибке
- Ограничения: Навигация блокируется при достижении minDate/maxDate

## Демо календарей с ограничениями

```vue
<template>
  <div style="padding: 40px; font-family: sans-serif; max-width: 1200px; margin: 0 auto">
    <h1>📅 Calendar Component - С ограничениями</h1>

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 40px">
      <!-- 1. Нельзя выбирать прошлые даты -->
      <div>
        <h3>Нельзя выбирать прошлые даты</h3>
        <Calendar
          mode="single"
          :restrictions="{ noPast: true }"
          @apply="(date) => console.log('Выбрано:', date)"
        />
      </div>

      <!-- 2. Нельзя выбирать выходные -->
      <div>
        <h3>Нельзя выбирать выходные</h3>
        <Calendar mode="single" :restrictions="{ disableWeekends: true }" />
      </div>

      <!-- 3. Максимум 7 дней в диапазоне -->
      <div>
        <h3>Максимум 7 дней</h3>
        <Calendar mode="range" :restrictions="{ maxRangeDays: 7 }" :showActions="true" />
      </div>

      <!-- 4. Только будущие даты -->
      <div>
        <h3>Только будущие даты</h3>
        <Calendar mode="single" :restrictions="{ noPast: true, disableToday: true }" />
      </div>

      <!-- 5. Только определённые даты -->
      <div>
        <h3>Только определённые даты</h3>
        <Calendar
          mode="single"
          :enabledDates="[
            new Date(2024, 2, 15),
            new Date(2024, 2, 16),
            new Date(2024, 2, 17),
            new Date(2024, 2, 20)
          ]"
        />
      </div>

      <!-- 6. Запрет определённых дней недели (пн, ср, пт) -->
      <div>
        <h3>Только вт, чт, сб, вс</h3>
        <Calendar mode="single" :restrictions="{ disabledWeekdays: [1, 3, 5] }" />
      </div>
    </div>
  </div>
</template>
```
