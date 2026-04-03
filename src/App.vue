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

<script setup lang="ts">
import Calendar from './components/Calendar.vue'
</script>
